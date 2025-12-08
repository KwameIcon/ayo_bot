import { useState } from 'react';
import './App.css';
import ChatbotModal, { getCurrentTime } from './components/ChatbotModal';
import ChatbotButton from './components/ChatbotButton';
import video from './assets/4k Video ｜ Technology Looped Background ｜ No Copyright Loop Background Video.mp4';

function App() {

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
      }}
      className="App"
    >
      {/* Background Video */}
      <video src={video} width="800" height="450" autoPlay muted loop className='fixed inset-0 w-screen h-screen z-2 object-cover'/>

      {/* Background Overlay */}
      <div className='fixed inset-0 w-screen h-screen bg-black opacity-60 z-2'></div>

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
