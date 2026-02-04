const https = require("https");
const fs = require("fs");
const path = require("path");

const API_KEY = "sk_e932145fac08357dd9ca2fb3d9050acc22fb2e4800fb7da7";
const OUTPUT_DIR = path.join(__dirname, "files");
const TEXT = "This is how your customers find you. Not your front door. Not your phone number. This app.";

const tests = [
  {
    name: "test_daniel_expressive",
    voiceId: "onwK4e9ZLuTAKqWW03F9",
    voiceName: "Daniel",
    settings: { stability: 0.35, similarity_boost: 0.7, style: 0.45 },
  },
  {
    name: "test_adam_expressive",
    voiceId: "pNInz6obpgDQGcFmaJgB",
    voiceName: "Adam",
    settings: { stability: 0.35, similarity_boost: 0.7, style: 0.45 },
  },
  {
    name: "test_charlie_expressive",
    voiceId: "IKne3meq5aSn9XLyUdCD",
    voiceName: "Charlie",
    settings: { stability: 0.35, similarity_boost: 0.7, style: 0.45 },
  },
  {
    name: "test_brian_expressive",
    voiceId: "nPczCjzI2devNBz1zQrb",
    voiceName: "Brian",
    settings: { stability: 0.35, similarity_boost: 0.7, style: 0.45 },
  },
  {
    name: "test_chris_expressive",
    voiceId: "iP95p4xoKVk53GoZ742B",
    voiceName: "Chris",
    settings: { stability: 0.4, similarity_boost: 0.7, style: 0.4 },
  },
];

function generateSpeech(test) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(OUTPUT_DIR, `${test.name}.mp3`);
    const body = JSON.stringify({
      text: TEXT,
      model_id: "eleven_multilingual_v2",
      voice_settings: test.settings,
    });

    const options = {
      hostname: "api.elevenlabs.io",
      path: `/v1/text-to-speech/${test.voiceId}`,
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    console.log(`Generating: ${test.voiceName} (${test.name})...`);

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errBody = "";
        res.on("data", (chunk) => (errBody += chunk));
        res.on("end", () => {
          reject(new Error(`HTTP ${res.statusCode} for ${test.voiceName}: ${errBody}`));
        });
        return;
      }

      const file = fs.createWriteStream(outputPath);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        const stats = fs.statSync(outputPath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`  -> Saved ${test.name}.mp3 (${sizeKB} KB)`);
        resolve({ name: test.name, voice: test.voiceName, file: outputPath, sizeKB });
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`\nElevenLabs Voice Test - ${tests.length} combinations\n`);
  console.log(`Text: "${TEXT}"\n`);

  const results = [];
  for (let i = 0; i < tests.length; i++) {
    try {
      const result = await generateSpeech(tests[i]);
      results.push(result);
    } catch (err) {
      console.error(`  -> FAILED: ${err.message}`);
      results.push({ name: tests[i].name, voice: tests[i].voiceName, error: err.message });
    }
    if (i < tests.length - 1) {
      await delay(500);
    }
  }

  console.log("\n--- SUMMARY ---");
  results.forEach((r) => {
    if (r.error) {
      console.log(`  FAIL  ${r.voice} (${r.name}): ${r.error}`);
    } else {
      console.log(`  OK    ${r.voice} (${r.name}.mp3) - ${r.sizeKB} KB`);
    }
  });
  console.log("");
}

main();
