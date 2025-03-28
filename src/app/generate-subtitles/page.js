"use client"
import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

export default function GenerateShorts() {
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const [subtitlesResponse, setSubtitlesResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setError("");
      setSubtitlesResponse(null);
    }
  };

  const handleGenerateSubtitles = async () => {
    if (!video) {
      setError("Please upload a video first.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('video', video);
    formData.append('generateStyledVideo', 'false');

    try {
      const response = await axios.post(
        'https://shortreelx.onrender.com/generate-subtitles', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSubtitlesResponse(response.data);
    } catch (err) {
      setError("Failed to generate subtitles. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    link.remove();
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
            Generate Subtitles
          </h1>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h2 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Upload Source Video</h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" id="videoUpload" />
              <label htmlFor="videoUpload" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer transition">
                {video ? "Change Video" : "Select Video"}
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">or drag & drop a video file here</p>
              {video && <p className="text-sm mt-2 text-green-500">Selected: {video.name}</p>}
            </div>
          </div>

          <button 
            onClick={handleGenerateSubtitles} 
            className={`w-full py-2 px-4 mt-4 rounded-md text-white font-semibold transition ${video ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`} 
            disabled={!video || isLoading}
          >
            {isLoading ? "Generating..." : "Generate Subtitles"}
          </button>

          {subtitlesResponse && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">SRT Subtitle File</span>
                <button 
                  onClick={() => downloadFile(subtitlesResponse.subtitles.srt, 'subtitles.srt')}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Download SRT
                </button>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">VTT Subtitle File</span>
                <button 
                  onClick={() => downloadFile(subtitlesResponse.subtitles.vtt, 'subtitles.vtt')}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Download VTT
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}