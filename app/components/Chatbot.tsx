'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';  

type Message = {
  role: 'user' | 'bot';
  content: string;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);  // For disabling button while waiting for response
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [listingId, setListingId] = useState<string | null>(null); // State to hold the listing ID

  useEffect(() => {
    const urlParts = window.location.href.split('/listings/');
    const id = urlParts.length > 1 ? urlParts[1] : null;
    setListingId(id);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;  // Prevent sending empty messages
    if (!listingId) {
      console.error('Listing ID is missing');
      return;
    }

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    setMessages((prevMessages) => [...prevMessages, { role: 'bot', content: "Thinking..." }]);

    try {
      const response = await axios.post('/api/bot', {
        messages: newMessages, listingId,  // Pass the updated messages array
      });

      const botResponse = response.data?.botResponse || 'Sorry, I couldn\'t understand that.';

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { role: 'bot', content: botResponse },
      ]);

    } catch (error) {
      console.error('Error fetching response:', error);

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),  // Remove the "Thinking..." message
        { role: 'bot', content: 'Sorry, something went wrong!' },
      ]);
    } finally {
      setLoading(false);  // Re-enable the button
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className="fixed bottom-5 right-5 w-80">
    <div className={`shadow-2xl rounded-t-xl flex flex-col ${isCollapsed ? 'h-10' : 'h-96'} bg-white`}>
      <div className="p-2 border-2 rounded-t-xl flex justify-between items-center cursor-pointer" onClick={toggleCollapse}>
        <span className="font-bold">{isCollapsed ? 'Chat with Vally' : 'Chat'}</span>
        <button className="text-gray-500">{isCollapsed ? '+' : '-'}</button>
      </div>

      {!isCollapsed && (
        <>
          <div className="flex-1 p-4 overflow-y-auto border-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-rose-500 text-white text-right'
                    : 'bg-gray-200 text-black text-left'
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className="p-3 border-2 flex items-center">
            <input
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-rose-500]"
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}  // Disable input while loading
            />
            <button
              className="ml-2 bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-500"
              onClick={sendMessage}
              disabled={loading}  // Disable button while loading
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </>
      )}
    </div>
    </div>
    );
};
export default Chatbot;