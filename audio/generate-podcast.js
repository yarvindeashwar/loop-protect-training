const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_e932145fac08357dd9ca2fb3d9050acc22fb2e4800fb7da7';
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'podcast-dialogue-test.json'), 'utf8'));
const outDir = path.join(__dirname, 'files');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function generateDialogue(slideId, dialogue) {
  return new Promise((resolve, reject) => {
    const filename = `podcast_${slideId.replace('-', '_')}.mp3`;
    const outPath = path.join(outDir, filename);

    // Convert dialogue to API format
    const inputs = dialogue.map(line => ({
      text: line.text,
      voice_id: line.speaker === 1 ? manifest.host1_voice_id : manifest.host2_voice_id
    }));

    const body = JSON.stringify({
      model_id: manifest.model_id,
      inputs: inputs,
      settings: manifest.settings
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      path: '/v1/text-to-dialogue',
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    console.log(`\nGenerating dialogue for slide ${slideId}...`);
    console.log(`  ${dialogue.length} lines of dialogue`);
    console.log(`  Hosts: ${manifest.host1_name} & ${manifest.host2_name}`);

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
        console.log(`  OK: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
        resolve(filename);
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('='.repeat(50));
  console.log('PODCAST-STYLE DIALOGUE GENERATOR');
  console.log('='.repeat(50));
  console.log(`\nModel: ${manifest.model_id}`);
  console.log(`Host 1: ${manifest.host1_name} (${manifest.host1_voice_id})`);
  console.log(`Host 2: ${manifest.host2_name} (${manifest.host2_voice_id})`);
  console.log(`Output: ${outDir}`);

  const results = [];

  for (const slide of manifest.slides) {
    try {
      const filename = await generateDialogue(slide.id, slide.dialogue);
      results.push({ id: slide.id, file: filename, success: true });
      // Rate limit
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      results.push({ id: slide.id, success: false, error: err.message });
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('RESULTS');
  console.log('='.repeat(50));
  results.forEach(r => {
    if (r.success) {
      console.log(`  ✓ Slide ${r.id}: ${r.file}`);
    } else {
      console.log(`  ✗ Slide ${r.id}: ${r.error}`);
    }
  });

  console.log('\nTo test, open the generated MP3 files in the audio/files folder');
}

main().catch(console.error);
