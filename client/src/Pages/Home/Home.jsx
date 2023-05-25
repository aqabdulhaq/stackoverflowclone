import React, { useState } from 'react';
import './Chatbot.css';
import axios from 'axios';

import '../../App.css';
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar';
import RightSidebar from '../../components/RightSidebar/RightSidebar';
import HomeMainbar from '../../components/HomeMainbar/HomeMainbar';

const Home = ({ slideIn }) => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [botResponse, setBotResponse] = useState('');

  const handleUserQuery = (event) => {
    setUserQuery(event.target.value);
  };

  const sendUserQuery = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/chatbot', { query: userQuery });
      setBotResponse(response.data.response);
    } catch (error) {
      console.error('Error sending user query:', error);
    }
  };

  const openChatbot = () => {
    setChatbotOpen(true);
  };

  return (
    <div className="home-container-1">
      <LeftSidebar slideIn={slideIn} />
      <div className="home-container-2">
        <HomeMainbar />
        <RightSidebar />
        <div className="chatbot-container">
          {chatbotOpen && (
            <div className="chatbot-interface">
              <div className="chatbot-messages">
                {botResponse && <p className="bot-response">{botResponse}</p>}
              </div>
              <div className="chatbot-input">
                <input
                  type="text"
                  placeholder="Type your query..."
                  value={userQuery}
                  onChange={handleUserQuery}
                />
                <button onClick={sendUserQuery}>Send</button>
              </div>
            </div>
          )}
          <button className="chatbot-tab-button" onClick={openChatbot}>
            Chat with us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;