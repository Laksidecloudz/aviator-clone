import { useState, useEffect, useRef } from 'react';

const MOCK_USERS = [
  { name: 'm***8', color: '#8855ff' },
  { name: 's***3', color: '#ff8800' },
  { name: 'b***n', color: '#00ff88' },
  { name: '2***1', color: '#ff3366' },
  { name: 'k***5', color: '#ffcc00' },
  { name: 'j***0', color: '#00bcd4' },
  { name: 'r***7', color: '#e91e63' },
  { name: 'a***2', color: '#4caf50' },
  { name: 'p***9', color: '#9c27b0' },
  { name: 'd***4', color: '#ff5722' },
];

const CHAT_MESSAGES = [
  'Nice!',
  'Wow!',
  'Cashed out at 3x!',
  'Amazing multiplier!',
  'Hit 10x!',
  'Lost again 😅',
  'Going for 20x this time',
  'Good luck everyone!',
  'Finally a win!',
  'That was close!',
  'Easy 2x',
  'Big wins coming!',
  'Let\'s go!',
  'Easy money',
  'GG',
  '🚀',
  '💪',
  '🍀',
  '🎯',
  'Who else got that 5x?',
  'Free bets are nice!',
  'Just joined!',
  'How does this work?',
  'Set my auto cashout to 2.5x',
  'Smart move!',
];

const SYSTEM_MESSAGES = [
  'Rain drop incoming! 🌧️',
  'Big win alert! 🎉',
  'Server seed rotated',
  'Round history updated',
];

function getRandomUser() {
  return MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
}

function createMessage(id, type = 'chat') {
  const user = getRandomUser();
  if (type === 'system') {
    return {
      id,
      type: 'system',
      text: SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)],
      timestamp: new Date(),
    };
  }
  return {
    id,
    type: 'chat',
    user: user.name,
    color: user.color,
    text: CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)],
    timestamp: new Date(),
  };
}

export function ChatPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initial = [];
    for (let i = 0; i < 5; i++) {
      initial.push(createMessage(i, Math.random() > 0.8 ? 'system' : 'chat'));
    }
    setMessages(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newMsg = createMessage(
        Date.now(),
        Math.random() > 0.9 ? 'system' : 'chat'
      );
      setMessages((prev) => [...prev.slice(-50), newMsg]);
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span className="chat-title">Chat</span>
        <button className="chat-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="chat-msg system">
                <span className="msg-text">{msg.text}</span>
              </div>
            );
          }

          const isUser = msg.type === 'user';
          return (
            <div key={msg.id} className={`chat-msg ${isUser ? 'user' : ''}`}>
              {!isUser && (
                <span className="msg-user" style={{ color: msg.color }}>
                  {msg.user}
                </span>
              )}
              <span className="msg-text">{msg.text}</span>
              <span className="msg-time">{formatTime(msg.timestamp)}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={200}
        />
        <button className="chat-send" onClick={handleSend} disabled={!inputValue.trim()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
