import { Request, Response } from 'express';
import Discussion from '../models/discussion.js';
import Mode from '../models/mode.js';


export default async function storeDiscussion(req: Request, res: Response) {

    const modeName = req.body.mode
    const convo = req.body.discussion

    const mode = await Mode.findOne({ name: modeName });
    if (!mode) {
        return res.status(404).send('Mode not found');
    }

    const modeId = mode._id;

    try {

        (Discussion.deleteMany({ modeId: modeId }))
            .then(() => {
                const discussion = new Discussion({ modeId: modeId, conversation: convo });
                discussion.save();
            })
            .catch((err) => {
                console.log(err.message)
            })

    } catch (error) {
        console.error(error.message)
    }
}

