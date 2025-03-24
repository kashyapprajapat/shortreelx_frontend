import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GenerateShorts() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-500 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Generate Shorts</h1>
          
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="font-medium mb-3">Upload Source Video</h2>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors">
                  Select Video
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  or drag and drop video file here
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="font-medium mb-3">Short Video Options</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Video Aspect Ratio</label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                    <option>9:16 (Vertical/Portrait)</option>
                    <option>1:1 (Square)</option>
                    <option>16:9 (Horizontal/Landscape)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
                  <input type="range" min="15" max="60" className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>15s</span>
                    <span>60s</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition-colors font-medium">
              Generate Short Video
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}