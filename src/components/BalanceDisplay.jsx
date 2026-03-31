export function BalanceDisplay({ balance, lastWinAmount }) {
  return (
    <div className="balance-display">
      <span className="balance-label">Balance</span>
      <span className="balance-value">{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
      {lastWinAmount > 0 && (
        <span className="last-win visible">+{lastWinAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
      )}
    </div>
  );
}
