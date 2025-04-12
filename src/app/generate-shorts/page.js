"use client";
import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function GenerateShorts() {
  const [videoFile, setVideoFile] = useState(null);
  const [numberOfShorts, setNumberOfShorts] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [shorts, setShorts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleFileDropped = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    const allowedTypes = ["video/mp4", "video/mpeg", "video/quicktime"];
    if (file && allowedTypes.includes(file.type)) {
      setVideoFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid file type. Please upload a valid video file.");
      setVideoFile(null);
    }
  };

  const downloadShort = async (shortUrl) => {
    try {
      // Fetch the video blob
      const response = await fetch(shortUrl);
      const blob = await response.blob();
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `short_${Date.now()}.mp4`; // Use timestamp to ensure unique filename
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      setErrorMessage('Failed to download short video.');
    }
  };

  const handleGenerateShorts = async () => {
    if (!videoFile) {
      setErrorMessage("Please upload a video file.");
      return;
    }

    if (numberOfShorts < 1 || numberOfShorts > 3) {
      setErrorMessage("Number of shorts must be between 1 and 3.");
      return;
    }

    try {
      setIsLoading(true);
      
      // Step 1: Upload Video
      const formData = new FormData();
      formData.append("video", videoFile);

      const uploadResponse = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error("Failed to upload video.");

      const uploadData = await uploadResponse.json();
      setVideoId(uploadData.videoId);
      setVideoUrl(uploadData.videoUrl);

      // Step 2: Generate Shorts
      const generateResponse = await fetch(`${BASE_URL}/generate-shorts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: uploadData.videoId,
          numShorts: numberOfShorts,
          videoUrl: uploadData.videoUrl,
        }),
      });

      if (!generateResponse.ok) throw new Error("Failed to generate shorts.");
      
      const generateData = await generateResponse.json();
      setShorts(generateData.shorts);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
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
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg" onDragOver={(e) => e.preventDefault()} onDrop={handleFileDropped}>
              <h2 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Upload Source Video</h2>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" id="videoUpload" />
                <label htmlFor="videoUpload" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors inline-block">
                  Select Video
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">or drag and drop video file here</p>
                {videoFile && <p className="mt-2 text-sm text-green-600 dark:text-green-400">Selected file: {videoFile.name}</p>}
              </div>
            </div>

            {/* Number of Shorts Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Number of Shorts</h2>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">Number of Shorts to Generate (1-3)</label>
              <input
                type="number"
                min="1"
                max="3"
                value={numberOfShorts}
                onChange={(e) => setNumberOfShorts(Math.min(Math.max(parseInt(e.target.value) || 1, 1), 3))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              />
            </div>

            <button 
              onClick={handleGenerateShorts} 
              disabled={!videoFile || isLoading}
              className={`w-full py-3 rounded-md transition-colors font-medium ${
                !videoFile 
                  ? "bg-gray-400 cursor-not-allowed text-gray-200" 
                  : isLoading 
                    ? "bg-blue-400 cursor-wait text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isLoading ? "Generating, please wait..." : "Generate Short Video(s)"}
            </button>

            {/* Display Generated Shorts */}
            {shorts.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Generated Shorts</h2>
                <ul className="space-y-2">
                  {shorts.map((shortUrl, index) => (
                    <li key={index} className="flex justify-between items-center p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Short {index + 1}</span>
                      <button 
                        onClick={() => downloadShort(shortUrl)} 
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm"
                      >
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}