export function BalanceDisplay({ balance, lastWinAmount }) {
  return (
    <div className="balance-display">
      <span className="balance-label">Balance</span>
      <span className="balance-value">${balance.toFixed(2)}</span>
      {lastWinAmount > 0 && (
        <span className="last-win visible">+${lastWinAmount.toFixed(2)}</span>
      )}
    </div>
  );
}
