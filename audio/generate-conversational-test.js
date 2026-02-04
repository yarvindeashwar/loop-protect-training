const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_e932145fac08357dd9ca2fb3d9050acc22fb2e4800fb7da7';
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'narration-conversational-test.json'), 'utf8'));
const outDir = path.join(__dirname, 'files');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function generateAudio(text, filename) {
  return new Promise((resolve, reject) => {
    const outPath = path.join(outDir, filename);

    const body = JSON.stringify({
      text: text,
      model_id: manifest.model_id,
      voice_settings: manifest.voice_settings
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${manifest.voice_id}`,
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    console.log(`  Generating: ${filename}...`);

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errData = '';
        res.on('data', (d) => errData += d);
        res.on('end', () => {
          reject(new Error(`API ${res.statusCode}: ${errData}`));
        });
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(outPath, buffer);
        console.log(`  OK   ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
        resolve();
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log(`\nConversational Voice Test`);
  console.log(`Voice: ${manifest.voice_name} (${manifest.voice_id})`);
  console.log(`Model: ${manifest.model_id}`);
  console.log(`Settings: stability=${manifest.voice_settings.stability}, style=${manifest.voice_settings.style}`);
  console.log(`Output: ${outDir}\n`);

  let total = 0, generated = 0;

  for (const slide of manifest.slides) {
    console.log(`Slide ${slide.id}:`);
    for (const step of slide.steps) {
      total++;
      try {
        await generateAudio(step.text, step.audio);
        generated++;
        // Rate limit: 500ms between API calls
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error(`  FAIL ${step.audio}: ${err.message}`);
      }
    }
  }

  console.log(`\nDone: ${generated}/${total} generated`);
  console.log(`\nTo test, update deck-v2-s1.html to use narration-conversational-test.json`);
}

main().catch(console.error);
