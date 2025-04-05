"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HashtagGenerator() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [notificationStatus, setNotificationStatus] = useState("pending"); // "pending", "granted", "denied"
    const [launchNotificationSent, setLaunchNotificationSent] = useState(false);
    
    useEffect(() => {
      // Check if notification permission was previously stored
      const storedPermission = localStorage.getItem("notificationPermission");
      if (storedPermission) {
        setNotificationStatus(storedPermission);
      }
      
      // Check if launch notification was already sent (to prevent duplicate notifications on refresh)
      const notificationSent = localStorage.getItem("launchNotificationSent");
      if (notificationSent === "true") {
        setLaunchNotificationSent(true);
      }
      
      const targetDate = new Date("2025-04-07T19:00:00");
      const interval = setInterval(() => {
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();
        if (difference <= 0) {
          clearInterval(interval);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          
          // If permission was granted and launch notification hasn't been sent, send it
          if (notificationStatus === "granted" && !launchNotificationSent) {
            sendNotification(
              "🚀 Hashtag Generator is Live!", 
              "Our new hashtag generator is now available. Click here to check it out!",
              "/launch-icon.png"
            );
            setLaunchNotificationSent(true);
            localStorage.setItem("launchNotificationSent", "true");
          }
        } else {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          setTimeLeft({ days, hours, minutes, seconds });
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [notificationStatus, launchNotificationSent]);
    
    // Function to handle notification permission request
    const requestNotificationPermission = async () => {
      // Check if the browser supports notifications
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications");
        return;
      }
      
      // If already granted, send a subscription notification
      if (Notification.permission === "granted") {
        sendSubscriptionNotification();
        setNotificationStatus("granted");
        localStorage.setItem("notificationPermission", "granted");
        return;
      }
      
      // Otherwise, request permission
      try {
        const permission = await Notification.requestPermission();
        
        // Store permission status in localStorage
        setNotificationStatus(permission);
        localStorage.setItem("notificationPermission", permission);
        
        if (permission === "granted") {
          sendSubscriptionNotification();
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    };
    
    // Function to send the initial subscription notification
    const sendSubscriptionNotification = () => {
      const targetDate = new Date("2025-04-07T19:00:00");
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      // If the target date has already passed, don't send the subscription notification
      if (difference <= 0) return;
      
      // Calculate days until launch
      const daysUntil = Math.floor(difference / (1000 * 60 * 60 * 24));
      
      sendNotification(
        "✅ You're all set!", 
        `We'll notify you when Hashtag Generator launches in ${daysUntil} days.`,
        "/notify-icon.png"
      );
    };
    
    // Function to send a notification
    const sendNotification = (title, body, iconPath = "/icon.png") => {
      const options = {
        body: body,
        icon: iconPath,
        vibrate: [200, 100, 200],
        badge: "/badge-icon.png",
        timestamp: Date.now()
      };
      
      try {
        const notification = new Notification(title, options);
        
        // Add click event to notification (useful for launch notification)
        notification.onclick = function() {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    };
    
    // Get button text based on notification status
    const getButtonText = () => {
      switch (notificationStatus) {
        case "granted":
          return "You'll Be Notified";
        case "denied":
          return "Notifications Blocked";
        default:
          return "Notify Me When Live";
      }
    };
    
    // Get button styles based on notification status
    const getButtonStyles = () => {
      const baseStyles = "mt-8 px-6 py-3 font-medium rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 ";
      
      switch (notificationStatus) {
        case "granted":
          return baseStyles + "bg-green-600 hover:bg-green-700 text-white";
        case "denied":
          return baseStyles + "bg-gray-400 text-gray-100 cursor-not-allowed hover:scale-100";
        default:
          return baseStyles + "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white";
      }
    };
    
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-blue-100 dark:from-gray-900 dark:to-blue-950">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-4 border-purple-500 dark:border-purple-700">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 mb-4">
              🚀 Hashtag Generator is launching soon!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-8">
              Coming on <strong className="text-purple-600 dark:text-purple-400">7th April 2025 at 7:00 PM</strong>
            </p>
            <div className="flex justify-center gap-4 sm:gap-6 text-gray-800 dark:text-white text-lg sm:text-xl font-medium">
              <div className="flex flex-col items-center bg-gradient-to-b from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 p-4 rounded-xl shadow-md">
                <span className="text-3xl sm:text-5xl font-bold text-purple-600 dark:text-purple-400">{timeLeft.days}</span>
                <span className="mt-2">Days</span>
              </div>
              <div className="flex flex-col items-center bg-gradient-to-b from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 p-4 rounded-xl shadow-md">
                <span className="text-3xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="mt-2">Hours</span>
              </div>
              <div className="flex flex-col items-center bg-gradient-to-b from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 p-4 rounded-xl shadow-md">
                <span className="text-3xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="mt-2">Minutes</span>
              </div>
              <div className="flex flex-col items-center bg-gradient-to-b from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 p-4 rounded-xl shadow-md">
                <span className="text-3xl sm:text-5xl font-bold text-violet-600 dark:text-violet-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="mt-2">Seconds</span>
              </div>
            </div>
            <button 
              onClick={requestNotificationPermission}
              className={getButtonStyles()}
              disabled={notificationStatus === "denied"}
            >
              {getButtonText()}
            </button>
            
            {notificationStatus === "granted" && (
              <p className="mt-3 text-sm text-green-600 dark:text-green-400">
                You'll receive a notification when we launch!
              </p>
            )}
            
            {notificationStatus === "denied" && (
              <p className="mt-3 text-sm text-red-500 dark:text-red-400">
                Please enable notifications in your browser settings
              </p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
}