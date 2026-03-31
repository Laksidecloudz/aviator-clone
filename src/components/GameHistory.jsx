import { useMemo } from 'react';

function getHistoryColor(value) {
  if (value < 2) return 'red';
  if (value < 5) return 'green';
  return 'pink';  // 5x and above
}

export function GameHistory({ crashHistory }) {
  const items = useMemo(() => {
    return crashHistory.map((val, i) => ({
      value: val,
      color: getHistoryColor(val),
      key: i,
    }));
  }, [crashHistory]);

  if (items.length === 0) return null;

  return (
    <div className="history-bar">
      {items.map((item) => (
        <div key={item.key} className={`history-item ${item.color}`}>
          {item.value < 10 ? item.value.toFixed(2) : item.value.toFixed(1)}x
        </div>
      ))}
    </div>
  );
}
