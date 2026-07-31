import { ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  categoryColor: "purple" | "blue";
}

export function ArticleCard({ title, excerpt, date, author, category, categoryColor }: ArticleCardProps) {
  const badgeClass = categoryColor === "purple" 
    ? "bg-[#72004c]/20 text-[#ff80c0] border-[#72004c]/50" 
    : "bg-[#006f87]/20 text-[#66d9ff] border-[#006f87]/50";

  return (
    <article className="glass-card p-6 flex flex-col h-full group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full group-hover:opacity-30 transition-opacity ${categoryColor === 'purple' ? 'bg-[#72004c]' : 'bg-[#006f87]'}`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${badgeClass}`}>
            {category}
          </span>
          <div className="flex items-center text-gray-400 text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            {date}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
          {title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center text-sm text-gray-300">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            {author}
          </div>
          <Link href="#" className="text-sm font-medium text-white group-hover:text-[#00b4db] flex items-center transition-colors">
            Leer <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
