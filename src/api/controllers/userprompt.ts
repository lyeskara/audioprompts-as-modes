import { Request, Response } from 'express';
import openai from "../../utils/openaiconfig.js";

export default async function userprompt(req: Request, res: Response) {
    const messages = req.body.conversation;
    
    try {
        // Call the API with the current conversation
        const GPTresponse = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: messages
        });
        // Get Ai text
        const AiText = GPTresponse.data.choices[0].message.content;
        res.send(AiText);

    } catch (error) {
        // Handle the error 
        console.error("An error occurred:", error.message);
        res.status(500).send("An error occurred while processing your request. Please try again later.");

    } finally {
        console.log("Request processing complete");
    }
}