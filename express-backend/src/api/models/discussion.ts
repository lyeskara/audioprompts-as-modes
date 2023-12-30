import mongoose from "mongoose";
import Prompt from "../../utils/prompt.js";

const discussionSchema = new mongoose.Schema({
    modeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mode',
        required: true
    },
    conversation: {
        type: Array<Prompt>,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Discussion', discussionSchema);
