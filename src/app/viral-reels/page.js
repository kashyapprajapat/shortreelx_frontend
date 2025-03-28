"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GenerateShorts() {
  const [video, setVideo] = useState(null);
  const [numReels, setNumReels] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setError("");
    }
  };

  const handleGenerate = async () => {
    if (!video) {
      setError("Please upload a video.");
      return;
    }
    if (numReels < 1 || numReels > 3) {
      setError("Please select between 1 and 3 reels.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("Generating short videos...");
    
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage(`Successfully generated ${numReels} short video(s)!`);
    }, 3000);
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
            Generate Viral Reels
          </h1>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>}

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h2 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Upload Video</h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" id="videoUpload" />
              <label htmlFor="videoUpload" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer transition">
                {video ? "Change Video" : "Select Video"}
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">or drag & drop a video file here</p>
              {video && <p className="text-sm mt-2 text-green-500">Selected: {video.name}</p>}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h2 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Number of Reels</h2>
            <input
              type="number"
              min="1"
              max="3"
              value={numReels}
              onChange={(e) => setNumReels(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            />
          </div>

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition font-medium disabled:opacity-50"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate viral Reels"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
