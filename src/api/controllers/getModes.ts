import { Request, Response } from 'express';
import Mode from '../models/mode.js';

export default async function getModes(req: Request, res: Response) {
    try {
        const modes = await Mode.find({});
        const modesMap = new Map(modes.map((mode) => [mode.name, mode.description]));
        const modesJSON = JSON.stringify([...modesMap]);
        res.status(200).send(modesJSON);
    } catch (error) {
        console.error('Error fetching modes:', error.message);
        res.status(500).send('Error fetching modes from database.');
    }
}