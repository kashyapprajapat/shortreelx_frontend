import FeatureCard from "./FeatureCard";
import { FaVideo, FaImage, FaFire, FaClosedCaptioning } from "react-icons/fa";

export default function MainContent() {
  const features = [
    {
      title: "Generate Shorts",
      description: "Create engaging short-form video content automatically",
      icon: <FaVideo className="w-6 h-6" />,
      href: "/generate-shorts",
    },
    {
      title: "Exciting Thumbnails",
      description: "Get eye-catching thumbnails that drive clicks",
      icon: <FaImage className="w-6 h-6" />,
      href: "/exciting-thumbnails",
    },
    {
      title: "Viral Reels",
      description: "Produce trending reels that capture audience attention",
      icon: <FaFire className="w-6 h-6" />,
      href: "/viral-reels",
    },
    {
      title: "Generate Subtitles",
      description: "Add accurate, well-timed subtitles to your videos",
      icon: <FaClosedCaptioning className="w-6 h-6" />,
      href: "/generate-subtitles",
    },
  ];

  return (
    <main className="flex-grow px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">
          Video Content Creation Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
            />
          ))}
        </div>
      </div>
    </main>
  );
}