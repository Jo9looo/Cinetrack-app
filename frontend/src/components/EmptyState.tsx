import React from 'react';
import { Film, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  actionLink?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Film,
  actionText,
  actionLink,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-4 shadow-inner">
        <Icon className="w-10 h-10 stroke-1" />
      </div>
      <h3 className="text-lg font-bold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
