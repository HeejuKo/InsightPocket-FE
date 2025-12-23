import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AddToCartButton } from './AddToCartButton';
import type { InsightItem } from '../App';

const keywordRankings = [
  { rank: 1, keyword: 'hydration', mentions: 8956, trend: 'up', change: 12.3, sentiment: 'positive', category: 'Product Benefit' },
  { rank: 2, keyword: 'sleeping mask', mentions: 7234, trend: 'up', change: 8.7, sentiment: 'positive', category: 'Product Type' },
  { rank: 3, keyword: 'moisturizing', mentions: 6542, trend: 'stable', change: 0.2, sentiment: 'positive', category: 'Product Benefit' },
  { rank: 4, keyword: 'soft skin', mentions: 5876, trend: 'up', change: 15.4, sentiment: 'positive', category: 'Result' },
  { rank: 5, keyword: 'overnight', mentions: 5234, trend: 'up', change: 6.8, sentiment: 'positive', category: 'Usage' },
  { rank: 6, keyword: 'lip care', mentions: 4987, trend: 'up', change: 18.9, sentiment: 'positive', category: 'Product Type' },
  { rank: 7, keyword: 'price', mentions: 4654, trend: 'down', change: -3.2, sentiment: 'neutral', category: 'Purchase Factor' },
  { rank: 8, keyword: 'texture', mentions: 4321, trend: 'stable', change: 1.1, sentiment: 'positive', category: 'Product Feature' },
  { rank: 9, keyword: 'absorption', mentions: 4156, trend: 'up', change: 9.3, sentiment: 'positive', category: 'Product Feature' },
  { rank: 10, keyword: 'fragrance', mentions: 3987, trend: 'stable', change: -0.5, sentiment: 'positive', category: 'Product Feature' },
  { rank: 11, keyword: 'dry skin', mentions: 3765, trend: 'up', change: 7.2, sentiment: 'positive', category: 'Skin Concern' },
  { rank: 12, keyword: 'packaging', mentions: 3542, trend: 'down', change: -2.1, sentiment: 'neutral', category: 'Product Feature' },
  { rank: 13, keyword: 'k-beauty', mentions: 3421, trend: 'up', change: 11.5, sentiment: 'positive', category: 'Brand Image' },
  { rank: 14, keyword: 'morning glow', mentions: 3298, trend: 'up', change: 14.2, sentiment: 'positive', category: 'Result' },
  { rank: 15, keyword: 'value for money', mentions: 3156, trend: 'down', change: -4.8, sentiment: 'neutral', category: 'Purchase Factor' },
  { rank: 16, keyword: 'gentle', mentions: 3045, trend: 'stable', change: 0.8, sentiment: 'positive', category: 'Product Feature' },
  { rank: 17, keyword: 'sensitive skin', mentions: 2934, trend: 'up', change: 5.6, sentiment: 'positive', category: 'Skin Concern' },
  { rank: 18, keyword: 'sticky', mentions: 2876, trend: 'down', change: -6.3, sentiment: 'negative', category: 'Product Feature' },
  { rank: 19, keyword: 'long-lasting', mentions: 2765, trend: 'up', change: 10.1, sentiment: 'positive', category: 'Product Benefit' },
  { rank: 20, keyword: 'cooling effect', mentions: 2654, trend: 'up', change: 8.9, sentiment: 'positive', category: 'Product Feature' },
];

const categoryData = [
  { category: 'Product Benefit', count: 15198, percentage: 28 },
  { category: 'Product Type', count: 12221, percentage: 22 },
  { category: 'Product Feature', count: 11765, percentage: 21 },
  { category: 'Result', count: 9174, percentage: 17 },
  { category: 'Skin Concern', count: 6699, percentage: 12 },
];

interface KeywordAnalysisProps {
  addToCart?: (item: Omit<InsightItem, 'id' | 'timestamp'>) => void;
  removeByUniqueKey?: (uniqueKey: string) => void;
  isInCart?: (uniqueKey: string) => boolean;
}

export function KeywordAnalysis({ addToCart, removeByUniqueKey, isInCart }: KeywordAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredKeywords = keywordRankings.filter(item => {
    const matchesSearch = item.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(keywordRankings.map(k => k.category)))];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">키워드 분석</h1>
        <p className="text-gray-600">LANEIGE 제품 리뷰 키워드 트렌드 및 순위 분석</p>
      </div>

      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8 hover:shadow-lg transition-all group relative">
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          {addToCart && removeByUniqueKey && isInCart && (
            <AddToCartButton 
              onAdd={() => addToCart({
                type: 'chart',
                title: '카테고리별 키워드 분포',
                data: categoryData,
                page: 'keywords',
                uniqueKey: 'keyword-category-distribution',
              })}
              onRemove={() => removeByUniqueKey('keyword-category-distribution')}
              isInCart={isInCart('keyword-category-distribution')}
            />
          )}
        </div>
        <h2 className="text-xl mb-6">카테고리별 키워드 분포</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#6691ff" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Keyword Rankings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group relative">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">키워드 순위 (상위 20개)</h2>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {addToCart && removeByUniqueKey && isInCart && (
                <AddToCartButton 
                  onAdd={() => addToCart({
                    type: 'table',
                    title: '키워드 순위',
                    data: [
                      ['순위', '키워드', '언급 수', '트렌드', '변화율', '감정', '카테고리'],
                      ...filteredKeywords.map(k => [
                        k.rank,
                        k.keyword,
                        k.mentions,
                        k.trend,
                        k.change,
                        k.sentiment,
                        k.category
                      ])
                    ],
                    page: 'keywords',
                    uniqueKey: 'keyword-rankings-table',
                  })}
                  onRemove={() => removeByUniqueKey('keyword-rankings-table')}
                  isInCart={isInCart('keyword-rankings-table')}
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="키워드 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6691ff] focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6691ff] focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? '전체 카테고리' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">순위</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">키워드</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">언급 수</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">트렌드</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">변화율</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">감정</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">카테고리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredKeywords.map((keyword) => {
                const TrendIcon = keyword.trend === 'up' 
                  ? TrendingUp 
                  : keyword.trend === 'down' 
                  ? TrendingDown 
                  : Minus;
                
                const trendColor = keyword.trend === 'up'
                  ? 'text-green-600'
                  : keyword.trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-400';

                const sentimentColor = keyword.sentiment === 'positive'
                  ? 'bg-green-100 text-green-700'
                  : keyword.sentiment === 'negative'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700';

                return (
                  <tr key={keyword.rank} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                        keyword.rank <= 3 ? 'bg-[#6691ff] text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {keyword.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={keyword.rank <= 5 ? 'text-[#6691ff]' : ''}>
                        {keyword.keyword}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {keyword.mentions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1 ${trendColor}`}>
                        <TrendIcon className="w-4 h-4" />
                        <span className="text-sm capitalize">{keyword.trend}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={keyword.change > 0 ? 'text-green-600' : keyword.change < 0 ? 'text-red-600' : 'text-gray-500'}>
                        {keyword.change > 0 ? '+' : ''}{keyword.change}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${sentimentColor}`}>
                        {keyword.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {keyword.category}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredKeywords.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            검색 결과가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
