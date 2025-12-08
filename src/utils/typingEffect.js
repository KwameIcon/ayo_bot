import { useEffect, useState } from "react";

export const TypingEffect = ({ text, speed = 50, onUpdate }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        let readText = "";
        const interval = setInterval(() => {
            readText += text.charAt(i);
            setDisplayedText(readText);
            i++;
            if (i >= text.length) clearInterval(interval);
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);

    if (onUpdate) onUpdate(displayedText);

    return null;
};
