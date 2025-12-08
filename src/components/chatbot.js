import { useEffect } from "react";


function Chatbot() {
  useEffect(() => {
    const scriptId = "do-agent-chatbot";
    if (document.getElementById(scriptId)) {
      return; 
    }

    const logoPath = "/images/ayo_logo.png";
    const absolutePath = window.location.origin + logoPath;

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = "https://do43j5lv7svmqu7qiculuyph.agents.do-ai.run/static/chatbot/widget.js";

    // --- Attributes ---
    script.setAttribute("data-agent-id", "f04e4b80-c6e4-11f0-b074-4e013e2ddde4");
    script.setAttribute("data-chatbot-id", "nAlPrYpQoQVZWG_irlGkQ5WjLmFx3wSn");
    script.setAttribute("data-name", "trial_agent Chatbot");
    script.setAttribute("data-primary-color", "#031B4E");
    script.setAttribute("data-secondary-color", "#E5E8ED");
    script.setAttribute("data-button-background-color", "#0061EB");
    script.setAttribute("data-starting-message", "Hello! How can I help you today?");
    script.setAttribute("data-logo", absolutePath);
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