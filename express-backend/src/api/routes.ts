import { Express } from "express";

import getModes from "./handlers/getModes.js";
import newMode from "./handlers/newMode.js";
import getDiscussion from "./handlers/getDiscussion.js";
import userprompt from "./handlers/userprompt.js";
import storeDiscussion from "./handlers/storeDiscussion.js";
import validate from "./handlers/validate.js";
import convertToPrompt from './handlers/convertToPrompt.js'
export default function routes(app: Express) {
    // http GETs
    app.get('/getModes', getModes);
    app.get('/:mode/getdiscussion', getDiscussion);
    // http POSTs
    app.post('/validate', validate)
    app.post("/newmode", newMode)
    app.post("/userprompt", userprompt)
    app.post("/storeDiscussion", storeDiscussion)
    app.post("/convertToPrompt", convertToPrompt)
}
