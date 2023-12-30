const readlineSync = require('readline-sync');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;

require('dotenv').config()

let conversation = [];
const api_url = process.env.API_URL;

let selectedMode;
let password;
const Axios = axios.create();

axiosRetry(Axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

async function talkWithGPT() {
    let input = '';
    while (input !== 'exit') {
        input = readlineSync.question("You: ");
        if (input !== 'exit') {
            try {
                conversation.push({ role: "user", content: input });
                const res = await Axios.post(`${api_url}/userprompt`, { conversation, password: password });
                console.log("GPT: ", res.data);
                conversation.push({ role: "assistant", content: res.data });
            } catch (error) {
                
                console.error("Error communicating with GPT:", error.message);
            }
        }
    }
    console.log("Exiting...");
    try {
        if (selectedMode !== undefined) {
            await Axios.post(`${api_url}/storeDiscussion`, { mode: selectedMode, discussion: conversation, password: password });
        }
    } catch (error) {
        console.error("Error storing discussion:", error.message);
    }
}

async function selectExistingMode() {
    while (true) { // Keep asking until a valid mode is selected or the user types 'back'
        try {
            const response = await Axios.get(`${api_url}/getModes?password=${password}`);
            const data = response.data
            const modes = new Map(data);
            console.log("Available modes:", Array.from(modes.keys()));
            selectedMode = readlineSync.question("Select a mode or type 'back' to go back: ");

            if (modes.has(selectedMode)) {
                const discussionType = readlineSync.question("Do you want to create a new discussion? (y/no): ");
                if (discussionType === 'no') {
                    try {
                        const response = await Axios.get(`${api_url}/${selectedMode}/getdiscussion?password=${password}`);
                        const previousMessages = response.data;
                        conversation.push(...previousMessages);
                        await talkWithGPT();
                        return;
                    } catch (error) {
                        if (error.response && error.response.status === 404) {
                            console.log("There is no previous discussion in this mode. Select 'y' next time to not fall here.");
                        } else {
                            console.error("An error occurred while fetching the discussion:", error.message);
                        }
                    }
                } else if (discussionType === 'y') {
                    let context = { role: "system", content: modes.get(selectedMode) };
                    conversation.push(context);
                    await talkWithGPT();
                    return;
                } else {
                    console.log("Invalid selection. Please answer with 'y' or 'no'.");
                }
            } else if (selectedMode === 'back') {
                return;
            } else {
                console.log("Invalid mode selection. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching modes or messages:", error.message);
            break
        }
    }
}

async function createManuallyNewMode() {
    selectedMode = readlineSync.question("Enter the name of the mode: ");
    const description = readlineSync.question("Enter the context of the query: ");
    const prompt = `Whatever is presented here is a prompt use it as context for later questions, here is the content for context of later discussions: ${description}`
    conversation.push({ role: "user", content: prompt });
    try {
        await Axios.post(`${api_url}/newmode`, { mode: { name: selectedMode, description: description }, password: password });
        await talkWithGPT();
    } catch (error) {
        console.error("Error creating mode:", error.message);
    }
}

async function createPrompt() {
    selectedMode = readlineSync.question("Enter the name of the mode of this video url: ");
    const youtubeURL = readlineSync.question("Enter a YouTube URL: ");
    try {
            const response = await Axios.post(`${api_url}/convertToPrompt`, { password: password , url: youtubeURL},  { headers: { 'Content-Type': 'application/json' } });
            const prompt = `Whatever is presented here is a prompt use it as context for later questions, here is the content for context of later discussions: ${response.data}`
            conversation.push({ role: "user", content: prompt });
            await Axios.post(`${api_url}/newmode`, { mode: { name: selectedMode, description: prompt }, password: password });
            await talkWithGPT();
    } catch (error) {
        console.error("Error creating youtube Prompt:", error.message);
    }
}

async function createNewMode() {
    const createFromYoutube = readlineSync.question("Want to create a new mode with youtube url or manually set one? (y/no): ");
    switch (createFromYoutube) {
        case "y":
            await createPrompt()
            break;
        case "no":
            await createManuallyNewMode();
            break;
        default:
            console.log("Invalid option. Please try again.");

    }
}

async function createOrSelectMode() {
    while (true) {
        const newMode = readlineSync.question("Want to create a new mode? (y/no/back): ");
        switch (newMode) {
            case 'back':
                return;
            case 'y':
                await createNewMode();
                break;
            case 'no':
                await selectExistingMode();
                break;
            default:
                console.log("Invalid option. Please try again.");
        }
    }
}

async function selectMode() {
    while (true) {
        const selectMode = readlineSync.question("Do you want to select a mode? (y/no/exit): ");

        if (selectMode === 'exit') {
            console.log("Exiting...");
            return;
        }

        switch (selectMode) {
            case 'no':
                console.log("Vanilla GPT activated.");
                return await talkWithGPT();
            case 'y':
                await createOrSelectMode();
                break;
            default:
                console.log("Invalid option. Please try again.");
        }
    }
}


async function authenticate() {
    password = readlineSync.question("Enter the access password: ", { hideEchoBack: true });
    try {
        await Axios.post(`${api_url}/validate`, { password: password });
        return true;
    } catch (err) {
        console.error("Authentication failed:", err.message);
        return false;
    }
}

async function main() {
    console.log("Hello! Welcome to prompts-as-modes.");

    let authorized = false;
    while (!authorized) {
        authorized = await authenticate()

        if (authorized) {
            await selectMode();
        } else {
            const tryAgain = readlineSync.question("Access denied. Do you want to try again? (y/n): ");
            if (tryAgain.toLowerCase() !== 'y') {
                console.log("Exiting application...");
                break;
            }
        }
    }
}

main();

