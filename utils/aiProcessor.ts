import { ChannelType, ChannelStatus } from "../types";

const systemInstruction = `You are an AI assistant for managing notification channels. Your goal is to interpret the user's request and translate it into a structured JSON command.

Available actions are:
- FILTER: To show or find channels. Use this for requests like "show me", "find", "list all".
- ENABLE: To turn on a channel.
- DISABLE: To turn off a channel.
- DELETE: To remove a channel.
- UNKNOWN: If you cannot understand the user's request.

Identify the target channels based on their properties: displayName, type, status, or labels.

If the user says something like "disable the slack channel with an error", the target would be { "type": "Slack", "status": "Error" }.
If the user says "delete the 'Test alert' channel", the target would be { "displayName": "Test alert" }.
If a user asks to filter by a label like "team:sre", the target label would be { "key": "team", "value": "sre" }.

Always provide a friendly and concise confirmationMessage. For 'UNKNOWN' actions, the message should explain that you didn't understand and suggest what you can do.

Example user prompt: "Turn off the pagerduty alerts"
Example JSON output:
{
  "action": "DISABLE",
  "target": { "type": "PagerDuty" },
  "confirmationMessage": "Okay, I've disabled the PagerDuty channel(s)."
}

Example user prompt: "show me all channels with errors"
Example JSON output:
{
    "action": "FILTER",
    "target": { "status": "Error" },
    "confirmationMessage": "Here are all the channels with an error status."
}
`;


export interface AICommand {
    action: "FILTER" | "ENABLE" | "DISABLE" | "DELETE" | "UNKNOWN";
    target?: {
        displayName?: string;
        type?: ChannelType;
        status?: ChannelStatus;
        label?: { key: string; value: string };
    };
    confirmationMessage: string;
}

export async function processCommand(prompt: string): Promise<AICommand> {
    try {
        const { GoogleGenAI, Type } = await import('@google/genai');

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                action: { 
                    type: Type.STRING,
                    enum: ["FILTER", "ENABLE", "DISABLE", "DELETE", "UNKNOWN"],
                    description: "The action to perform on the channels."
                },
                target: {
                    type: Type.OBJECT,
                    description: "The criteria to identify the target channels.",
                    properties: {
                        displayName: { type: Type.STRING, description: "The name of the channel." },
                        type: { type: Type.STRING, enum: Object.values(ChannelType), description: "The type of the channel." },
                        status: { type: Type.STRING, enum: Object.values(ChannelStatus), description: "The status of the channel."},
                        label: {
                            type: Type.OBJECT,
                            properties: {
                                key: { type: Type.STRING },
                                value: { type: Type.STRING }
                            },
                            propertyOrdering: ["key", "value"],
                        }
                    }
                },
                confirmationMessage: {
                    type: Type.STRING,
                    description: "A friendly confirmation message to show the user after the action is completed."
                }
            },
            propertyOrdering: ["action", "target", "confirmationMessage"],
            required: ["action", "confirmationMessage"]
        };

        // The API key is expected to be available in the execution environment
        // as process.env.API_KEY.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        // Basic cleanup if the model wraps the JSON in markdown
        const cleanedJson = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
        const command = JSON.parse(cleanedJson) as AICommand;

        if (!command.action || !command.confirmationMessage) {
            throw new Error("Invalid command structure from AI");
        }
        
        return command;

    } catch (error) {
        console.error("Error processing AI command:", error);
         // Return a default error response that the UI can handle
        return {
            action: "UNKNOWN",
            confirmationMessage: "I'm sorry, I ran into a technical issue. Please try your request again."
        };
    }
}