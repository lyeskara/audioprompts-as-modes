"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoToSummary = void 0;
var ytdl_core_1 = require("ytdl-core");
var fs_1 = require("fs");
var fluent_ffmpeg_1 = require("fluent-ffmpeg");
var url_1 = require("url");
var openai_1 = require("openai");
var configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    baseOptions: {
        maxBodyLength: 26214400 // 25 MB
    }
});
var openai = new openai_1.OpenAIApi(configuration);
var summary;
function videoToSummary(urlstring) {
    return __awaiter(this, void 0, void 0, function () {
        var videoID, outputFile, videoReadableStream, transcript, Prompt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videoID = getYouTubeVideoID(urlstring);
                    outputFile = "/home/music/".concat(videoID, ".mp3");
                    videoReadableStream = (0, ytdl_core_1.default)(urlstring, {
                        filter: 'audioonly',
                        quality: 'highestaudio',
                    });
                    return [4 /*yield*/, Future(convertVideoToAudio(videoReadableStream, outputFile))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Future(transcribeAudio(outputFile))];
                case 2:
                    transcript = _a.sent();
                    if (!transcript) {
                        console.log("there is no transcript");
                    }
                    return [4 /*yield*/, Future(SummarizeTranscript(transcript))];
                case 3:
                    Prompt = _a.sent();
                    if (!Prompt) {
                        console.log("there is no Prompt");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.videoToSummary = videoToSummary;
function Future(promise) {
    return __awaiter(this, void 0, void 0, function () {
        var value, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promise];
                case 1:
                    value = _a.sent();
                    return [2 /*return*/, value];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getYouTubeVideoID(url) {
    var urlObj = new url_1.URL(url);
    var params = new url_1.URLSearchParams(urlObj.search);
    return params.get('v');
}
;
function convertVideoToAudio(videoReadableStream, outputFile) {
    return new Promise(function (resolve, reject) {
        (0, fluent_ffmpeg_1.default)(videoReadableStream)
            .audioBitrate(128)
            .toFormat('mp3')
            .save(outputFile)
            .on('end', function () {
            resolve('Conversion from video to audio complete.');
        })
            .on('error', function (err) {
            console.error(err);
            reject(err);
        });
    });
}
function transcribeAudio(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var transcript, Error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, openai.createTranscription(fs_1.default.createReadStream(filename), "whisper-1")];
                case 1:
                    transcript = _a.sent();
                    return [2 /*return*/, transcript.data.text];
                case 2:
                    Error_1 = _a.sent();
                    // Handle the error 
                    console.error("An error occurred:", Error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function SummarizeTranscript(transcript) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var GPTresponse, summary_1, Error_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, openai.createChatCompletion({
                            model: 'gpt-3.5-turbo',
                            messages: [
                                {
                                    role: "user",
                                    content: "i will give a prompt that is speaking of a certain subject.\n                              i want you to include the main points of this subject. \n                              include what the author said that is important and add details if the author is lacking. \n                              i would like you to be concise in your answer with no boilerplate just straight to the point.\n                              dont go over 20 lines when explaining. \n                              here is the prompt: ".concat(transcript)
                                }
                            ],
                        })];
                case 1:
                    GPTresponse = _d.sent();
                    summary_1 = (_c = (_b = (_a = GPTresponse === null || GPTresponse === void 0 ? void 0 : GPTresponse.data) === null || _a === void 0 ? void 0 : _a.choices[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
                    if (summary_1 !== undefined) {
                        return [2 /*return*/, summary_1];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    Error_2 = _d.sent();
                    // Handle the error 
                    console.error("An error occurred:", Error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getStreams(url) {
    var videoReadableStream = (0, ytdl_core_1.default)(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
    });
    return videoReadableStream;
}
getStreams("onDdWlK_ZsA");
