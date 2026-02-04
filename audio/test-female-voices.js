const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_e932145fac08357dd9ca2fb3d9050acc22fb2e4800fb7da7';
const OUTPUT_DIR = path.join(__dirname, 'files');
const TEXT = 'This is how your customers find you. Not your front door. Not your phone number. This app.';

const voices = [
  { name: 'Rachel',    id: '21m00Tcm4TlvDq8ikWAM', file: 'test_rachel.mp3' },
  { name: 'Elli',      id: 'MF3mGyEYCl7XYWbV9V6O', file: 'test_elli.mp3' },
  { name: 'Bella',     id: 'EXAVITQu4vr4xnSDxMaL', file: 'test_bella.mp3' },
  { name: 'Charlotte', id: 'XB0fDUnXU5powFXDhCwa', file: 'test_charlotte.mp3' },
  { name: 'Alice',     id: 'Xb7hH8MSUJpSbSDYk0k2', file: 'test_alice.mp3' },
  { name: 'Lily',      id: 'pFZP5JQG7iQjIQuC4Bku', file: 'test_lily.mp3' },
  { name: 'Matilda',   id: 'XrExE9yKIg1WjnnlVkGX', file: 'test_matilda.mp3' },
];

function generateVoice(voice) {
  return new Promise((resolve, reject) => {
    const url = new URL('https://api.elevenlabs.io/v1/text-to-speech/' + voice.id);
    const body = JSON.stringify({
      text: TEXT,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.35,
        similarity_boost: 0.7,
        style: 0.5,
      },
    });

    const opts = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    console.log('Generating: ' + voice.name + ' (' + voice.id + ')...');

    const req = https.request(opts, (res) => {
      if (res.statusCode !== 200) {
        let errBody = '';
        res.on('data', (chunk) => errBody += chunk);
        res.on('end', () => {
          console.error('  FAILED ' + voice.name + ': HTTP ' + res.statusCode + ' - ' + errBody);
          resolve({ name: voice.name, file: voice.file, success: false, error: 'HTTP ' + res.statusCode });
        });
        return;
      }

      const outputPath = path.join(OUTPUT_DIR, voice.file);
      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        const stats = fs.statSync(outputPath);
        console.log('  OK ' + voice.name + ' -> ' + voice.file + ' (' + (stats.size / 1024).toFixed(1) + ' KB)');
        resolve({ name: voice.name, file: voice.file, success: true, size: stats.size });
      });
      fileStream.on('error', (err) => {
        console.error('  FAILED ' + voice.name + ': write error - ' + err.message);
        resolve({ name: voice.name, file: voice.file, success: false, error: err.message });
      });
    });

    req.on('error', (err) => {
      console.error('  FAILED ' + voice.name + ': ' + err.message);
      resolve({ name: voice.name, file: voice.file, success: false, error: err.message });
    });

    req.write(body);
    req.end();
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('');
  console.log('ElevenLabs Female Voice Test');
  console.log('Text: "' + TEXT + '"');
  console.log('');

  const results = [];
  for (let i = 0; i < voices.length; i++) {
    const result = await generateVoice(voices[i]);
    results.push(result);
    if (i < voices.length - 1) {
      await delay(500);
    }
  }

  console.log('');
  console.log('--- SUMMARY ---');
  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log('Success: ' + succeeded.length + '/' + results.length);
  succeeded.forEach((r) => {
    console.log('  ' + r.name.padEnd(12) + ' ' + r.file.padEnd(22) + ' ' + (r.size / 1024).toFixed(1) + ' KB');
  });

  if (failed.length > 0) {
    console.log('Failed: ' + failed.length);
    failed.forEach((r) => {
      console.log('  ' + r.name.padEnd(12) + ' ' + r.error);
    });
  }
}

main();
