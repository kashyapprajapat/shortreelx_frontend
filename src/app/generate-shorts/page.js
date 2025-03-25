"use client"
import React, { useState } from 'react';
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GenerateShorts() {
  const [videoFile, setVideoFile] = useState(null);
  const [numberOfShorts, setNumberOfShorts] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type 
      const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
      if (allowedTypes.includes(file.type)) {
        setVideoFile(file);
        setErrorMessage('');
      } else {
        setErrorMessage('Invalid file type. Please upload a valid video file.');
        setVideoFile(null);
      }
    }
  };

  const handleFileDropped = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
      if (allowedTypes.includes(file.type)) {
        setVideoFile(file);
        setErrorMessage('');
      } else {
        setErrorMessage('Invalid file type. Please upload a valid video file.');
        setVideoFile(null);
      }
    }
  };

  const handleGenerateShorts = () => {
    // Validate inputs before generation
    if (!videoFile) {
      setErrorMessage('Please upload a video file.');
      return;
    }

    if (numberOfShorts < 1 || numberOfShorts > 3) {
      setErrorMessage('Number of shorts must be between 1 and 3.');
      return;
    }

    // Simulate generation (replace with actual generation logic)
    alert(`Generating ${numberOfShorts} short(s) from ${videoFile.name}`);

    // Optional: Reset form after generation
    // setVideoFile(null);
    // setNumberOfShorts(1);
    // setErrorMessage('');
  };

  const preventDragDefault = (event) => {
    event.preventDefault();
    event.stopPropagation();
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
            Generate Shorts
          </h1>

          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 p-4 rounded-lg mb-4">
              {errorMessage}
            </div>
          )}

          <div className="space-y-6">
            {/* Video Upload Section */}
            <div 
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              onDragEnter={preventDragDefault}
              onDragOver={preventDragDefault}
              onDrop={handleFileDropped}
            >
              <h2 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                Upload Source Video
              </h2>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <input 
                  type="file" 
                  accept="video/mp4,video/mpeg,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden" 
                  id="videoUpload"
                />
                <label 
                  htmlFor="videoUpload" 
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors inline-block"
                >
                  Select Video
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  or drag and drop video file here
                </p>
                {videoFile && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Selected file: {videoFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Number of Shorts Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                Number of Shorts
              </h2>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                  Number of Shorts to Generate (1-3)
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="3" 
                  value={numberOfShorts}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setNumberOfShorts(
                      isNaN(value) ? 1 : Math.min(Math.max(value, 1), 3)
                    );
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            <button 
              onClick={handleGenerateShorts}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition-colors font-medium"
            >
              Generate Short Video(s)
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}