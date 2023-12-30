import ytdl from 'ytdl-core';
import fs from 'fs'
import Ffmpeg from 'fluent-ffmpeg'
import { URL, URLSearchParams } from 'url'
import openai from "./openaiconfig.js"
import OpenAI from 'openai';


export default async function videoToPrompt(urlstring: string): Promise<string> {

    const videoID = getYouTubeVideoID(urlstring)
    const videoTitle = await getYouTubeVideoTitle(videoID)

    const outputFile = `/home/music/${videoTitle}.mp3`

    const videoReadableStream = ytdl(urlstring, {
        filter: 'audioonly',
        quality: 'highestaudio',
    });

    await Future(convertVideoToAudio(videoReadableStream, outputFile))

    const transcript = await Future(transcribeAudio(outputFile))
    if (!transcript) {
        console.log("there is no transcript")
        return;
    }

    const Prompt = await Future(summarizeTranscript(transcript))

    if (!Prompt) {
        console.log("there is no Prompt")
        return;
    }
    return Prompt

}

async function Future(promise: Promise<any>): Promise<string> {
    try {
        const value = await promise
        return value
    } catch (error) {
        console.error(error)
        return null
    }
}

// Function to get YouTube video title
async function getYouTubeVideoTitle(id: string) {
    try {
        const info = await ytdl.getInfo(id);
        return info.videoDetails.title;
    } catch (error) {
        console.error('Error getting video title:', error.message);
        return null;
    }
}

function getYouTubeVideoID(url: string) {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get('v');
}

function convertVideoToAudio(videoReadableStream: any, outputFile: string) {
    return new Promise((resolve, reject) => {
        Ffmpeg(videoReadableStream)
            .audioBitrate(128)
            .toFormat('mp3')
            .save(outputFile)
            .on('end', () => {
                resolve('Conversion from video to audio complete.');
            })
            .on('error', (err) => {
                console.error(err);
                reject(err);
            });
    })

}

async function transcribeAudio(filename: string) {
    try {
        const transcript = await openai.audio.transcriptions.create(
            { model: "whisper-1", file: fs.createReadStream(filename) }
        );
        return transcript.text
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
          console.error(error.status);  
          console.error(error.message); 
          console.error(error.code); 
          console.error(error.type);
        } else {
          // Non-API error
          console.log(error);
        }
      } 
}

async function summarizeTranscript(transcript: string) {
    const prompt: string = `i will give a prompt that is speaking of a certain subject.
                              i want you to include the main points of this subject. 
                              include what the author said that is important and add details if the author is lacking. 
                              i would like you to be concise in your answer with no boilerplate just straight to the point.
                              dont go over 20 lines when explaining. 
                              here is the prompt: ${transcript}`
    try {
        
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": prompt}],
          });
        const gptResponse = chatCompletion.choices[0].message.content;
        return gptResponse

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
          console.error(error.status);  
          console.error(error.message); 
          console.error(error.code); 
          console.error(error.type);
        } else {
          // Non-API error
          console.log(error);
        }
      } 
}



