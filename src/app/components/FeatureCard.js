import Link from "next/link";

export default function FeatureCard({ title, description, icon, href }) {
  return (
    <Link href={href} className="group">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4 text-blue-600 dark:text-blue-300">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2 group-hover:text-blue-500 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}