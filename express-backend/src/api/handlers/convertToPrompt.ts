import { Request, Response } from 'express';
import videoToPrompt from "../../utils/videoToPrompt.js"

export default async function userprompt(req: Request, res: Response) {
    const url: string = req.body.url
    console.log(req.body)

    try {
        // Call the API with the current conversation
        const prompt = await videoToPrompt(url)
        res.status(201).send(prompt)

    } catch (error) {
        // Handle the error 
        console.error("An error occurred:", error.message);
        res.status(500).send("An error occurred while processing your request. Please try again later.");

    } finally {
        console.log("Request processing complete");
    }
}