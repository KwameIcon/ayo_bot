import { useEffect } from "react";


// Load env variables
const AYO_BOT_ID = process.env.REACT_APP_AYO_BOT_ID;
const AYO_BOT_SRC = process.env.REACT_APP_AYO_BOT_SRC;
const DATA_CHATBOT_ID = process.env.REACT_APP_DATA_CHATBOT_ID;
const CHATBOT_NAME = process.env.REACT_APP_CHATBOT_NAME;

// Check if env variables are defined
if (!AYO_BOT_ID || !AYO_BOT_SRC || !DATA_CHATBOT_ID || !CHATBOT_NAME) {
  alert("One or more required environment variables are missing.");
}


function Chatbot() {
  
  useEffect(() => {
    const scriptId = "do-agent-chatbot";
    if (document.getElementById(scriptId)) {
      return; 
    }

    // const logoPath = "/images/ayo_bot_logo_2.png";
    // const absolutePath = window.location.origin + logoPath;

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = AYO_BOT_SRC;

    // --- Attributes ---
    script.setAttribute("data-agent-id", AYO_BOT_ID);
    script.setAttribute("data-chatbot-id", DATA_CHATBOT_ID);
    script.setAttribute("data-name", CHATBOT_NAME);
    script.setAttribute("data-primary-color", "#00959c");
    script.setAttribute("data-secondary-color", "#E5E8ED");
    script.setAttribute("data-button-background-color", "#0061EB");
    script.setAttribute("data-starting-message", "Hello! How can I help you today?");
    script.setAttribute("data-logo", "https://raw.githubusercontent.com/KwameIcon/ayo_bot/refs/heads/main/public/images/ayo_bot_logo_2.png");
    // ------------------

    document.body.appendChild(script);

    return () => {
       const existingScript = document.getElementById(scriptId);
       if (existingScript) {
         document.body.removeChild(existingScript);
       }
    };

  }, []);

  return null;
}

export default Chatbot;