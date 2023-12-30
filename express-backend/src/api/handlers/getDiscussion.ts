import { Request, Response } from 'express';

import Mode from '../models/mode.js';
import Discussion from '../models/discussion.js';

export default async function getDiscussion(req: Request, res: Response) {
    const modeName = req.params.mode;
    const mode = await Mode.findOne({ name: modeName });
    
    if (!mode) {
        return res.status(404).send('Mode not found');
    }

    const modeId = mode._id;

    const discussion = await Discussion.findOne({ modeId: modeId })
        .sort({ createdAt: -1 })
        .limit(1);

    if (!discussion) {
        return res.status(404).send('Discussion not found');
    }

    res.send(discussion.conversation);
}