const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'sk_e932145fac08357dd9ca2fb3d9050acc22fb2e4800fb7da7';
const OUTPUT_DIR = path.join(__dirname, 'files');
const TEXT = "Alright, so today we're talking about something that I think a lot of restaurant operators don't fully understand. Delivery revenue. And specifically how to protect it.";

// Friendlier, warmer male voices to test
const voices = [
  { name: 'Charlie', id: 'IKne3meq5aSn9XLyUdCD', desc: 'Casual, friendly Australian' },
  { name: 'George', id: 'JBFqnCBsd6RMkjVDRZzb', desc: 'Warm, friendly British' },
  { name: 'Callum', id: 'N2lVS1w4EtoT3dr4eOWO', desc: 'Soft-spoken, calming' },
  { name: 'Patrick', id: 'ODq5zmih8GrVes37Dizd', desc: 'Young, energetic' },
  { name: 'Eric', id: 'cjVigY5qzO86Huf0OWal', desc: 'Friendly, conversational' },
  { name: 'Chris', id: 'iP95p4xoKVk53GoZ742B', desc: 'Warm, natural American' },
];

function generateVoice(voice) {
  return new Promise((resolve, reject) => {
    const filename = `friendly_test_${voice.name.toLowerCase()}.mp3`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    const body = JSON.stringify({
      text: TEXT,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.75,
        style: 0.3,
      },
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${voice.id}`,
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    console.log(`Generating: ${voice.name} - ${voice.desc}...`);

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errBody = '';
        res.on('data', (chunk) => errBody += chunk);
        res.on('end', () => {
          console.log(`  FAILED ${voice.name}: HTTP ${res.statusCode}`);
          resolve({ name: voice.name, success: false });
        });
        return;
      }

      const file = fs.createWriteStream(outputPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(outputPath);
        console.log(`  OK ${voice.name} -> ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
        resolve({ name: voice.name, id: voice.id, desc: voice.desc, file: filename, success: true });
      });
    });

    req.on('error', (err) => {
      console.log(`  FAILED ${voice.name}: ${err.message}`);
      resolve({ name: voice.name, success: false });
    });

    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('\n=== Testing Friendly Male Voices ===\n');
  console.log(`Text: "${TEXT.substring(0, 60)}..."\n`);

  const results = [];
  for (const voice of voices) {
    const result = await generateVoice(voice);
    results.push(result);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n=== Results ===');
  results.filter(r => r.success).forEach(r => {
    console.log(`  ${r.name}: ${r.desc} -> ${r.file}`);
  });
}

main();
