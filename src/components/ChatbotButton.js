import { X } from "lucide-react";

const ChatbotButton = ({ isOpen, onClick }) => (
    <button
        onClick={onClick}
        className="fixed bottom-5 right-5 z-50 p-4 rounded-full bg-[#00959c] text-white shadow-xl 
                   hover:bg-[#107881] transition-all duration-300 transform hover:scale-110 
                   w-16 h-16 flex items-center justify-center text-3xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close Chatbot' : 'Open Chatbot'}
    >
        {isOpen ? <X size={28} /> : <img src="/images/ayo_bot_logo_2.png" alt="Chatbot" className="w-14 h-14 object-cover" />}
    </button>
);

export default ChatbotButton;