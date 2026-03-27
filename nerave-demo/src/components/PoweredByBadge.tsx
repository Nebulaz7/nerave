import { Wifi } from 'lucide-react';

export default function PoweredByBadge() {
  return (
    <div className="powered-by">
      <div className="powered-item">
        <div className="powered-dot live" />
        <Wifi size={12} />
        <span>Sepolia Testnet</span>
      </div>
      <div className="powered-item">
        <div className="powered-dot sandbox" />
        <span>Interswitch Sandbox</span>
      </div>
      <div className="powered-item">
        <div className="powered-dot live" />
        <span>nerave-sdk v0.2.0</span>
      </div>
    </div>
  );
}
