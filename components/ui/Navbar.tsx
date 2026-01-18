import { Bot } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white/75 backdrop-blur-lg sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto">
        {/* LEFT: Brand / Logo */}
        <div className="flex items-center gap-2 font-bold text-xl mr-4">
          <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <span className="hidden md:inline-block">
            <a href="http://localhost:3000">InsightEngine</a>
          </span>
        </div>

        {/* make a how it works link which is centered
        <div className="flex-1 text-center">
          <a href="http://localhost:3000/how-it-works" className="text-gray-700 hover:text-gray-900 font-medium">
            How It Works
          </a>
        </div> */}
        <div className="flex-1 flex justify-center gap-6 items-center">
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition"
          >
            How it Works
          </Link>
          <Link href="/upload" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition">Upload Data</Link>
        </div>

        {/* RIGHT: User Nav */}
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </nav>
  );
}
