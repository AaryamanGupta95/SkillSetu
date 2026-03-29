import { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Lock, History } from 'lucide-react';
import api from '../services/api';
import './WalletPage.css';

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getWallet();
        setWallet(data.wallet);
        setTransactions(data.transactions || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="wp-loading"><div className="wp-spinner"></div></div>;
  if (!wallet) return <div className="wp-loading">Wallet unavailable</div>;

  return (
    <div className="wp-container">
      <div className="wp-header">
        <h1>My Wallet</h1>
        <p>Manage your SkillSetu credits</p>
      </div>

      <div className="wp-cards-row">
        <div className="wp-balance-card main">
          <div className="wp-card-icon"><WalletIcon size={24} /></div>
          <div className="wp-card-content">
            <span className="wp-card-label">Available Balance</span>
            <h2>{wallet.balance} <span>credits</span></h2>
          </div>
        </div>
        
        <div className="wp-balance-card secondary">
          <div className="wp-card-icon"><Lock size={20} /></div>
          <div className="wp-card-content">
            <span className="wp-card-label">Locked in Sessions</span>
            <h3>{wallet.locked} <span>credits</span></h3>
          </div>
        </div>

        <div className="wp-balance-card secondary">
          <div className="wp-card-icon"><ArrowUpRight size={20} /></div>
          <div className="wp-card-content">
            <span className="wp-card-label">Total Earned</span>
            <h3>{wallet.totalEarned} <span>credits</span></h3>
          </div>
        </div>
      </div>

      <div className="wp-history-section">
        <div className="wp-history-header">
          <h2><History size={18}/> Transaction History</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="wp-empty">No transactions yet</div>
        ) : (
          <div className="wp-tx-list">
            {transactions.map(tx => (
              <div key={tx.id} className="wp-tx-row">
                <div className="wp-tx-left">
                  <div className={`wp-tx-icon ${tx.type}`}>
                    {['earned', 'unlocked', 'bonus', 'refund'].includes(tx.type) ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                  <div className="wp-tx-info">
                    <strong>{tx.description}</strong>
                    <span>{new Date(tx.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className={`wp-tx-amount ${tx.type}`}>
                  {['earned', 'unlocked', 'bonus', 'refund'].includes(tx.type) ? '+' : '-'}{tx.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
