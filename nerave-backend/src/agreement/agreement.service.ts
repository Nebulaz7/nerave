import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { User, Role } from '@prisma/client';
import { AgreementStatus } from '@prisma/client';
import { isAddress } from 'viem';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

@Injectable()
export class AgreementsService implements OnModuleInit {
  private readonly logger = new Logger(AgreementsService.name);

  constructor(
    private prisma: PrismaService,
    private blockchain: BlockchainService,
  ) {}

  async onModuleInit() {
    await this.reattachAllListeners();
  }

  private async reattachAllListeners() {
    const activeAgreements = await this.prisma.agreement.findMany({
      where: {
        contractAddress: { not: null },
        status: { notIn: [AgreementStatus.COMPLETED, AgreementStatus.CANCELLED] },
      },
    });

    this.logger.log(
      `Reattaching listeners for ${activeAgreements.length} active agreements`,
    );

    for (const agreement of activeAgreements) {
      const contractAddress = agreement.contractAddress;
      if (
        !contractAddress ||
        contractAddress.toLowerCase() === ZERO_ADDRESS
      ) {
        continue;
      }

      this.blockchain.listenToEvents(
        contractAddress,
        async (milestoneId, amount) => {
          this.logger.log(
            `MilestoneApproved — agreement: ${agreement.id}, milestone: ${milestoneId}`,
          );
          // payments service call goes here on Day 2
        },
      );
    }
  }
  
  async create(dto: CreateAgreementDto, client: User) {
    // Only clients can create agreements
    if (client.role !== Role.CLIENT) {
      throw new ForbiddenException('Only clients can create agreements');
    }

    // Validate contractor exists
    const contractor = await this.prisma.user.findUnique({
      where: { id: dto.contractorId },
    });
    if (!contractor) throw new NotFoundException('Contractor not found');
    if (contractor.role !== Role.CONTRACTOR) {
      throw new BadRequestException('Specified user is not a contractor');
    }

    // Validate milestone amounts add up to totalAmount
    const milestoneSum = dto.milestones.reduce((sum, m) => sum + m.amount, 0);
    if (milestoneSum !== dto.totalAmount) {
      throw new BadRequestException(
        `Milestone amounts (${milestoneSum}) must equal totalAmount (${dto.totalAmount})`,
      );
    }

    // Create agreement + milestones in DB first
    const agreement = await this.prisma.agreement.create({
      data: {
        clientId: client.id,
        contractorId: dto.contractorId,
        totalAmount: dto.totalAmount,
        milestones: {
          create: dto.milestones.map((m) => ({
            title: m.title,
            amount: m.amount,
          })),
        },
      },
      include: { milestones: true },
    });

    // Deploy smart contract on Sepolia
    // Joshua's deployAgreement() returns the contract address
    try {
      if (!isAddress(client.id) || !isAddress(contractor.id)) {
        this.logger.warn(
          `Skipping contract deployment for agreement ${agreement.id}: client/contractor IDs are not EVM addresses`,
        );
        return agreement;
      }

      const contractAddress = await this.blockchain.deployAgreement(
        client.id,        // placeholder — Joshua may want wallet addresses instead
        contractor.id,
        BigInt(dto.totalAmount),
      );

      // Save contract address back to agreement
      const updated = await this.prisma.agreement.update({
        where: { id: agreement.id },
        data: { contractAddress },
        include: { milestones: true },
      });

      // Start listening for MilestoneApproved events on this contract
      this.blockchain.listenToEvents(contractAddress, async (milestoneId, amount) => {
        this.logger.log(
          `MilestoneApproved fired — milestoneId: ${milestoneId}, amount: ${amount}`,
        );
        // This is where payments service will be called (Day 2)
        // For now just log it
      });

      return updated;
    } catch (err) {
      this.logger.error('Contract deployment failed', err);
      // Agreement is still saved in DB — deployment can be retried
      return agreement;
    }
  }

  async findOne(id: string, user: User) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id },
      include: {
        milestones: true,
        client: { select: { id: true, email: true, businessName: true } },
        contractor: { select: { id: true, email: true, businessName: true } },
        transactions: true,
      },
    });

    if (!agreement) throw new NotFoundException('Agreement not found');

    // Only client or contractor on this agreement can view it
    if (agreement.clientId !== user.id && agreement.contractorId !== user.id) {
      throw new ForbiddenException('You are not part of this agreement');
    }

    return agreement;
  }

  async confirmMilestone(
    agreementId: string,
    milestoneId: string,
    user: User,
  ) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id: agreementId },
      include: { milestones: true },
    });

    if (!agreement) throw new NotFoundException('Agreement not found');

    // Only parties on this agreement can confirm
    const isClient = agreement.clientId === user.id;
    const isContractor = agreement.contractorId === user.id;

    if (!isClient && !isContractor) {
      throw new ForbiddenException('You are not part of this agreement');
    }

    const milestone = agreement.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new NotFoundException('Milestone not found');
    if (milestone.disbursed) {
      throw new BadRequestException('Milestone already disbursed');
    }

    // Prevent double confirmation
    if (isClient && milestone.clientConfirmed) {
      throw new BadRequestException('You have already confirmed this milestone');
    }
    if (isContractor && milestone.contractorConfirmed) {
      throw new BadRequestException('You have already confirmed this milestone');
    }

    // Record confirmation in DB
    const updated = await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        clientConfirmed: isClient ? true : milestone.clientConfirmed,
        contractorConfirmed: isContractor ? true : milestone.contractorConfirmed,
      },
    });

    // Call contract to record confirmation on-chain
    if (agreement.contractAddress) {
      const milestoneIndex = agreement.milestones.findIndex(
        (m) => m.id === milestoneId,
      );
      await this.blockchain.confirmMilestone(
        agreement.contractAddress,
        milestoneIndex,
        isClient ? 'CLIENT' : 'CONTRACTOR',
      );
    }

    return {
      message: 'Milestone confirmed',
      clientConfirmed: updated.clientConfirmed,
      contractorConfirmed: updated.contractorConfirmed,
      fullyApproved: updated.clientConfirmed && updated.contractorConfirmed,
    };
  }

  async findAll(user: User) {
    return this.prisma.agreement.findMany({
      where: {
        OR: [{ clientId: user.id }, { contractorId: user.id }],
      },
      include: { milestones: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}