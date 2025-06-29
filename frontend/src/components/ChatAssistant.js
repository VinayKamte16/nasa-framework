import React, { useState } from 'react';
import './ChatAssistant.css';

const apiUrl = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/assistant`
  : '/api/assistant';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hi! I am your NASA Assistant. Ask me anything about NASA data or missions.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setLoading(true);
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      
      // Handle the new JSON response format
      if (data.messages && data.messages.length > 0) {
        // Find the assistant's response (last message with role 'assistant')
        const assistantMessage = data.messages.find(msg => msg.role === 'assistant');
        if (assistantMessage) {
          setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage.content }]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: 'No response received.' }]);
        }
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Unexpected response format.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error.' }]);
    }
    setInput('');
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-assistant-container">
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>{msg.content}</div>
        ))}
        {loading && <div className="chat-message assistant">Thinking...</div>}
      </div>
      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about NASA..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>Send</button>
      </div>
    </div>
  );
};

export default ChatAssistant; 