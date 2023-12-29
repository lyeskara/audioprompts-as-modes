import { Request, Response } from 'express';
import Mode from '../models/mode.js';




export default async function newMode(req: Request, res: Response) {
    
    const newmode = req.body.mode;
    let mode;

    try {
        const modeExist = await Mode.findOne(newmode);
        if (!modeExist) {
            mode = new Mode(newmode);
            await mode.save();
            res.send(mode);
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

