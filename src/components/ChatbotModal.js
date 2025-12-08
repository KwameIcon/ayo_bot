import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ExpandIcon, Send, X } from 'lucide-react';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TypingEffect } from '../utils/typingEffect';
import { getAIResponse } from '../utils/aiAgent';
import { motion } from 'framer-motion';



export const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};


const loadingMessages = [
    "Analyzing your request",
    "Fetching relevant data",
    "Generating response",
]


// --- Message Bubble Component ---
const Message = React.memo(({ message }) => {
    const isUser = message.sender === 'user';
    const [typedText, setTypedText] = useState("");

    // Tailwind classes based on sender
    const bubbleClasses = isUser
        ? "bg-blue-600 text-white rounded-t-xl rounded-bl-xl rounded-br-sm shadow-md ml-auto"
        : "bg-gray-800 text-white rounded-t-xl rounded-br-xl rounded-bl-sm shadow-md mr-auto";

    const alignmentClasses = isUser ? "flex justify-end text-left" : "flex justify-start text-left";
    const timeAlignment = isUser ? "text-right" : "text-left";
    const avatar = isUser ? '👤' : '🤖';
    const avatarClasses = isUser ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800';

    return (
        <div className={alignmentClasses}>
            {/* Bot Avatar (left side) */}
            {!isUser && (
                <div className={`w-8 h-8 rounded-full ${avatarClasses} flex items-center justify-center text-sm mr-2 mt-1 flex-shrink-0`}>
                    {avatar}
                </div>
            )}

            {/* Message Content */}
            <div className="max-w-[80%] flex flex-col">
                <div className={`p-3 max-w-full text-left break-words whitespace-pre-wrap ${bubbleClasses}`}>
                    {message.sender === 'bot' ? (
                        <main className="max-w-4xl mx-auto prose prose-headings:text-white prose-a:text-blue-600 prose-strong:text-success prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:rounded prose-blockquote:bg-orange-50 prose-blockquote:p-2 prose-blockquote:pl-4 prose-blockquote:text-gray-800 prose-blockquote:italic prose-code:text-gray-400 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-table:border prose-table:border-gray-300 prose-th:bg-cyan-500 prose-th:text-gray-700 prose-th:px-2 prose-td:text-gray-600 prose-td:px-2">
                            <TypingEffect text={message.text || "..."} speed={5} onUpdate={setTypedText} />
                            <Markdown remarkPlugins={[remarkGfm]}>
                                {typedText}
                            </Markdown>

                        </main>
                    ) : (
                        message.text
                    )}
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${timeAlignment} pr-1`}>
                    Sent {message.time}
                </div>
            </div>

            {/* User Avatar (right side) */}
            {isUser && (
                <div className={`w-8 h-8 rounded-full ${avatarClasses} flex items-center justify-center text-sm ml-2 mt-1 flex-shrink-0`}>
                    {avatar}
                </div>
            )}
        </div>
    );
});




const ChatbotModal = ({ onClose, messages, setMessages }) => {
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null); // Ref for auto-scrolling
    const [initialModalSize, setInitialModalSize] = useState({ width: '500px', height: '600px' });
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);


    // Effect to scroll to the bottom whenever messages or loading state changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);



    /**
 * Renders the animated bot thinking message with bouncing dots.
 */
    const AnimatedBotThinkingMessage = React.memo(() => (

        <div className="flex justify-start">
            {/* Bot Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center text-sm mr-2 mt-1 flex-shrink-0">
                🤖
            </div>

            {/* Animated thinking message */}
            <div className="w-full flex flex-col">
                <div className="bg-gray-800 text-white/80 p-3 rounded-t-xl rounded-br-xl rounded-bl-sm shadow-md max-w-[80%] flex items-end space-x-2">
                    {/* <AnimatePresence> */}
                    <motion.div
                        key={loadingMessageIndex}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.7 }}
                        className='animate-pulse'
                    >
                        {loadingMessages[loadingMessageIndex]}
                    </motion.div>
                    {/* </AnimatePresence> */}
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-[#00959c] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-[#107881] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-[#00959c] animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    ));



    const handleExpandModal = () => {
        setInitialModalSize({ width: initialModalSize.width === '500px' ? '1000px' : '500px', height: initialModalSize.height === '600px' ? '650px' : '600px' });
    }


    // Add async keyword to your outer function:
    const handleSend = useCallback(async () => {
        const text = userInput.trim();
        if (text === '' || isLoading) return;

        // --- User Message Logic ---
        const newUserMessage = {
            text: text,
            sender: 'user',
            time: getCurrentTime()
        };

        setMessages(prevMessages => [...prevMessages, newUserMessage]);
        setUserInput('');
        setIsLoading(true);
        setLoadingMessageIndex(0);
        let isFinal = false;


        // --- AI Response Logic ---
        await getAIResponse(userInput, isFinal, setMessages, setIsLoading, setLoadingMessageIndex);


    }, [userInput, isLoading, setMessages]);



    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            className="fixed bottom-24 right-5 w-96 h-96 z-40 bg-white rounded-xl shadow-2xl shadow-[#00959c]/50 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right"
            style={{
                width: initialModalSize.width,
                height: initialModalSize.height
            }}
        >
            {/* Header */}
            <header className="flex justify-between items-center p-4 bg-[#00959c] text-white shadow-md">
                <span className="text-xl font-extrabold tracking-tight">AyoBot</span>
                <div className="flex items-center space-x-5">
                    <button
                        onClick={handleExpandModal}
                        className="text-white hover:text-red-400 p-1 transition-colors rounded-full"
                        aria-label="Expand Chatbot"
                    >
                        <ExpandIcon size={20} />
                    </button>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-400 p-1 transition-colors rounded-full"
                        aria-label="Close Chatbot"
                    >
                        <X size={24} />
                    </button>
                </div>
            </header>

            {/* Conversation Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-5">
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}

                {/* RENDER TYPING INDICATOR WHEN LOADING IS TRUE */}
                {isLoading && <AnimatedBotThinkingMessage />}

                {/* Ref to scroll into view */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200 bg-white flex items-center">
                <input
                    type="text"
                    placeholder={isLoading ? "Please wait for the response..." : "Type a message..."}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isLoading} // Disable input while loading
                    className={`flex-1 border border-gray-300 rounded-full py-3 px-4 mr-3 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700
                               ${isLoading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                    aria-label="Type your message"
                />
                <button
                    onClick={handleSend}
                    disabled={userInput.trim() === '' || isLoading} // Disable button if input is empty OR loading
                    className={`w-12 h-12 rounded-full text-white flex items-center justify-center transition-colors shadow-lg
                                ${userInput.trim() && !isLoading
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    aria-label="Send message"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};
export default ChatbotModal;