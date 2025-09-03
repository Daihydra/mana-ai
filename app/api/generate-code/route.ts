import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// This is the instruction for the AI, which we'll reuse for each page.
const systemPrompt = `
  You are an expert Next.js 14 developer specializing in React and Tailwind CSS.
  A user will provide a JSON object representing a single page from an application plan.
  Your task is to generate the code for a single, complete React component for that page.
  
  - Use TypeScript.
  - Use functional components with hooks.
  - Use Tailwind CSS for styling. Make it look clean and modern.
  - Do not include any explanations, just the raw code for the component.
  - Start the code with "'use client';" if it uses any hooks like useState.
`;

// This function asks the AI to generate code for a single page.
async function generateComponentCode(page: any) {
  const userPrompt = `
    Generate the React component code for the following page:
    ${JSON.stringify(page, null, 2)}
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.5,
  });

  return {
    pageName: page.name,
    code: response.choices[0].message.content,
  };
}

export async function POST(request: Request) {
  try {
    const { appPlan } = await request.json();

    // Create an array of promises, one for each page in the plan.
    const codeGenerationPromises = appPlan.pages.map(generateComponentCode);

    // Wait for all the code generation requests to complete.
    const generatedComponents = await Promise.all(codeGenerationPromises);

    return new Response(JSON.stringify({ components: generatedComponents }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in code generation:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate code' }), { status: 500 });
  }
}