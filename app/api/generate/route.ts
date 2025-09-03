import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const systemPrompt = `
      You are an expert web application architect. A user will provide a prompt describing an application.
      Your task is to generate a structured JSON object that represents a plan for this application.
      The JSON object must have the following structure:
      {
        "appName": "The name of the application",
        "description": "A brief, one-sentence description of the app.",
        "dataModels": [
          {
            "name": "ModelName",
            "attributes": {
              "attributeName1": "DataType (e.g., 'string', 'number', 'boolean', 'date')",
              "attributeName2": "DataType"
            }
          }
        ],
        "pages": [
          {
            "name": "PageName (e.g., 'HomePage', 'DashboardPage')",
            "description": "A brief description of what this page does.",
            "components": ["Component1", "Component2"]
          }
        ]
      }
      Only output the raw JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: "json_object" },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
    });

    const aiResponse = response.choices[0].message.content;

    return new Response(aiResponse, { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return new Response(JSON.stringify({ error: 'Failed to get response from AI' }), { status: 500 });
  }
}