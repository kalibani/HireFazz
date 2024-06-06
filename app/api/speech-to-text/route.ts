import { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';
const ffmpeg = require('fluent-ffmpeg');
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { openai } from '@/lib/openai';

// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegPath);

// Promisify the unlink function to delete files
const unlinkAsync = promisify(fs.unlink);

// Configure OpenAI API
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  // const { videoUrl } = req.query;
  const videoUrl = 'https://utfs.io/f/0d06d16c-2687-4ac9-9c50-09501485e514-b59ann.mp4'
  const videoUrlString = Array.isArray(videoUrl) ? videoUrl.join('/') : videoUrl;

  if (!videoUrlString) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  const tempVideoPath = path.resolve('/tmp', 'temp_video.mp3');
  
  try {
    // Download video and convert to MP3
    await convertVideoToMp3(videoUrlString, tempVideoPath);

    // Transcribe MP3 to text using Whisper
    const transcription = await transcribeAudioToText(tempVideoPath);

    // Clean up temporary video file
    await unlinkAsync(tempVideoPath);

    return res.status(200).json({ text: transcription });
  } catch (error) {
    console.error('Error:', error);
    if (fs.existsSync(tempVideoPath)) {
      await unlinkAsync(tempVideoPath);
    }
    return res.status(500).json({ error: 'Failed to process video' });
  }
};

const convertVideoToMp3 = async (videoUrl: string, outputFilePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const videoStream = ytdl(videoUrl, { filter: 'audioonly' });
    const outputStream = fs.createWriteStream(outputFilePath);

    ffmpeg(videoStream)
      .audioBitrate(128)
      .toFormat('mp3')
      .on('end', () => {
        console.log(`Conversion complete: ${outputFilePath}`);
        resolve(outputFilePath);
      })
      // @ts-ignore
      .on('error', (err) => {
        console.error('Error during conversion:', err);
        reject(err);
      })
      .pipe(outputStream, { end: true });
  });
}

const transcribeAudioToText = async (audioFilePath: string): Promise<string> => {
  const audioStream = fs.createReadStream(audioFilePath);

  const response = await openai.audio.transcriptions.create({
    file: audioStream as any,
    model: "whisper-1",
    response_format: "text",
  }
  );

  console.log('--->', response.text)

  return response.text;
}

export default POST;


