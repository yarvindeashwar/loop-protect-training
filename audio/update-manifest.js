const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync('narration-manifest.json', 'utf8'));

// Extract all section 2 entries
const section2 = manifest.slides.filter(s => s.id.startsWith('2-'));

// Create new section 2 with corrected mappings
const newSection2 = [
  // 2-1 through 2-4 stay the same
  section2.find(s => s.id === '2-1'),
  section2.find(s => s.id === '2-2'),
  section2.find(s => s.id === '2-3'),
  section2.find(s => s.id === '2-4'),
  
  // NEW 2-5: Continuous Monitoring (new audio)
  {
    id: '2-5',
    steps: [
      { step: 1, text: 'Guard watches this entire chain continuously. From your kitchen, through the POS, to every delivery platform. Every connection point is monitored in real-time... so when something breaks, Guard knows immediately. Now let me show you exactly how Guard detects these problems.', audio: 's2-5_step01_NEW.mp3' }
    ]
  },
  
  // 2-6: How Guard Detects (use old 2-5 audio)
  { id: '2-6', steps: section2.find(s => s.id === '2-5').steps },
  
  // 2-6b: OLO Early Warning (use old 2-6 audio)
  { id: '2-6b', steps: section2.find(s => s.id === '2-6').steps },
  
  // 2-7: Three Restore Modes (use old 2-6b audio)
  { id: '2-7', steps: section2.find(s => s.id === '2-6b').steps },
  
  // 2-8: What Guard Does Next (use old 2-7 audio)
  { id: '2-8', steps: section2.find(s => s.id === '2-7').steps },
  
  // 2-9: When Guard Backs Off (use old 2-8 audio)
  { id: '2-9', steps: section2.find(s => s.id === '2-8').steps },
  
  // 2-10: Downtime % Calc (use old 2-9 audio)
  { id: '2-10', steps: section2.find(s => s.id === '2-9').steps },
  
  // 2-10b: In Product Guard (use old 2-10 audio)
  { id: '2-10b', steps: section2.find(s => s.id === '2-10').steps },
  
  // 2-11: Lost Sales Calc (use old 2-10b audio)
  { id: '2-11', steps: section2.find(s => s.id === '2-10b').steps },
  
  // 2-12: Sales Saved (use old 2-11 audio)
  { id: '2-12', steps: section2.find(s => s.id === '2-11').steps },
  
  // 2-13: Staying Informed (use old 2-12 audio)
  { id: '2-13', steps: section2.find(s => s.id === '2-12').steps },
  
  // 2-14: Guard Loop (use old 2-13 audio)
  { id: '2-14', steps: section2.find(s => s.id === '2-13').steps }
];

// Reconstruct manifest
const section0_1 = manifest.slides.filter(s => s.id.startsWith('0-') || s.id.startsWith('1-'));
const section3Plus = manifest.slides.filter(s => {
  return !s.id.startsWith('0-') && !s.id.startsWith('1-') && !s.id.startsWith('2-');
});

manifest.slides = [...section0_1, ...newSection2, ...section3Plus];

// Write backup
fs.writeFileSync('narration-manifest.backup.json', JSON.stringify(JSON.parse(fs.readFileSync('narration-manifest.json')), null, 2));

// Write new manifest
fs.writeFileSync('narration-manifest.json', JSON.stringify(manifest, null, 2));

console.log('Manifest updated successfully!');
console.log('New section 2 slides:');
newSection2.forEach(s => {
  const firstText = s.steps[0].text.substring(0, 50);
  console.log('  ' + s.id + ': "' + firstText + '..."');
});
