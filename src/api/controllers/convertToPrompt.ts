import { Request, Response } from 'express';
import {videoToSummary} from "../../utils/videoToSummary.js"

export default async function userprompt(req: Request, res: Response) {
    const url: string = req.params.url
    
    try {
        // Call the API with the current conversation
        const prompt = await videoToSummary(url)
        res.status(201).send(prompt)

    } catch (error) {
        // Handle the error 
        console.error("An error occurred:", error.message);
        res.status(500).send("An error occurred while processing your request. Please try again later.");

    } finally {
        console.log("Request processing complete");
    }
}