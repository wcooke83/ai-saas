// Quick script to list available embedding models from Google AI Studio API
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('GOOGLE_API_KEY not set');
    process.exit(1);
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
  const data = await response.json();

  if (!data.models) {
    console.error('No models found:', data);
    return;
  }

  const embeddingModels = data.models.filter((m) =>
    m.supportedGenerationMethods?.includes('embedContent')
  );

  console.log(`\nFound ${embeddingModels.length} embedding-capable models:\n`);
  embeddingModels.forEach((m) => {
    console.log(`  Name: ${m.name}`);
    console.log(`  Display: ${m.displayName}`);
    console.log(`  Methods: ${m.supportedGenerationMethods.join(', ')}`);
    console.log('');
  });
}

listModels().catch(console.error);
