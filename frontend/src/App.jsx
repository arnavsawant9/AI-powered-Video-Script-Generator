// import React, { useState } from 'react';

// function App() {
//   const [prompt, setPrompt] = useState('');
//   const [file, setFile] = useState(null);
//   const [link, setLink] = useState('');
//   const [script, setScript] = useState('');

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleGenerateScript = async () => {
//     setScript("This is a generated script based on your input.");
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
//       <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-lg p-8">
//         <h1 className="text-4xl font-bold text-center text-white mb-6">AI-Powered Script Generator</h1>
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-400 mb-2">Prompt</label>
//             <textarea
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//               rows="3"
//               placeholder="Enter your prompt here..."
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-400 mb-2">Upload File</label>
//             <div className="w-full flex items-center justify-center">
//               <label className="flex flex-col items-center px-4 py-6 w-full bg-gray-700 text-gray-300 rounded-lg border-2 border-dashed border-gray-500 cursor-pointer hover:bg-gray-600">
//                 <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM6 8a1 1 0 00-1.447-.894l-2 1A1 1 0 000 9v4a1 1 0 001.447.894l2 1A1 1 0 006 13V8z" />
//                 </svg>
//                 <span className="mt-2 text-base leading-normal">Select a file</span>
//                 <input type="file" className="hidden" onChange={handleFileChange} />
//               </label>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-400 mb-2">External Link</label>
//             <input
//               type="text"
//               value={link}
//               onChange={(e) => setLink(e.target.value)}
//               className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//               placeholder="Enter an external link..."
//             />
//           </div>
//           <button
//             onClick={handleGenerateScript}
//             className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
//           >
//             Generate Script
//           </button>
//           {script && (
//             <div className="mt-6 p-6 bg-gray-700 rounded-lg">
//               <h2 className="text-xl font-semibold text-white mb-4">Generated Script</h2>
//               <p className="text-gray-300 whitespace-pre-line">{script}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
























// // src/App.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // Base URL for API endpoints
// const API_BASE_URL = 'http://localhost:8000/api';

// function App() {
//   const [prompt, setPrompt] = useState('');
//   const [title, setTitle] = useState('');
//   const [files, setFiles] = useState([]);
//   const [links, setLinks] = useState('');
//   const [language, setLanguage] = useState('English');
//   const [script, setScript] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [savedScripts, setSavedScripts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedScript, setSelectedScript] = useState(null);
  
//   // Load saved scripts on component mount
//   useEffect(() => {
//     fetchSavedScripts();
//   }, [currentPage, searchQuery, language]);
  
//   const fetchSavedScripts = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/search-scripts/`, {
//         params: {
//           page: currentPage,
//           page_size: 5,
//           q: searchQuery,
//           language: language
//         }
//       });
      
//       setSavedScripts(response.data.results);
//       setTotalPages(response.data.total_pages);
//     } catch (error) {
//       console.error('Error fetching saved scripts:', error);
//     }
//   };
  
//   const handleFileChange = (e) => {
//     setFiles(Array.from(e.target.files));
//   };
  
//   const handleGenerateScript = async () => {
//     if (!prompt.trim()) {
//       alert('Please enter a prompt');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       const formData = new FormData();
//       formData.append('prompt', prompt);
//       formData.append('title', title);
//       formData.append('language', language);
//       formData.append('links', links);
      
//       // Append each file to form data
//       files.forEach(file => {
//         formData.append('files', file);
//       });
      
//       const response = await axios.post(`${API_BASE_URL}/generate-script/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
      
//       setScript(response.data.generated_script);
//       setSelectedScript(response.data);
//       fetchSavedScripts();  // Refresh saved scripts list
//     } catch (error) {
//       console.error('Error generating script:', error);
//       alert('Failed to generate script. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleExport = async (format = 'txt') => {
//     if (!selectedScript) return;
    
//     try {
//       const response = await axios.get(`${API_BASE_URL}/export-script/${selectedScript.id}/?format=${format}`);
      
//       if (format === 'txt') {
//         // Create and trigger download
//         const blob = new Blob([response.data.content], { type: 'text/plain' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = response.data.filename;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//       }
//     } catch (error) {
//       console.error('Error exporting script:', error);
//     }
//   };
  
//   const handleScriptSelect = (script) => {
//     setSelectedScript(script);
//     setScript(script.generated_script);
//   };
  
//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4 md:p-8">
//       <div className="w-full max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-lg p-4 md:p-8">
//         <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-6">AI-Powered Video Script Generator</h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Input Form */}
//           <div className="lg:col-span-2 space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">Title (Optional)</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//                 placeholder="Enter a title for your script..."
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">Prompt</label>
//               <textarea
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//                 rows="3"
//                 placeholder="Enter your prompt here..."
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">Upload Files</label>
//               <div className="w-full flex items-center justify-center">
//                 <label className="flex flex-col items-center px-4 py-6 w-full bg-gray-700 text-gray-300 rounded-lg border-2 border-dashed border-gray-500 cursor-pointer hover:bg-gray-600">
//                   <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM6 8a1 1 0 00-1.447-.894l-2 1A1 1 0 000 9v4a1 1 0 001.447.894l2 1A1 1 0 006 13V8z" />
//                   </svg>
//                   <span className="mt-2 text-base leading-normal">Select files</span>
//                   <input type="file" className="hidden" onChange={handleFileChange} multiple />
//                 </label>
//               </div>
//               {files.length > 0 && (
//                 <div className="mt-2 space-y-1">
//                   {files.map((file, index) => (
//                     <div key={index} className="text-sm text-gray-300 flex items-center">
//                       <span className="truncate">{file.name}</span>
//                       <span className="ml-2 text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">External Links</label>
//               <input
//                 type="text"
//                 value={links}
//                 onChange={(e) => setLinks(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//                 placeholder="Enter external links (comma separated)..."
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
//               <select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//               >
//                 <option value="English">English</option>
//                 <option value="Spanish">Spanish</option>
//                 <option value="French">French</option>
//                 <option value="German">German</option>
//                 <option value="Chinese">Chinese</option>
//               </select>
//             </div>
            
//             <button
//               onClick={handleGenerateScript}
//               disabled={loading}
//               className={`w-full ${
//                 loading ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
//               } text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex justify-center items-center`}
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Generating...
//                 </>
//               ) : (
//                 'Generate Script'
//               )}
//             </button>
//           </div>
          
//           {/* Saved Scripts */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold">Saved Scripts</h2>
//               <div className="flex space-x-2">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search..."
//                   className="p-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white"
//                 />
//                 <button 
//                   onClick={() => fetchSavedScripts()}
//                   className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
//                 >
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                     <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
//                   </svg>
//                 </button>
//               </div>
//             </div>
            
//             <div className="space-y-2 max-h-[400px] overflow-y-auto">
//               {savedScripts.length > 0 ? (
//                 savedScripts.map((script) => (
//                   <div
//                     key={script.id}
//                     onClick={() => handleScriptSelect(script)}
//                     className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                       selectedScript && selectedScript.id === script.id
//                         ? 'bg-blue-900 border border-blue-700'
//                         : 'bg-gray-700 hover:bg-gray-600'
//                     }`}
//                   >
//                     <h3 className="font-medium truncate">{script.title || 'Untitled'}</h3>
//                     <p className="text-xs text-gray-400 mt-1">
//                       {new Date(script.created_at).toLocaleString()}
//                     </p>
//                     <p className="text-sm text-gray-300 mt-1 line-clamp-2">
//                       {script.prompt}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-center py-4">No saved scripts found</p>
//               )}
//             </div>
            
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center space-x-2 mt-4">
//                 <button
//                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded ${
//                     currentPage === 1
//                       ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
//                       : 'bg-gray-700 text-white hover:bg-gray-600'
//                   }`}
//                 >
//                   Previous
//                 </button>
//                 <span className="px-3 py-1 bg-gray-700 rounded">
//                   {currentPage} / {totalPages}
//                 </span>
//                 <button
//                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded ${
//                     currentPage === totalPages
//                       ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
//                       : 'bg-gray-700 text-white hover:bg-gray-600'
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Generated Script */}
//         {script && (
//           <div className="mt-8 p-6 bg-gray-700 rounded-lg">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-white">Generated Script</h2>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(script);
//                     alert('Script copied to clipboard!');
//                   }}
//                   className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-sm"
//                 >
//                   Copy
//                 </button>
//                 <button
//                   onClick={() => handleExport('txt')}
//                   className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-sm"
//                 >
//                   Download
//                 </button>
//               </div>
//             </div>
//             <div className="prose prose-invert max-w-none">
//               <p className="text-gray-300 whitespace-pre-line">{script}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;



















































// // src/App.jsx   -----------------------------------------> WORKING PERFECTLY FINE!!!!!!!!!!!!
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // Base URL for API endpoints
// const API_BASE_URL = 'http://localhost:8000/api';

// function App() {
//   const [prompt, setPrompt] = useState('');
//   const [title, setTitle] = useState('');
//   const [files, setFiles] = useState([]);
//   const [links, setLinks] = useState('');
//   const [language, setLanguage] = useState('English');
//   const [script, setScript] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [savedScripts, setSavedScripts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedScript, setSelectedScript] = useState(null);
  
//   useEffect(() => {
//     fetchSavedScripts();
//   }, [currentPage, searchQuery, language]);
  
//   // const fetchSavedScripts = async () => {
//   //   try {
//   //     const response = await axios.get(`${API_BASE_URL}/search-scripts/`, {
//   //       params: { page: currentPage, page_size: 5, q: searchQuery, language }
//   //     });
//   //     setSavedScripts(response.data.results);
//   //     setTotalPages(response.data.total_pages);
//   //   } catch (error) {
//   //     console.error('Error fetching saved scripts:', error);
//   //   }
//   // };


//   const fetchSavedScripts = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/search-scripts/`, {
//         params: { page: currentPage, page_size: 5, q: searchQuery, language }
//       });
  
//       console.log("API Response:", response.data); // Debugging step
  
//       setSavedScripts(Array.isArray(response.data.results) ? response.data.results : []);
//       setTotalPages(response.data.total_pages || 1);
//     } catch (error) {
//       console.error('Error fetching saved scripts:', error);
//       setSavedScripts([]); // Fallback to empty array
//     }
//   };
  
  
//   const handleFileChange = (e) => {
//     setFiles([...files, ...Array.from(e.target.files)]);
//   };
  
//   const handleGenerateScript = async () => {
//     if (!prompt.trim()) {
//       alert('Please enter a prompt');
//       return;
//     }
//     setLoading(true);
    
//     try {
//       const formData = new FormData();
//       formData.append('prompt', prompt);
//       formData.append('title', title);
//       formData.append('language', language);
//       formData.append('links', links);
//       files.forEach(file => formData.append('files', file));
      
//       const response = await axios.post(`${API_BASE_URL}/generate-script/`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       setScript(response.data.generated_script);
//       setSelectedScript(response.data);
//       fetchSavedScripts();
//     } catch (error) {
//       console.error('Error generating script:', error);
//       alert('Failed to generate script. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleExport = async (format = 'txt') => {
//     if (!selectedScript) {
//       alert('No script selected for export.');
//       return;
//     }
//     try {
//       const response = await axios.get(`${API_BASE_URL}/export-script/${selectedScript.id}/?format=${format}`);
//       const blob = new Blob([response.data.content], { type: 'text/plain' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = response.data.filename;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     } catch (error) {
//       console.error('Error exporting script:', error);
//       alert('Failed to export script. Try again later.');
//     }
//   };
  
//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4 md:p-8">
//       <div className="w-full max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-lg p-4 md:p-8">
//         <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-6">AI-Powered Video Script Generator</h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Input Form */}
//           <div className="lg:col-span-2 space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">Title (Optional)</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//                 placeholder="Enter a title for your script..."
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">Prompt</label>
//               <textarea
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//                 rows="3"
//                 placeholder="Enter your prompt here..."
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">Upload Files</label>
//               <div className="w-full flex items-center justify-center">
//                 <label className="flex flex-col items-center px-4 py-6 w-full bg-gray-700 text-gray-300 rounded-lg border-2 border-dashed border-gray-500 cursor-pointer hover:bg-gray-600">
//                   <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM6 8a1 1 0 00-1.447-.894l-2 1A1 1 0 000 9v4a1 1 0 001.447.894l2 1A1 1 0 006 13V8z" />
//                   </svg>
//                   <span className="mt-2 text-base leading-normal">Select files</span>
//                   <input type="file" className="hidden" onChange={handleFileChange} multiple />
//                 </label>
//               </div>
//               {files.length > 0 && (
//                 <div className="mt-2 space-y-1">
//                   {files.map((file, index) => (
//                     <div key={index} className="text-sm text-gray-300 flex items-center">
//                       <span className="truncate">{file.name}</span>
//                       <span className="ml-2 text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">External Links</label>
//               <input
//                 type="text"
//                 value={links}
//                 onChange={(e) => setLinks(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//                 placeholder="Enter external links (comma separated)..."
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
//               <select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
//               >
//                 <option value="English">English</option>
//                 <option value="Spanish">Spanish</option>
//                 <option value="French">French</option>
//                 <option value="German">German</option>
//                 <option value="Chinese">Chinese</option>
//               </select>
//             </div>
            
//             <button
//               onClick={handleGenerateScript}
//               disabled={loading}
//               className={`w-full ${
//                 loading ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
//               } text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex justify-center items-center`}
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Generating...
//                 </>
//               ) : (
//                 'Generate Script'
//               )}
//             </button>
//           </div>
          
//           {/* Saved Scripts */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold">Saved Scripts</h2>
//               <div className="flex space-x-2">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search..."
//                   className="p-2 text-sm rounded-lg bg-gray-700 border border-gray-600 text-white"
//                 />
//                 <button 
//                   onClick={() => fetchSavedScripts()}
//                   className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
//                 >
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                     <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
//                   </svg>
//                 </button>
//               </div>
//             </div>
            
//             <div className="space-y-2 max-h-[400px] overflow-y-auto">
//               {savedScripts.length > 0 ? (
//                 savedScripts.map((script) => (
//                   <div
//                     key={script.id}
//                     onClick={() => handleScriptSelect(script)}
//                     className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                       selectedScript && selectedScript.id === script.id
//                         ? 'bg-blue-900 border border-blue-700'
//                         : 'bg-gray-700 hover:bg-gray-600'
//                     }`}
//                   >
//                     <h3 className="font-medium truncate">{script.title || 'Untitled'}</h3>
//                     <p className="text-xs text-gray-400 mt-1">
//                       {new Date(script.created_at).toLocaleString()}
//                     </p>
//                     <p className="text-sm text-gray-300 mt-1 line-clamp-2">
//                       {script.prompt}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-center py-4">No saved scripts found</p>
//               )}
//             </div>
            
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center space-x-2 mt-4">
//                 <button
//                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded ${
//                     currentPage === 1
//                       ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
//                       : 'bg-gray-700 text-white hover:bg-gray-600'
//                   }`}
//                 >
//                   Previous
//                 </button>
//                 <span className="px-3 py-1 bg-gray-700 rounded">
//                   {currentPage} / {totalPages}
//                 </span>
//                 <button
//                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded ${
//                     currentPage === totalPages
//                       ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
//                       : 'bg-gray-700 text-white hover:bg-gray-600'
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Generated Script */}
//         {script && (
//           <div className="mt-8 p-6 bg-gray-700 rounded-lg">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-white">Generated Script</h2>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => {
//                     navigator.clipboard.writeText(script);
//                     alert('Script copied to clipboard!');
//                   }}
//                   className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-sm"
//                 >
//                   Copy
//                 </button>
//                 <button
//                   onClick={() => handleExport('txt')}
//                   className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-sm"
//                 >
//                   Download
//                 </button>
//               </div>
//             </div>
//             <div className="prose prose-invert max-w-none">
//               <p className="text-gray-300 whitespace-pre-line">{script}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

































































// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';

// Base URL for API endpoints
const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState('');
  const [language, setLanguage] = useState('English');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const handleGenerateScript = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('title', title);
      formData.append('language', language);
      formData.append('links', links);
      files.forEach(file => formData.append('files', file));

      const response = await axios.post(`${API_BASE_URL}/generate-script/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setScript(response.data.generated_script);
    } catch (error) {
      console.error('Error generating script:', error);
      alert('Failed to generate script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format = 'txt') => {
    if (!script) {
      alert('No script generated for export.');
      return;
    }
    try {
      const blob = new Blob([script], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `script.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting script:', error);
      alert('Failed to export script. Try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">AI-Powered Video Script Generator</h1>

        <div className="space-y-6">
          {/* Input Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter a title for your script..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                rows="4"
                placeholder="Enter your prompt here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Upload Files</label>
              <div className="w-full flex items-center justify-center">
                <label className="flex flex-col items-center px-4 py-6 w-full bg-gray-700 text-gray-300 rounded-lg border-2 border-dashed border-gray-500 cursor-pointer hover:bg-gray-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1zM6 8a1 1 0 00-1.447-.894l-2 1A1 1 0 000 9v4a1 1 0 001.447.894l2 1A1 1 0 006 13V8z" />
                  </svg>
                  <span className="mt-2 text-base leading-normal">Select files</span>
                  <input type="file" className="hidden" onChange={handleFileChange} multiple />
                </label>
              </div>
              {files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {files.map((file, index) => (
                    <div key={index} className="text-sm text-gray-300 flex items-center">
                      <span className="truncate">{file.name}</span>
                      <span className="ml-2 text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">External Links</label>
              <input
                type="text"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter external links (comma separated)..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>

            <button
              onClick={handleGenerateScript}
              disabled={loading}
              className={`w-full ${
                loading ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex justify-center items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Script'
              )}
            </button>
          </div>

          {/* Generated Script */}
          {script && (
            <div className="mt-8 p-6 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Generated Script</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(script);
                      alert('Script copied to clipboard!');
                    }}
                    className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-sm"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleExport('txt')}
                    className="p-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-line">{script}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;