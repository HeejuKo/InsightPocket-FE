import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { AddToCartButton } from './AddToCartButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { InsightItem } from '../App';

type PeriodType = 'daily' | 'weekly' | 'monthly' | '3months' | 'yearly';
type CategoryType = 'overall' | 'lip' | 'skincare' | 'makeup';

const laneigeProducts = [
  { name: 'Water Sleeping Mask', categories: { overall: 12, skincare: 3 } },
  { name: 'Cream Skin Refiner', categories: { overall: 23, skincare: 8 } },
  { name: 'Lip Sleeping Mask', categories: { overall: 8, lip: 2 } },
  { name: 'Water Bank Moisture Cream', categories: { overall: 34, skincare: 12 } },
  { name: 'Neo Cushion', categories: { overall: 45, makeup: 5 } },
  { name: 'Glowy Makeup Serum', categories: { overall: 67, makeup: 12 } },
  { name: 'Bouncy & Firm Sleeping Mask', categories: { overall: 28, skincare: 10 } },
  { name: 'Water Sleeping Mask EX', categories: { overall: 41, skincare: 15 } },
  { name: 'Radian-C Cream', categories: { overall: 56, skincare: 20 } },
  { name: 'Water Bank Blue Hyaluronic Cream', categories: { overall: 72, skincare: 25 } },
  { name: 'Cica Sleeping Mask', categories: { overall: 89, skincare: 30 } },
  { name: 'Multi Deep-Clean Cleanser', categories: { overall: 95, skincare: 35 } },
  { name: 'Water Bank Hydro Essence', categories: { overall: 103, skincare: 40 } },
  { name: 'Neo Foundation', categories: { overall: 112, makeup: 18 } },
  { name: 'Perfect Renew Youth Cream', categories: { overall: 125, skincare: 45 } },
  { name: 'White Dew Tone-Up Cream', categories: { overall: 138, skincare: 50 } },
  { name: 'Lip Glowy Balm', categories: { overall: 15, lip: 4 } },
  { name: 'BB Cushion Pore Control', categories: { overall: 156, makeup: 25 } },
  { name: 'Layering Cover Cushion', categories: { overall: 167, makeup: 28 } },
  { name: 'Stained Glow Lip Balm', categories: { overall: 22, lip: 6 } },
  { name: 'Neo Cushion Glow', categories: { overall: 178, makeup: 30 } },
  { name: 'Water Bank Moisture Mist', categories: { overall: 189, skincare: 60 } },
  { name: 'Water Glow Tint', categories: { overall: 31, lip: 8 } },
  { name: 'Hyaluronic Acid Moisture Cream', categories: { overall: 145, skincare: 55 } },
];

// Generate Amazon overall rankings (including non-Laneige products)
const generateAmazonRankings = () => {
  const rankings = [];
  const competitors = [
    'CeraVe Moisturizing Cream',
    'La Roche-Posay Toleriane',
    'Neutrogena Hydro Boost',
    'Clinique Moisture Surge',
    'Estée Lauder Advanced Night Repair',
    'Drunk Elephant Protini',
    'Sunday Riley Good Genes',
    'The Ordinary Niacinamide',
    'Kiehl\'s Ultra Facial Cream',
    'Fresh Rose Face Mask',
    'Tatcha The Water Cream',
    'Belif The True Cream',
    'Innisfree Green Tea Seed Serum',
    'Cosrx Snail Mucin Essence',
    'SK-II Facial Treatment Essence',
  ];

  let laneigeIndex = 0;
  for (let i = 1; i <= 200; i++) {
    const laneigeProduct = laneigeProducts.find(p => p.categories.overall === i);
    if (laneigeProduct) {
      rankings.push({
        rank: i,
        name: laneigeProduct.name,
        brand: 'LANEIGE',
        category: Object.keys(laneigeProduct.categories)[1] || 'skincare',
        isLaneige: true,
        prevRank: i + Math.floor(Math.random() * 6 - 3),
      });
    } else {
      const competitor = competitors[Math.floor(Math.random() * competitors.length)];
      rankings.push({
        rank: i,
        name: competitor,
        brand: competitor.split(' ')[0],
        category: 'skincare',
        isLaneige: false,
        prevRank: i + Math.floor(Math.random() * 6 - 3),
      });
    }
  }
  return rankings;
};

const periodConfigs = {
  daily: { label: '일간', days: 1, points: 24 },
  weekly: { label: '주간', days: 7, points: 7 },
  monthly: { label: '월별', days: 30, points: 30 },
  '3months': { label: '3개월', days: 90, points: 90 },
  yearly: { label: '연도별', days: 365, points: 12 },
};

const categoryConfigs = {
  overall: { label: '전체 랭킹', maxRank: 200 },
  lip: { label: '립 제품 순위', maxRank: 50 },
  skincare: { label: '스킨케어 순위', maxRank: 100 },
  makeup: { label: '메이크업 순위', maxRank: 100 },
};

const generateRankingData = (period: PeriodType, productName: string) => {
  const config = periodConfigs[period];
  const data = [];
  const now = new Date();

  const product = laneigeProducts.find(p => p.name === productName);
  if (!product) return [];

  const categories = Object.keys(product.categories) as Array<keyof typeof product.categories>;

  for (let i = config.points - 1; i >= 0; i--) {
    let dateStr = '';
    const date = new Date(now);

    if (period === 'daily') {
      date.setHours(date.getHours() - i);
      dateStr = `${date.getHours()}:00`;
    } else if (period === 'weekly') {
      date.setDate(date.getDate() - i);
      dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    } else if (period === 'monthly') {
      date.setDate(date.getDate() - i);
      dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    } else if (period === '3months') {
      date.setDate(date.getDate() - i);
      if (i % 3 === 0) dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      date.setMonth(date.getMonth() - i);
      dateStr = `${date.getFullYear()}.${date.getMonth() + 1}`;
    }

    if (!dateStr) continue;

    const entry: any = { date: dateStr };
    
    categories.forEach(category => {
      const baseRank = product.categories[category];
      const variation = Math.floor(Math.sin((i / 3)) * 5);
      const maxRank = category === 'overall' ? 200 : category === 'lip' ? 50 : 100;
      entry[`${category}_rank`] = Math.max(1, Math.min(maxRank, baseRank + variation));
    });
    
    data.push(entry);
  }

  return data;
};

interface RankingHistoryProps {
  addToCart: (item: Omit<InsightItem, 'id' | 'timestamp'>) => void;
  removeByUniqueKey: (uniqueKey: string) => void;
  isInCart: (uniqueKey: string) => boolean;
}

export function RankingHistory({ addToCart, removeByUniqueKey, isInCart }: RankingHistoryProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [amazonRankings] = useState(generateAmazonRankings());
  
  // History chart states
  const [selectedProduct, setSelectedProduct] = useState(laneigeProducts[0].name);
  const [period, setPeriod] = useState<PeriodType>('weekly');
  const [scrollPosition, setScrollPosition] = useState(0);

  const filteredRankings = amazonRankings.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = laneigeProducts
    .filter(p => p.name.toLowerCase().includes(productSearchTerm.toLowerCase()));

  const data = generateRankingData(period, selectedProduct);

  const selectedProductData = laneigeProducts.find(p => p.name === selectedProduct);
  const categoryKeys = selectedProductData 
    ? Object.keys(selectedProductData.categories) as Array<keyof typeof selectedProductData.categories>
    : [];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('product-scroll');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl">랭킹 히스토리</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm">
              실시간 데이터: {currentTime.toLocaleString('ko-KR', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} 기준
            </span>
          </div>
        </div>
        <p className="text-gray-600">아마존 베스트셀러 순위 실시간 분석</p>
      </div>

      {/* Current Amazon Rankings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 hover:shadow-lg transition-all group relative">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl mb-1">아마존 현재 순위 (실시간)</h2>
            <p className="text-sm text-gray-500">
              {currentTime.toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} 기준
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="제품 또는 브랜드 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6691ff] focus:border-transparent"
              />
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <AddToCartButton 
                onAdd={() => addToCart({
                  type: 'table',
                  title: '아마존 현재 순위',
                  data: [
                    ['순위', '브랜드', '제품명', '이전 순위', '변동'],
                    ...filteredRankings.slice(0, 50).map(p => [
                      p.rank,
                      p.brand,
                      p.name,
                      p.prevRank,
                      p.prevRank - p.rank
                    ])
                  ],
                  page: 'ranking',
                  uniqueKey: 'ranking-table-amazon-current',
                })}
                onRemove={() => removeByUniqueKey('ranking-table-amazon-current')}
                isInCart={isInCart('ranking-table-amazon-current')}
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">순위</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">브랜드</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">제품명</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">이전 순위</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">변동</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRankings.slice(0, 100).map((product) => {
                const change = product.prevRank - product.rank;
                
                return (
                  <tr 
                    key={product.rank} 
                    className={`hover:bg-gray-50 ${product.isLaneige ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white ${
                        product.isLaneige ? 'bg-[#6691ff]' : 'bg-gray-400'
                      }`}>
                        {product.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isLaneige && (
                        <span className="inline-block px-2 py-1 bg-[#6691ff] text-white text-xs rounded mr-2">
                          LANEIGE
                        </span>
                      )}
                      <span className={product.isLaneige ? 'text-[#6691ff]' : 'text-gray-600'}>
                        {product.brand}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={product.isLaneige ? 'text-[#6691ff]' : ''}>
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.prevRank}위</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {change > 0 && (
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm">+{change}</span>
                          </div>
                        )}
                        {change < 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-sm">{change}</span>
                          </div>
                        )}
                        {change === 0 && (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ranking History Chart */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group relative">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">LANEIGE 제품 순위 변동 추이</h2>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <AddToCartButton 
                onAdd={() => addToCart({
                  type: 'chart',
                  title: `${selectedProduct} - 카테고리별 순위 (${periodConfigs[period].label})`,
                  data: data,
                  page: 'ranking',
                  uniqueKey: `ranking-chart-${period}-${selectedProduct}`,
                })}
                onRemove={() => removeByUniqueKey(`ranking-chart-${period}-${selectedProduct}`)}
                isInCart={isInCart(`ranking-chart-${period}-${selectedProduct}`)}
              />
            </div>
          </div>

          {/* Period & Category Filters */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">기간 선택</label>
              <div className="flex gap-2">
                {(Object.keys(periodConfigs) as PeriodType[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      period === p
                        ? 'bg-[#6691ff] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {periodConfigs[p].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Selector - Horizontal Scroll */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-gray-600">제품 선택</label>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="제품명 검색..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6691ff] focus:border-transparent"
                />
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => handleScroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div 
                id="product-scroll"
                className="flex gap-4 overflow-x-auto pb-4 px-12 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredProducts.length === 0 ? (
                  <div className="w-full text-center py-8 text-gray-400">
                    검색 결과가 없습니다
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <button
                      key={product.name}
                      onClick={() => setSelectedProduct(product.name)}
                      className={`flex-shrink-0 w-40 p-3 rounded-lg border-2 transition-all ${
                        selectedProduct === product.name
                          ? 'border-[#6691ff] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                        <ImageWithFallback
                          src={`https://via.placeholder.com/150x150/6691ff/ffffff?text=${encodeURIComponent(product.name.substring(0, 10))}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className={`text-sm text-center line-clamp-2 ${
                        selectedProduct === product.name ? 'text-[#6691ff]' : 'text-gray-700'
                      }`}>
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 text-center mt-1">
                        #{product.categories[categoryKeys[0]]}
                      </p>
                    </button>
                  ))
                )}
              </div>

              <button
                onClick={() => handleScroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg">
              {selectedProduct}
            </h3>
            <p className="text-sm text-gray-500">
              {periodConfigs[period].label} 카테고리별 순위 변동
            </p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis 
                stroke="#666" 
                reversed 
                domain={[1, 200]}
                label={{ value: '순위', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              {categoryKeys.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={`${category}_rank`}
                  name={categoryConfigs[category]?.label || category}
                  stroke={index === 0 ? '#6691ff' : '#a3b7ff'}
                  strokeWidth={3}
                  dot={{ fill: index === 0 ? '#6691ff' : '#a3b7ff', r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}