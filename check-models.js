// check-models.js
import { get } from 'https';

// 1. Get the key from your environment
// (If this prints undefined, you need to paste your key in the string below)
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY; 

if (!apiKey) {
  console.error("❌ No API Key found. Please run this command like:");
  console.error("GOOGLE_GENERATIVE_AI_API_KEY=your_key_here node check-models.js");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("🔍 Checking available models...");

get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => { data += chunk; });

  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error(`❌ Error ${res.statusCode}: ${data}`);
      return;
    }

    const response = JSON.parse(data);
    const models = response.models || [];

    // Filter for models that support 'generateContent'
    const availableModels = models.filter(m => 
      m.supportedGenerationMethods.includes("generateContent")
    );

    console.log(`\n✅ Found ${availableModels.length} usable models for your account:\n`);
    
    availableModels.forEach(m => {
      console.log(`- ${m.name.replace('models/', '')}`); // Clean name for the SDK
      console.log(`  (Version: ${m.version}, Description: ${m.description.substring(0, 50)}...)`);
      console.log('---');
    });

    console.log("\n👉 RECOMMENDATION: Pick one of the names above (like 'gemini-1.5-flash-001') and put it in your route.ts");
  });

}).on("error", (err) => {
  console.error("Error: " + err.message);
});