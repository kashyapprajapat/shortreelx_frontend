"use client"
import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function EnhanceThumbnail() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        setError("Please upload only JPG or PNG images.");
        return;
      }
      
      setImage(file);
      setError("");
    }
  };

  const handleEnhanceThumbnail = () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsLoading(false);
      alert("Thumbnail enhanced successfully!");
    }, 1000);
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
            Enhance Thumbnail
          </h1>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h2 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Upload Image</h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input type="file" accept="image/jpeg, image/png" onChange={handleImageUpload} className="hidden" id="imageUpload" />
              <label htmlFor="imageUpload" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer transition">
                {image ? "Change Image" : "Select Image"}
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">or drag & drop a JPG/PNG file here</p>
              {image && <p className="text-sm mt-2 text-green-500">Selected: {image.name}</p>}
            </div>
          </div>

          <button 
            onClick={handleEnhanceThumbnail} 
            className={`w-full py-2 px-4 mt-4 rounded-md text-white font-semibold transition ${image ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`} 
            disabled={!image || isLoading}
          >
            {isLoading ? "Enhancing..." : "Enhance Thumbnail"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}