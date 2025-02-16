import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [script, setScript] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGenerateScript = async () => {
    setScript("This is a generated script based on your input.");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-white mb-6">AI-Powered Script Generator</h1>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              placeholder="Enter your prompt here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Upload File</label>
            <div className="w-full flex items-center justify-center">
              <label className="flex flex-col items-center px-4 py-6 w-full bg-gray-700 text-gray-300 rounded-lg border-2 border-dashed border-gray-500 cursor-pointer hover:bg-gray-600">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM6 8a1 1 0 00-1.447-.894l-2 1A1 1 0 000 9v4a1 1 0 001.447.894l2 1A1 1 0 006 13V8z" />
                </svg>
                <span className="mt-2 text-base leading-normal">Select a file</span>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">External Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter an external link..."
            />
          </div>
          <button
            onClick={handleGenerateScript}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Generate Script
          </button>
          {script && (
            <div className="mt-6 p-6 bg-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Generated Script</h2>
              <p className="text-gray-300 whitespace-pre-line">{script}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
