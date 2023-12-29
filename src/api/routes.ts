import { Express } from "express";

import getModes from "./controllers/getModes.js";
import newMode from "./controllers/newMode.js";
import getDiscussion from "./controllers/getDiscussion.js";
import userprompt from "./controllers/userprompt.js";
import storeDiscussion from "./controllers/storeDiscussion.js";
import validate from "./controllers/validate.js";
import convertToPrompt from './controllers/convertToPrompt.js'
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
