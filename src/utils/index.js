export const parseAgentResponse = (data) => {
    let agentPayload = {};
    if (!data || typeof data !== 'string') {
        return agentPayload;
    }

    let sanitizedString = data;
    let contentToParse = '';

    // --- Stage 1: Robustly extract content from the first Markdown code block (```[lang]...```) ---
    const fenceRegex = /```[a-z]*\s*([\s\S]*?)```/i;
    const match = sanitizedString.match(fenceRegex);

    if (match && match[1]) {
        // Found the fenced block. Use the content inside and proceed.
        contentToParse = match[1];
    } else {
        // --- Stage 2: Fallback for Unfenced or Embedded JSON ---
        const jsonFallbackRegex = /\{[\s\S]*\}/;
        const fallbackMatch = sanitizedString.match(jsonFallbackRegex);

        if (fallbackMatch && fallbackMatch[0]) {
            // Found a potential JSON string.
            contentToParse = fallbackMatch[0];
        } else {
            // Last resort: use the entire original string (will likely fail JSON.parse, 
            contentToParse = sanitizedString;
        }
    }

    // --- Stage 3: Cleanup and Parsing ---
    contentToParse = contentToParse.trim();

    // Fallback Sanitization for unquoted keys (e.g., {response: ...} -> {"response": ...})
    contentToParse = contentToParse.replace(/(\s*[\r\n]*)([a-zA-Z0-9_]+):/g, '$1"$2":');
    
    // Final trim
    contentToParse = contentToParse.trim();

    try {
        // Attempt to parse the cleaned string as JSON
        agentPayload = JSON.parse(contentToParse);
    } catch (e) {
        // console.error("Failed to parse JSON. Content used for parsing:", contentToParse);
        // console.error("Final Error:", e);
        
        // Fallback: If parsing fails, return the raw data as the response string
        agentPayload.response = data;
    }

    return agentPayload;
};



export const removeCodeBlockMarkdown = (rawContent) => {
  const regex = /```(?:\w*\s*)?([\s\S]*?)```/g;

  // Replace the entire code block match with the captured content (group 1).
  return rawContent.replace(regex, '$1').trim();
}