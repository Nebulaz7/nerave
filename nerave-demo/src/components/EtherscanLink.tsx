import { ExternalLink } from 'lucide-react';

const ETHERSCAN_BASE = import.meta.env.VITE_ETHERSCAN_BASE_URL || 'https://sepolia.etherscan.io';

interface EtherscanLinkProps {
  address: string;
  type?: 'address' | 'tx';
}

export default function EtherscanLink({ address, type = 'address' }: EtherscanLinkProps) {
  if (!address) return null;

  const url = `${ETHERSCAN_BASE}/${type}/${address}`;
  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="etherscan-link"
      title={address}
    >
      {truncated}
      <ExternalLink size={11} />
    </a>
  );
}
