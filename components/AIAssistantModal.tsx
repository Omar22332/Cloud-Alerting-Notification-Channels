import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, CloseIcon } from './IconComponents';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => Promise<ChatMessage>;
}

const suggestions = [
    "Show me channels with errors",
    "Disable all Slack channels",
    "Delete pending SMS channels",
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        setMessages([{ sender: 'ai', text: "Hello! How can I help you manage your notification channels today?" }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;
    
    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: prompt }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
        const aiResponse = await onSubmit(prompt);
        setMessages([...newMessages, aiResponse]);
    } catch (error) {
        console.error(error);
        setMessages([...newMessages, { sender: 'ai', text: "Sorry, something went wrong. Please try again." }]);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all flex flex-col"
        style={{ height: '70vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <SparklesIcon />
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white ml-2">AI Assistant</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <CloseIcon />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center flex-shrink-0"><SparklesIcon /></div>}
              <div className={`max-w-md px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center flex-shrink-0"><SparklesIcon /></div>
                 <div className="max-w-md px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                     <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 mb-2">
                {suggestions.map(s => (
                    <button key={s} onClick={() => handleSubmit(s)} disabled={isLoading} className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50">
                        {s}
                    </button>
                ))}
            </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Enable the 'Production Alerts' channel"
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
