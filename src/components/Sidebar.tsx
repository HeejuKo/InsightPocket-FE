import { LayoutDashboard, TrendingUp, MessageSquare, Search, Star } from 'lucide-react';
import type { PageType } from '../App';
import laneigeLogo from 'figma:asset/38cc32cf41940ff9f37635589cb8007dcc51c7ce.png';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const menuItems = [
  { id: 'dashboard' as PageType, label: '요약 대시보드', icon: LayoutDashboard },
  { id: 'ranking' as PageType, label: '랭킹 히스토리', icon: TrendingUp },
  { id: 'ai-insights' as PageType, label: 'AI 인사이트', icon: MessageSquare },
  { id: 'review-analysis' as PageType, label: '리뷰 분석', icon: Star },
  { id: 'keywords' as PageType, label: '키워드 분석', icon: Search },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <img src={laneigeLogo} alt="LANEIGE Insight Pocket" className="w-full" />
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-[#6691ff] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Last updated</p>
        <p className="text-sm text-gray-700">December 22, 2024</p>
      </div>
    </div>
  );
}