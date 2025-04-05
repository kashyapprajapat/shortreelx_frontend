"use client"
import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function EnhanceThumbnail() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);

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
      setEnhancedImageUrl(null);
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
      const file = e.dataTransfer.files[0];
      
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        setError("Please upload only JPG or PNG images.");
        return;
      }
      
      setImage(file);
      setError("");
      setEnhancedImageUrl(null);
    }
  };

  const handleEnhanceThumbnail = async () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append('image', image);
      
      const response = await fetch(`${BASE_URL}/enhanced-thumbnail`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance image');
      }
      
      setEnhancedImageUrl(data.enhancedImageUrl);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (enhancedImageUrl) {
      try {
        setIsLoading(true);
        
        // Fetch the image as a blob
        const response = await fetch(enhancedImageUrl);
        if (!response.ok) {
          throw new Error('Failed to download image');
        }
        
        const blob = await response.blob();
        
        // Create object URL from blob
        const objectUrl = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = `enhanced-${image.name}`;
        link.style.display = 'none';
        
        // Add to body, click, then clean up
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(objectUrl);
          setIsLoading(false);
        }, 100);
        
      } catch (err) {
        setError('Failed to download image. Please try again.');
        setIsLoading(false);
      }
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
            Enhance Thumbnail
          </h1>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h2 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Upload Image</h2>
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
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
            className={`w-full py-2 px-4 mt-4 rounded-md text-white font-semibold transition ${image && !isLoading ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`} 
            disabled={!image || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enhancing...
              </span>
            ) : "Enhance Thumbnail"}
          </button>

          {enhancedImageUrl && (
            <div className="mt-6 text-center">
              <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200">Enhanced Thumbnail</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <img 
                  src={enhancedImageUrl} 
                  alt="Enhanced thumbnail" 
                  className="max-w-full h-auto max-h-64 mx-auto rounded-md"
                />
              </div>
              
              <button
                onClick={handleDownload}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition flex items-center mx-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Enhanced Image
              </button>
            </div>
          )}
        </div>

        {enhancedImageUrl && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Applied Enhancements
            </h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
              <li className="mb-2">Brightness adjustment (+5%)</li>
              <li className="mb-2">Contrast boost (1.2x)</li>
              <li className="mb-2">Saturation increase (1.3x)</li>
              <li className="mb-2">Unsharp masking for clarity</li>
            </ul>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}