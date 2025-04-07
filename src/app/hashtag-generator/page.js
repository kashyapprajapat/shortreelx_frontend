"use client"
import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function HashtagGenerator() {
  const [file, setFile] = useState(null);
  const [platforms, setPlatforms] = useState({
    youtube: true,
    tiktok: true,
    instagram: true
  });
  const [hashtagCount, setHashtagCount] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [copyButtonStates, setCopyButtonStates] = useState({
    youtube: false,
    tiktok: false,
    instagram: false,
    all: false
  });

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is SRT or VTT
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (fileType !== 'srt' && fileType !== 'vtt') {
        setError("Please upload only SRT or VTT subtitle files");
        setFile(null);
        e.target.value = null;
        return;
      }
      setFile(selectedFile);
      setError("");
      setResponseData(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      
      // Check if file is SRT or VTT
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (fileType !== 'srt' && fileType !== 'vtt') {
        setError("Please upload only SRT or VTT subtitle files");
        return;
      }
      
      setFile(selectedFile);
      setError("");
      setResponseData(null);
    }
  };

  const handlePlatformChange = (platform) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handleHashtagCountChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 15;
    if (value < 5) value = 5;
    if (value > 30) value = 30;
    setHashtagCount(value);
  };

  const handleGenerateHashtags = async () => {
    // Validate form
    if (!file) {
      setError("Please upload a subtitle file first.");
      return;
    }
    
    // Check if at least one platform is selected
    if (!platforms.youtube && !platforms.tiktok && !platforms.instagram) {
      setError("Please select at least one platform");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append("subtitles", file);
      
      // Convert platforms object to comma-separated string
      const platformsList = Object.entries(platforms)
        .filter(([_, isSelected]) => isSelected)
        .map(([platform, _]) => platform)
        .join(',');
      
      formData.append("platforms", platformsList);
      formData.append("hashtagCount", hashtagCount);
      
      // Make actual API call
      const response = await fetch(`${BASE_URL}/hashtaggenerator`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate hashtags');
      }
      
      const data = await response.json();
      setResponseData(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPlatformHashtags = (platform) => {
    if (responseData && responseData.hashtags && responseData.hashtags[platform]) {
      const platformHashtags = responseData.hashtags[platform].join(' ');
      navigator.clipboard.writeText(platformHashtags)
        .then(() => {
          // Set this specific button state to true (showing checkmark)
          setCopyButtonStates(prev => ({ ...prev, [platform]: true }));
          
          // Reset button state after 2 seconds
          setTimeout(() => {
            setCopyButtonStates(prev => ({ ...prev, [platform]: false }));
          }, 2000);
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
          setError("Failed to copy hashtags to clipboard");
        });
    }
  };

  const handleCopyAllHashtags = () => {
    if (responseData && responseData.hashtags) {
      // Flatten all hashtags from all platforms into a single string
      const allHashtags = Object.values(responseData.hashtags).flat().join(' ');
      navigator.clipboard.writeText(allHashtags)
        .then(() => {
          // Set the "all" button state to true
          setCopyButtonStates(prev => ({ ...prev, all: true }));
          
          // Reset button state after 2 seconds
          setTimeout(() => {
            setCopyButtonStates(prev => ({ ...prev, all: false }));
          }, 2000);
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
          setError("Failed to copy hashtags to clipboard");
        });
    }
  };

  // Platform brand colors
  const platformColors = {
    youtube: "bg-red-600",
    tiktok: "bg-black",
    instagram: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Link href="/" className="text-blue-500 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            Generate Hashtags
          </h1>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h2 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Upload Subtitle File</h2>
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input type="file" accept=".srt,.vtt" onChange={handleFileUpload} className="hidden" id="fileInput" />
              <label htmlFor="fileInput" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer transition">
                {file ? "Change File" : "Select File"}
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">or drag & drop a SRT/VTT file here</p>
              {file && <p className="text-sm mt-2 text-green-500">Selected: {file.name}</p>}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h2 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Platform Settings</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Select Platforms:</p>
              <div className="flex flex-wrap gap-3">
                {["youtube", "tiktok", "instagram"].map(platform => (
                  <label key={platform} className="inline-flex items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600">
                    <input
                      type="checkbox"
                      checked={platforms[platform]}
                      onChange={() => handlePlatformChange(platform)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                      {platform}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Number of Hashtags:</p>
              <input
                type="number"
                min="5"
                max="30"
                value={hashtagCount}
                onChange={handleHashtagCountChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Range: 5-30 hashtags</p>
            </div>
          </div>

          <button 
            onClick={handleGenerateHashtags} 
            className={`w-full py-2 px-4 mt-4 rounded-md text-white font-semibold transition ${file && !isLoading ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`} 
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : "Generate Hashtags"}
          </button>

          {responseData && responseData.hashtags && (
            <div className="mt-6">
              <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200 text-center">Generated Hashtags</h3>
              
              <div className="space-y-4">
                {Object.entries(responseData.hashtags).map(([platform, tags]) => (
                  <div key={platform} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div className={`${platformColors[platform]} p-3`}>
                      <h4 className="text-white font-medium capitalize flex justify-between items-center">
                        {platform}
                        <button
                          onClick={() => handleCopyPlatformHashtags(platform)}
                          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-sm text-white py-1 px-3 rounded-md transition flex items-center"
                        >
                          {copyButtonStates[platform] ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </h4>
                    </div>
                    <div className="p-3 flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span key={index} className="bg-white dark:bg-gray-800 px-2 py-1 rounded-md text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleCopyAllHashtags}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition flex items-center mx-auto"
              >
                {copyButtonStates.all ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied All Hashtags!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy All Hashtags
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {responseData && responseData.analysis && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Hashtag Analysis
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{responseData.analysis}</p>
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md border-l-4 border-blue-500">
              <p className="text-blue-800 dark:text-blue-100 text-sm">
                <span className="font-medium">Video ID:</span> {responseData.videoId}
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}