const fs = require('fs');
const path = require('path');

const LOGS_DIR = 'C:\\Users\\Krynn\\.gemini\\antigravity-ide\\brain\\514930f2-3131-40b6-81be-07378d88267e\\.system_generated\\logs';
const transcriptPath = path.join(LOGS_DIR, 'transcript.jsonl');

if (!fs.existsSync(transcriptPath)) {
  console.error('Transcript file does not exist at:', transcriptPath);
  process.exit(1);
}

const fileContent = fs.readFileSync(transcriptPath, 'utf8');
const lines = fileContent.split('\n');

console.log(`Analyzing ${lines.length} log steps...`);

// Search backwards for the last browser step output
let foundDom = null;
for (let i = lines.length - 1; i >= 0; i--) {
  if (!lines[i].trim()) continue;
  try {
    const step = JSON.parse(lines[i]);
    // Check if the step has DOM output
    if (step.type === 'PLANNER_RESPONSE' && step.thinking && step.thinking.includes('DOM')) {
      // Or check if it's the browser_get_dom call/output
      // Actually let's search for step containing browser_get_dom tool output
    }
    if (step.tool_calls) {
      // check tool calls or results
    }
    // Let's search for HTML string inside content
    if (step.content && step.content.includes('id="streams-grid"')) {
      foundDom = step.content;
      console.log(`Found DOM string at step ${step.step_index}`);
      break;
    }
  } catch (e) {
    // ignore parsing errors
  }
}

if (foundDom) {
  // Extract and save the HTML grid section
  fs.writeFileSync('scratch_dom.txt', foundDom);
  console.log('Saved DOM output to scratch_dom.txt');
} else {
  console.log('Could not find DOM in transcript. Let\'s check general steps for HTML strings.');
  // Search for any large HTML substring
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('stream-card')) {
      console.log(`Line ${i} contains stream-card. Length: ${lines[i].length}`);
      fs.writeFileSync('scratch_line_' + i + '.txt', lines[i]);
    }
  }
}
