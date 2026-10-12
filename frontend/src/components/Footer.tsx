import React from 'react';
import { Film, Database, Server, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950/60 py-8 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Film className="w-4 h-4 text-rose-500" />
          <span>CineTrack &copy; {new Date().getFullYear()} &mdash; Movie Discovery & Watchlist</span>
        </div>

        {/* Tech Stack Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
          <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            React + Vite + Tailwind
          </span>
          <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            Node + Express REST API
          </span>
          <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            MySQL (mysql2)
          </span>
        </div>
      </div>
    </footer>
  );
};
