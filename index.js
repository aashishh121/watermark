const ffmpeg = require('fluent-ffmpeg');
const videoFile = 'video.mp4';
const imageFile = 'watermark.jpg';
const outputVideo = 'output.mp4';

ffmpeg()
  .input(imageFile)
  .inputOptions('-loop 1')
  .inputOptions('-t 1')
  .input(videoFile)
  .complexFilter([
    '[0:v]scale=-1:480,fade=t=out:st=0:d=1:alpha=1[delayed]',
    '[1:v][delayed]overlay=0:0'
  ])
  .outputOptions('-c:a copy')
  .outputOptions('-shortest')
  .output(outputVideo)
  .on('end', () => {
    console.log('Finished processing');
  })
  .on('error', (err) => {
    console.error(`Error: ${err}`);
  })
  .run();


const express = require('express');
var fs = require('fs');

const app = express();

// const ffmpeg = require('ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const http = require('http');

// Stream video and add watermark
const videoPath = 'video.mp4';
const watermarkPath = 'watermark.jpg';
const outputPath = 'output.mp4';
//const WATERMARK_PATH = `${__dirname}/watermark.jpg`;

const videoHandler = (req, res) => {
  new ffmpeg(fs.createReadStream(videoPath))
    .input(watermarkPath)
    .complexFilter("overlay='x=if(eq(mod(n\\,18)\\,0)\\,sin(random(1))*w\\,x):y=if(eq(mod(n\\,18)\\,0)\\,sin(random(1))*h\\,y)'")
    .outputOptions('-movflags frag_keyframe+empty_moov')
    .toFormat('mp4')
    .pipe(res, {end: true});
};

const server = http.createServer(videoHandler);
//const watermarkText = "Hello"


// ffmpeg(videoPath)
//     .input(watermarkPath)
//     .complexFilter([
//         {

//             filter: 'overlay',
//             options: { x: 'main_w-overlay_w-50', y: 'main_h-overlay_h-50' },
//         }
//     ])
//     .output(outputPath)
//     .on('end', () => console.log('Watermark added successfully'))
//     .on('error', (err) => console.log(`Error: ${err.message}`))
//     .run();



const PORT = 8000;


server.listen(PORT, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Server is runnig")
    }
});
