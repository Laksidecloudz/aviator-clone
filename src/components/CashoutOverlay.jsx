export function CashoutOverlay({ cashoutData }) {
  if (!cashoutData) return null;

  return (
    <div className="cashout-overlay" key={cashoutData.amount + cashoutData.multiplier}>
      <div className="cashout-card">
        <div className="cashout-label">You have cashed out!</div>
        <div className="cashout-multiplier">{cashoutData.multiplier.toFixed(2)}x</div>
        <div className="cashout-amount">+${cashoutData.amount.toFixed(2)}</div>
      </div>
    </div>
  );
}
