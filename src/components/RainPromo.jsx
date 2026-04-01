import { useState, useEffect, useCallback } from 'react';

const MOCK_NAMES = ['m***8', 's***3', 'b***n', '2***1', 'k***5', 'j***0', 'r***7', 'a***2'];
const RAIN_MESSAGES = [
  'won', 'cashed out', 'hit', 'earned',
];

function getRandomName() {
  return MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
}

function getRandomAmount() {
  const base = Math.floor(Math.random() * 50) + 5;
  const cents = Math.floor(Math.random() * 100) / 100;
  return (base + cents).toFixed(2);
}

function getRandomMessage() {
  return RAIN_MESSAGES[Math.floor(Math.random() * RAIN_MESSAGES.length)];
}

function createRainItem(id) {
  return {
    id,
    name: getRandomName(),
    amount: getRandomAmount(),
    message: getRandomMessage(),
    multiplier: (Math.random() * 15 + 1).toFixed(2),
    createdAt: Date.now(),
  };
}

export function RainPromo() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const initial = [];
    for (let i = 0; i < 3; i++) {
      initial.push(createRainItem(i));
    }
    setItems(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newItem = createRainItem(Date.now());
      setItems((prev) => {
        const next = [...prev, newItem];
        return next.slice(-8);
      });
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setItems((prev) => prev.filter((item) => now - item.createdAt < 8000));
    }, 2000);

    return () => clearInterval(cleanup);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="rain-promo">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="rain-item"
          style={{
            animationDelay: `${index * 0.1}s`,
            bottom: `${60 + index * 36}px`,
          }}
        >
          <span className="rain-name">{item.name}</span>
          <span className="rain-action">{item.message}</span>
          <span className="rain-amount">${item.amount} USD</span>
        </div>
      ))}
    </div>
  );
}
