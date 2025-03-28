"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE_URL = "https://shortreelx.onrender.com";

export default function GenerateShorts() {
  const [video, setVideo] = useState(null);
  const [numReels, setNumReels] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [reels, setReels] = useState([]);
  const [aiInsights, setAiInsights] = useState("");

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
    setSuccessMessage("Uploading video...");

    const formData = new FormData();
    formData.append("video", video);

    try {
      const uploadResponse = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) throw new Error("Failed to upload video");

      setVideoId(uploadData.videoId);
      setVideoUrl(uploadData.videoUrl);
      setSuccessMessage("Generating short videos...");

      const generateResponse = await fetch(`${BASE_URL}/generate-viral-reels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: uploadData.videoId,
          videoUrl: uploadData.videoUrl,
          numReels,
        }),
      });
      const generateData = await generateResponse.json();

      if (!generateResponse.ok) throw new Error("Failed to generate reels");

      setReels(generateData.reels);
      setAiInsights(generateData.aiInsights);
      setSuccessMessage("Successfully generated short videos!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'viral_reel.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

          {reels.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Generated Viral Reels</h2>
              
              {aiInsights && (
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">AI Insights</h3>
                  <p className="text-blue-700 dark:text-blue-300">{aiInsights}</p>
                </div>
              )}

              {reels.map((reel, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">Reel {index + 1}</h3>
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                      Viral Score: {reel.viralScore}/10
                    </span>
                  </div>

                  <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">{reel.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{reel.description}</p>

                  <div className="mb-3">
                    <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Hashtags:</h5>
                    <div className="flex flex-wrap gap-2">
                      {reel.hashtags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(reel.url)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition mt-3"
                  >
                    Download Reel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}