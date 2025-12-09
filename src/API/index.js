
const AGENT_SECRET_KEY = "9n3Wi0SpAWhnydKVMLxSOfBwSWbyJE-4";
const AGENT_URL = "https://nzqzodcsdyifk37mhek47d4h.agents.do-ai.run";

if (!AGENT_SECRET_KEY || !AGENT_URL) {
    throw new Error("Missing required environment variables for agent API");
}


export const getAgentResponse = async (message) => {
    const response = await fetch(`${AGENT_URL}/api/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AGENT_SECRET_KEY}`
        },
        body: JSON.stringify({
            messages: [
                {
                    "role": "user",
                    "content": message
                }
            ]
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Agent API request failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();

    return data.choices[0].message.content;
}



export const requestData = async ({ key, value }) => {
    // return console.log("Requesting data with key:", key, "and value:", value);
    const response = await fetch(`https://cai.coverhub.app/api/chatbot/`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "key": key,
            "value": value
        })

    });

    // console.log("API response status:", response);

    const data = await response.json();
    // console.log("API response data:", data);
    return data;
}