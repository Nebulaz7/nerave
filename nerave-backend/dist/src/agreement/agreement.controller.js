"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementsController = void 0;
const common_1 = require("@nestjs/common");
const agreement_service_1 = require("./agreement.service");
const create_agreement_dto_1 = require("./dto/create-agreement.dto");
const combined_guard_1 = require("../auth/guard/combined.guard");
let AgreementsController = class AgreementsController {
    agreementsService;
    constructor(agreementsService) {
        this.agreementsService = agreementsService;
    }
    create(dto, req) {
        return this.agreementsService.create(dto, req.user);
    }
    findAll(req) {
        return this.agreementsService.findAll(req.user);
    }
    findOne(id, req) {
        return this.agreementsService.findOne(id, req.user);
    }
    confirmMilestone(agreementId, milestoneId, req) {
        return this.agreementsService.confirmMilestone(agreementId, milestoneId, req.user);
    }
};
exports.AgreementsController = AgreementsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_agreement_dto_1.CreateAgreementDto, Object]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':agreementId/milestones/:milestoneId/confirm'),
    __param(0, (0, common_1.Param)('agreementId')),
    __param(1, (0, common_1.Param)('milestoneId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AgreementsController.prototype, "confirmMilestone", null);
exports.AgreementsController = AgreementsController = __decorate([
    (0, common_1.Controller)(['agreement', 'agreements']),
    (0, common_1.UseGuards)(combined_guard_1.CombinedGuard),
    __metadata("design:paramtypes", [agreement_service_1.AgreementsService])
], AgreementsController);
//# sourceMappingURL=agreement.controller.js.map