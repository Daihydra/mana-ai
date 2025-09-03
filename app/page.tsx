'use client';

import { useState } from 'react';

// Define the type for a single generated component
interface GeneratedComponent {
  pageName: string;
  code: string | null;
}

// ... (The AppPlan interface remains the same)
interface AppPlan {
  appName: string;
  description: string;
  dataModels: { name: string; attributes: Record<string, string>; }[];
  pages: { name: string; description: string; components: string[]; }[];
}

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [plan, setPlan] = useState<AppPlan | null>(null);
  const [generatedComponents, setGeneratedComponents] = useState<GeneratedComponent[]>([]); // New state for multiple components
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleGeneratePlan = async () => {
    // ... (This function remains mostly the same)
    setIsLoadingPlan(true);
    setPlan(null);
    setGeneratedComponents([]); // Clear old components
    setError(null);
    setSaveStatus('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (response.ok) { setPlan(data); } 
      else { setError(data.error || 'Sorry, something went wrong.'); }
    } catch (err) {
      setError('An error occurred. The AI response might be malformed.');
    }
    setIsLoadingPlan(false);
  };

  const handleGenerateCode = async () => {
    if (!plan) return;
    setIsLoadingCode(true);
    setGeneratedComponents([]);
    setError(null);
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appPlan: plan }),
      });
      const data = await response.json();
      if (response.ok) {
        setGeneratedComponents(data.components); // Store the array of components
      } else {
        setError(data.error || 'Sorry, something went wrong generating the code.');
      }
    } catch (err) {
      setError('An error occurred while generating code.');
    }
    setIsLoadingCode(false);
  };

  const handleSavePlan = async () => {
    // ... (This function remains the same as before)
    if (!plan) return;
    setSaveStatus('Saving...');
    setError(null);
    try {
      const response = await fetch('/api/save-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
      });
      if (response.ok) {
        setSaveStatus('Saved!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save plan.');
        setSaveStatus('Error!');
      }
    } catch (err) {
      setError('An error occurred while saving the plan.');
      setSaveStatus('Error!');
    }
  };

  return (
    <main className="bg-gray-900 min-h-screen flex flex-col items-center text-white p-8">
      {/* ... (Header and initial form remain the same) ... */}
      <h1 className="text-5xl font-bold mb-4">Welcome to Mana AI</h1>
      <p className="text-lg mb-8">Describe the app you want to build.</p>
      <div className="w-full max-w-2xl">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          className="w-full h-40 p-4 bg-gray-800 border border-gray-700 rounded-md text-white resize-none"
          placeholder="For example: 'A simple to-do list app...'"
        />
        <button 
          onClick={handleGeneratePlan}
          disabled={isLoadingPlan}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-500">
          {isLoadingPlan ? 'Generating Plan...' : 'Generate App Plan'}
        </button>
      </div>

      {/* ... (Error display remains the same) ... */}
      {error && ( <div className="w-full max-w-2xl mt-8 p-4 bg-red-900 border border-red-700 rounded-md"><h2 className="text-xl font-bold">Error:</h2><p>{error}</p></div> )}

      {/* ... (Plan display remains the same, but Generate Code button is updated) ... */}
      {plan && (
        <div className="w-full max-w-2xl mt-8 p-6 bg-gray-800 border border-gray-700 rounded-md">
          <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold">{plan.appName}</h2><button onClick={handleSavePlan} disabled={saveStatus === 'Saving...' || saveStatus === 'Saved!'} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500">{saveStatus || 'Save Plan'}</button></div>
          <p className="mb-6">{plan.description}</p>
          <div className="mb-6"><h3 className="text-2xl font-bold mb-3">Data Models</h3>{plan.dataModels.map(model => ( <div key={model.name} className="mb-3 p-3 bg-gray-700 rounded"><h4 className="font-bold">{model.name}</h4><ul className="list-disc list-inside pl-2">{Object.entries(model.attributes).map(([key, value]) => ( <li key={key}>{key}: <span className="text-gray-400">{value}</span></li> ))}</ul></div> ))}</div>
          <div><h3 className="text-2xl font-bold mb-3">Pages</h3>{plan.pages.map(page => ( <div key={page.name} className="mb-3 p-3 bg-gray-700 rounded"><h4 className="font-bold">{page.name}</h4><p className="text-sm">{page.description}</p></div> ))}</div>
          <button
            onClick={handleGenerateCode}
            disabled={isLoadingCode}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-500"
          >
            {isLoadingCode ? 'Generating All Code...' : `Generate Code for All Pages`}
          </button>
        </div>
      )}

      {/* New display for multiple generated components */}
      {generatedComponents.length > 0 && (
        <div className="w-full max-w-2xl mt-8">
          {generatedComponents.map((component) => (
            component.code && (
              <div key={component.pageName} className="mb-8 bg-gray-950 border border-gray-700 rounded-md">
                <div className="p-4 flex justify-between items-center bg-gray-800 rounded-t-md">
                  <h2 className="text-2xl font-bold">{component.pageName} Code</h2>
                  <button
                    onClick={() => navigator.clipboard.writeText(component.code!)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
                  >
                    Copy Code
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code>{component.code}</code>
                </pre>
              </div>
            )
          ))}
        </div>
      )}
    </main>
  );
}