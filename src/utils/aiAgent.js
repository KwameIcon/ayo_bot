import { parseAgentResponse, removeCodeBlockMarkdown } from ".";
import { getAgentResponse, requestData } from "../API";
import { getCurrentTime } from "../components/ChatbotModal";


export const getAIResponse = async (userInput, isFinal, setMessages, setIsLoading, setLoadingMessageIndex) => {
    try {
            // --- Get Initial Agent Response ---
            const rawContent = await getAgentResponse(userInput);
            // console.log("Raw Content:", rawContent);


            const agentPayload = parseAgentResponse(removeCodeBlockMarkdown(rawContent)); // Get me the subscriber with this phone number: 233248769903


            // console.log("Agent Payload:", agentPayload);

            // --- Handle Request-for-Details Scenario ---
            let finalResponseText = agentPayload.response;

            if (finalResponseText === 'empty') {
                setLoadingMessageIndex(1);
                // console.log("Entered request-for-details flow with payload");
                const requestIdentifier = agentPayload.request_data.value;

                // return console.log("Request Identifier:", requestIdentifier);

                // Fetch the document details
                const docData = await requestData({ key: agentPayload.request_data.key, value: requestIdentifier });
                // console.log("Fetched document details:", docData);

                setLoadingMessageIndex(2);
                // Construct the prompt for the second agent call
                const detailPrompt = `User initial request: "${userInput}" Fetched details for ${agentPayload.request_data.key} (${agentPayload.request_data.value}): ${JSON.stringify(docData)} Using this information, generate a clear, structured Markdown response that directly addresses the user's original request. The response must be written entirely in Markdown — no JSON, no HTML, no code blocks. Use headings, bold labels, and bullet points where appropriate. Include all relevant details from the document in readable, user-friendly format. Do not just return raw data if the user asks for it but rather provide a clear and concise response. Remove Created At, Updated At fields. Return in this exact format:"<nicely formatted Markdown response>"`;

                // Await the content string from the second agent call
                const detailRawContent = await getAgentResponse(detailPrompt);

                // return console.log("Detail Raw Content:", detailRawContent);

                // Parse the content string (which handles backticks, JSON, etc.)
                const detailPayload = removeCodeBlockMarkdown(detailRawContent);
                // return console.log("Detail Payload:", detailPayload);

                // The second call is expected to return the final answer text directly
                finalResponseText = detailPayload;

                isFinal = true;
            }

            if(finalResponseText.includes("claim_ref")){
                setLoadingMessageIndex(2);

                const prompt = `Claim assessment: ${finalResponseText} Using this information, generate a clear, structured Markdown response. The response must be written entirely in Markdown — no JSON, no HTML, no code blocks.
Use headings, bold labels, and bullet points where appropriate. Include all relevant details from the document in readable, user-friendly format. Do not just return raw data but rather provide a clear and concise response. Remove Created At, Updated At fields. Return in this exact format:"<nicely formatted Markdown response>`

                const detailRawContent = await getAgentResponse(prompt);

                finalResponseText = detailRawContent;
            }


            finalResponseText = removeCodeBlockMarkdown(finalResponseText);
            // return console.log("Final Response Text:", finalResponseText);
            finalResponseText = finalResponseText.response || finalResponseText;

            // --- Display Final Bot Message ---
            const botMessage = {
                text: finalResponseText || "Sorry, I didn't quite get that!",
                sender: 'bot',
                time: getCurrentTime(),
                isFinal: isFinal
            };
            setMessages(prevMessages => [...prevMessages, botMessage]);

        } catch (error) {
            // --- Centralized Error Handling ---
            // console.error("Chatbot Workflow Error:", error);
            const errorMessage = {
                text: "Oops! Something went wrong. Please try again later.",
                sender: 'bot',
                time: getCurrentTime(),
                isFinal: false
            };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
};