import { Request, Response } from 'express';
import openai from "../../utils/openaiconfig.js";
import OpenAI from 'openai';

export default async function userprompt(req: Request, res: Response) {
    const messages = req.body.conversation;
    
    try {
        // Call the API with the current conversation
        const chatCompletion   = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages
        });
        // Get Ai text
        const gptResponse = chatCompletion .choices[0].message.content;
        console.log(gptResponse)
        res.send(gptResponse);

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
          console.error(error.status);  
          console.error(error.message); 
          console.error(error.code); 
          console.error(error.type);
        } else {
          // Non-API error
          console.log(error);
        }
      } finally {
        console.log("Request processing complete");
    }
}