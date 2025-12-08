import { useState } from 'react';
import './App.css';
import ChatbotModal, { getCurrentTime } from './components/ChatbotModal';
import ChatbotButton from './components/ChatbotButton';

function App() {

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
          { 
              // text: "Hello! I'm AyoBot, your AI assistant. Send a message to see the typing indicator!", 
              text: "HI, I'm AyoBot, your AI assistant. How can I help you today?",
              sender: 'bot', 
              time: getCurrentTime(),
              isFinal: false
          }
      ]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className="App">
      <div>
        <h1>My React App with DigitalOcean Chatbot</h1>
        <div>
          <>
            {/* Conditional rendering of the modal */}
            {isOpen && <ChatbotModal onClose={toggleChatbot} messages={messages} setMessages={setMessages} />}

            {/* The toggle button is always rendered */}
            <ChatbotButton isOpen={isOpen} onClick={toggleChatbot} />
          </>
        </div>
      </div>
    </div>
  );
}

export default App;
