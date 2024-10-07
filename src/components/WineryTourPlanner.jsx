import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Textarea } from '@/components/ui/input';

const WineryTourPlanner = () => {
  const [currentUser, setCurrentUser] = useState('');
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const users = ['Driver', 'Lia', 'Julia', 'Chris'];

  useEffect(() => {
    // Initial message from Claude
    setConversation([
      {
        user: 'Claude',
        message: "Welcome to the Winery Tour Planner! I'm here to help you plan your Sonoma County trip. Who would like to start? Please select your name and share your thoughts or preferences for the trip."
      }
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput.trim() === '' || !currentUser) return;

    const newMessage = { user: currentUser, message: userInput };
    setConversation(prev => [...prev, newMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: [...conversation, newMessage],
          currentUser,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Claude');
      }

      const data = await response.json();
      setConversation(prev => [...prev, { user: 'Claude', message: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setConversation(prev => [...prev, { user: 'Claude', message: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Winery Tour Planner</h1>
      <Select 
        value={currentUser} 
        onChange={(e) => setCurrentUser(e.target.value)}
        className="mb-4"
      >
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user} value={user}>{user}</option>
        ))}
      </Select>
      <form onSubmit={handleSubmit} className="mb-4">
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your preferences, questions, or ideas..."
          className="mb-2"
        />
        <Button type="submit" disabled={!currentUser || isLoading}>
          {isLoading ? 'Sending...' : 'Submit'}
        </Button>
      </form>
      <div className="border p-4 h-80 overflow-y-auto">
        {conversation.map((entry, index) => (
          <div key={index} className="mb-2">
            <strong>{entry.user}:</strong> {entry.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WineryTourPlanner;