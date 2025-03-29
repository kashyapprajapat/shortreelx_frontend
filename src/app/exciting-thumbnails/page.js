"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GenerateShorts() {
  const [video, setVideo] = useState(null);
  const [thumbnails, setThumbnails] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [videoId, setVideoId] = useState("");
  const [thumbnailData, setThumbnailData] = useState([]);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setError("");
    }
  };

  const handleGenerate = async () => {
    setError("");
    setSuccessMessage("");
    setThumbnailData([]);

    if (!video) {
      setError("Please upload a video.");
      return;
    }

    if (thumbnails < 1 || thumbnails > 3) {
      setError("Please select between 1 and 3 thumbnails.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload Video
      const formData = new FormData();
      formData.append("video", video);

      const uploadResponse = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Video upload failed.");
      }

      const uploadData = await uploadResponse.json();
      setVideoId(uploadData.videoId);

      // Step 2: Generate Thumbnails
      const thumbnailsFormData = new FormData();
      thumbnailsFormData.append("video", video);
      thumbnailsFormData.append("numThumbnails", thumbnails);

      const thumbnailsResponse = await fetch(`${BASE_URL}/getexcitingthumbnails`, {
        method: "POST",
        body: thumbnailsFormData,
      });

      if (!thumbnailsResponse.ok) {
        throw new Error("Thumbnail generation failed.");
      }
      
      const thumbnailsData = await thumbnailsResponse.json();
      setThumbnailData(thumbnailsData.thumbnails);

      setSuccessMessage("Video uploaded and thumbnails generated successfully!");

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (thumbnailInfo) => {
    try {
      const response = await fetch(thumbnailInfo.url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      
      // Use timestamp or index to name the file uniquely
      const fileName = `Thumbnail-${thumbnailInfo.timestamp}.jpg`;
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download thumbnail");
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
            Generate Exciting Thumbnails
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
            <h2 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Number of Thumbnails</h2>
            <input
              type="number"
              min="1"
              max="3"
              value={thumbnails}
              onChange={(e) => setThumbnails(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            />
          </div>

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition font-medium disabled:opacity-50"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Exciting Thumbnails"}
          </button>

          {thumbnailData.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Generated Thumbnails:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {thumbnailData.map((thumbnail, index) => (
                  <div key={index} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex flex-col items-center">
                    <div className="text-lg font-medium mb-2">Thumbnail {index + 1}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{thumbnail.description}</div>
                    <button
                      onClick={() => handleDownload(thumbnail)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}