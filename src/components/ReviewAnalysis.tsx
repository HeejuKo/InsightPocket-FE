import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Minus, TrendingUp, MessageSquare, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AddToCartButton } from './AddToCartButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { InsightItem } from '../App';

const laneigeProducts = [
  { name: 'Water Sleeping Mask', avgRating: 4.7, totalReviews: 3245 },
  { name: 'Lip Sleeping Mask', avgRating: 4.8, totalReviews: 4521 },
  { name: 'Cream Skin Refiner', avgRating: 4.6, totalReviews: 2108 },
  { name: 'Water Bank Moisture Cream', avgRating: 4.5, totalReviews: 1876 },
  { name: 'Neo Cushion', avgRating: 4.7, totalReviews: 2934 },
  { name: 'Glowy Makeup Serum', avgRating: 4.4, totalReviews: 1654 },
  { name: 'Bouncy & Firm Sleeping Mask', avgRating: 4.6, totalReviews: 1987 },
  { name: 'Water Sleeping Mask EX', avgRating: 4.5, totalReviews: 1432 },
  { name: 'Radian-C Cream', avgRating: 4.6, totalReviews: 1876 },
  { name: 'Lip Glowy Balm', avgRating: 4.7, totalReviews: 3156 },
];

const productReviewData: Record<string, any> = {
  'Water Sleeping Mask': {
    keywords: [
      { keyword: '보습 (Hydration)', mentions: 2094, sentiment: 'positive', score: 85, aiInsight: '2,094명의 고객이 언급하며 80% 이상의 양성 피드백을 보임. 특히 "밤 사이 일어나는 극강의 촉촉함"이 핵심 구매 결정 요인으로 분석됨.' },
      { keyword: '흡수력 (Absorption)', mentions: 1842, sentiment: 'positive', score: 78, aiInsight: '빠른 흡수력과 가벼운 텍스처가 주요 긍정 요인. "끈적임 없이 촉촉하다"는 평가가 지배적.' },
      { keyword: '가격 대비 가치', mentions: 1563, sentiment: 'neutral', score: 65, aiInsight: '고가임에도 품질 만족도가 높으나, 최근 입점한 인디 브랜드들의 저가 공세로 인해 "가성비" 측면에서 점수가 하락 중. 프리미엄 이미지 강화 전략 필요.' },
      { keyword: '향 (Fragrance)', mentions: 1421, sentiment: 'positive', score: 72, aiInsight: '은은한 향기가 긍정적으로 평가되나, 일부 무향 선호 고객의 부정적 리뷰 존재.' },
      { keyword: '사용 편의성', mentions: 1289, sentiment: 'negative', score: 42, aiInsight: '스패출러 사용의 번거로움과 제형의 끈적임이 부정 평가의 주원인. 낮 시간대보다는 "나이트 케어 전용" 메시지를 강화하여 끈적임에 대한 거부감을 상쇄시킬 것을 제안.' },
      { keyword: '용량 (Quantity)', mentions: 987, sentiment: 'neutral', score: 58, aiInsight: '용량 대비 가격에 대한 양가적 반응. 더 큰 사이즈 옵션 출시 고려 필요.' },
    ],
    sentiment: [
      { name: '긍정', value: 68, color: '#6591ff' },
      { name: '중립', value: 22, color: '#ebf3fd' },
      { name: '부정', value: 10, color: '#ffebeb' },
    ],
    customerSay: '"밤새 촉촉함이 지속되는 마법 같은 제품! 아침에 일어나면 피부가 탱탱하고 빛나요. 약간 끈적일 수 있지만 수면 마스크로는 완벽합니다."',
    ratingDist: [
      { rating: 5, count: 2145, percentage: 66 },
      { rating: 4, count: 687, percentage: 21 },
      { rating: 3, count: 293, percentage: 9 },
      { rating: 2, count: 97, percentage: 3 },
      { rating: 1, count: 23, percentage: 1 },
    ],
  },
  'Lip Sleeping Mask': {
    keywords: [
      { keyword: '보습력', mentions: 2845, sentiment: 'positive', score: 92, aiInsight: '입술 보습에 대한 만족도가 매우 높음. "아침까지 촉촉함 유지"가 핵심 구매 이유.' },
      { keyword: '텍스처', mentions: 2156, sentiment: 'positive', score: 88, aiInsight: '부드럽고 끈적이지 않은 텍스처가 높은 평가.' },
      { keyword: '가격', mentions: 1876, sentiment: 'neutral', score: 62, aiInsight: '소량이지만 오래 사용 가능하여 가성비에 대한 의견이 양분됨.' },
      { keyword: '향', mentions: 1654, sentiment: 'positive', score: 85, aiInsight: '다양한 향 옵션이 긍정적. 베리 향이 가장 인기.' },
      { keyword: '포장', mentions: 1234, sentiment: 'positive', score: 78, aiInsight: '고급스러운 패키지 디자인이 선물용으로 인기.' },
    ],
    sentiment: [
      { name: '긍정', value: 75, color: '#6591ff' },
      { name: '중립', value: 18, color: '#ebf3fd' },
      { name: '부정', value: 7, color: '#ffebeb' },
    ],
    customerSay: '"입술 각질 고민 해결! 매일 밤 바르면 아침에 부드럽고 촉촉한 입술로 변해요. 향도 좋고 오래가서 가성비도 좋아요."',
    ratingDist: [
      { rating: 5, count: 3156, percentage: 70 },
      { rating: 4, count: 905, percentage: 20 },
      { rating: 3, count: 316, percentage: 7 },
      { rating: 2, count: 90, percentage: 2 },
      { rating: 1, count: 54, percentage: 1 },
    ],
  },
  'Cream Skin Refiner': {
    keywords: [
      { keyword: '보습', mentions: 1654, sentiment: 'positive', score: 86, aiInsight: '크림과 토너의 결합이 효과적. 건성 피부에 특히 좋은 반응.' },
      { keyword: '흡수력', mentions: 1432, sentiment: 'positive', score: 82, aiInsight: '빠른 흡수와 끈적임 없는 마무리가 장점.' },
      { keyword: '용량', mentions: 1234, sentiment: 'neutral', score: 58, aiInsight: '소량이라 아쉽다는 의견과 오래 사용 가능하다는 의견 혼재.' },
    ],
    sentiment: [
      { name: '긍정', value: 71, color: '#6591ff' },
      { name: '중립', value: 20, color: '#ebf3fd' },
      { name: '부정', value: 9, color: '#ffebeb' },
    ],
    customerSay: '"토너와 크림을 하나로! 아침 스킨케어 루틴이 간소화되고 피부는 더 촉촉해졌어요."',
    ratingDist: [
      { rating: 5, count: 1389, percentage: 66 },
      { rating: 4, count: 464, percentage: 22 },
      { rating: 3, count: 169, percentage: 8 },
      { rating: 2, count: 63, percentage: 3 },
      { rating: 1, count: 23, percentage: 1 },
    ],
  },
};

interface ReviewAnalysisProps {
  addToCart: (item: Omit<InsightItem, 'id' | 'timestamp'>) => void;
  removeByUniqueKey: (uniqueKey: string) => void;
  isInCart: (uniqueKey: string) => boolean;
}

export function ReviewAnalysis({ addToCart, removeByUniqueKey, isInCart }: ReviewAnalysisProps) {
  const [selectedProduct, setSelectedProduct] = useState(laneigeProducts[0].name);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  const filteredProducts = laneigeProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentData = productReviewData[selectedProduct] || productReviewData['Water Sleeping Mask'];
  const selectedProductInfo = laneigeProducts.find(p => p.name === selectedProduct)!;

  const totalReviews = currentData.ratingDist.reduce((sum: number, item: any) => sum + item.count, 0);
  const averageRating = selectedProductInfo.avgRating.toFixed(1);
  const reputationScore = Math.round((parseFloat(averageRating) / 5) * 100);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('review-product-scroll');
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
        <h1 className="text-3xl mb-2">리뷰 분석</h1>
        <p className="text-gray-600">LANEIGE 제품 고객 리뷰 AI 분석</p>
      </div>

      {/* Product Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm text-gray-600">분석할 제품 선택</label>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="제품명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            id="review-product-scroll"
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
                  className={`flex-shrink-0 w-48 p-4 rounded-lg border-2 transition-all ${
                    selectedProduct === product.name
                      ? 'border-[#6691ff] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <ImageWithFallback
                      src={`https://via.placeholder.com/200x200/6691ff/ffffff?text=${encodeURIComponent(product.name.substring(0, 10))}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className={`text-sm text-center mb-2 line-clamp-2 ${
                    selectedProduct === product.name ? 'text-[#6691ff]' : 'text-gray-700'
                  }`}>
                    {product.name}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                    <span>⭐ {product.avgRating}</span>
                    <span className="text-gray-400">({product.totalReviews.toLocaleString()})</span>
                  </div>
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

      {/* Customer Says Summary */}
      <div className="bg-gradient-to-br from-[#6691ff] to-[#8fa8ff] text-white p-8 rounded-xl mb-8 shadow-lg">
        <div className="flex items-start gap-4 mb-4">
          <MessageSquare className="w-8 h-8 flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-2xl mb-2">Customers Say</h2>
            <p className="text-lg text-white text-opacity-90 leading-relaxed">
              {currentData.customerSay}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-white text-opacity-80">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>전체 {totalReviews.toLocaleString()}개 리뷰 분석</span>
          </div>
          <div className="flex items-center gap-2">
            <span>긍정 반응 {currentData.sentiment[0].value}%</span>
          </div>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all group relative">
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <AddToCartButton 
              onAdd={() => addToCart({
                type: 'chart',
                title: `${selectedProduct} - 감정 분석 분포`,
                data: currentData.sentiment,
                page: 'review-analysis',
                uniqueKey: `review-sentiment-chart-${selectedProduct}`,
              })}
              onRemove={() => removeByUniqueKey(`review-sentiment-chart-${selectedProduct}`)}
              isInCart={isInCart(`review-sentiment-chart-${selectedProduct}`)}
            />
          </div>
          <h2 className="text-xl mb-6">감정 분석 분포</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={currentData.sentiment}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={100}
                dataKey="value"
              >
                {currentData.sentiment.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Reputation Score */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all group relative">
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <AddToCartButton 
              onAdd={() => addToCart({
                type: 'stat',
                title: `${selectedProduct} - 평판 지수`,
                data: { score: reputationScore, rating: averageRating, reviews: totalReviews },
                page: 'review-analysis',
                uniqueKey: `review-reputation-score-${selectedProduct}`,
              })}
              onRemove={() => removeByUniqueKey(`review-reputation-score-${selectedProduct}`)}
              isInCart={isInCart(`review-reputation-score-${selectedProduct}`)}
            />
          </div>
          <h2 className="text-xl mb-6">평판 지수</h2>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#6691ff"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - reputationScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl text-[#6691ff]">{reputationScore}</div>
                <div className="text-gray-500 text-sm">신뢰도 점수</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">⭐ {averageRating}</div>
              <div className="text-gray-600">{totalReviews.toLocaleString()}개 리뷰</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8 hover:shadow-lg transition-all group relative">
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <AddToCartButton 
            onAdd={() => addToCart({
              type: 'chart',
              title: `${selectedProduct} - 평점 분포`,
              data: currentData.ratingDist,
              page: 'review-analysis',
              uniqueKey: `review-rating-distribution-${selectedProduct}`,
            })}
            onRemove={() => removeByUniqueKey(`review-rating-distribution-${selectedProduct}`)}
            isInCart={isInCart(`review-rating-distribution-${selectedProduct}`)}
          />
        </div>
        <h2 className="text-xl mb-6">평점 분포</h2>
        <div className="space-y-3">
          {currentData.ratingDist.map((item: any) => (
            <div key={item.rating} className="flex items-center gap-4">
              <div className="w-16 text-sm text-gray-600">
                {item.rating}⭐
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-[#6691ff] h-full rounded-full transition-all flex items-center justify-end pr-2"
                  style={{ width: `${item.percentage}%` }}
                >
                  {item.percentage > 10 && (
                    <span className="text-white text-xs">{item.percentage}%</span>
                  )}
                </div>
              </div>
              <div className="w-24 text-sm text-gray-600 text-right">
                {item.count.toLocaleString()}개
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Keyword Map */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group relative">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl">AI 키워드 분석 및 비즈니스 인사이트</h2>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <AddToCartButton 
              onAdd={() => addToCart({
                type: 'table',
                title: `${selectedProduct} - AI 키워드 분석`,
                data: [
                  ['키워드', '언급 수', '감정', '점수', 'AI 인사이트'],
                  ...currentData.keywords.map((k: any) => [k.keyword, k.mentions, k.sentiment, k.score, k.aiInsight])
                ],
                page: 'review-analysis',
                uniqueKey: `review-keyword-analysis-${selectedProduct}`,
              })}
              onRemove={() => removeByUniqueKey(`review-keyword-analysis-${selectedProduct}`)}
              isInCart={isInCart(`review-keyword-analysis-${selectedProduct}`)}
            />
          </div>
        </div>
        <div className="p-6 space-y-6">
          {currentData.keywords.map((item: any, index: number) => {
            const IconComponent = item.sentiment === 'positive' 
              ? ThumbsUp 
              : item.sentiment === 'negative' 
              ? ThumbsDown 
              : Minus;
            const colorClass = item.sentiment === 'positive'
              ? 'text-green-600 bg-green-50'
              : item.sentiment === 'negative'
              ? 'text-red-600 bg-red-50'
              : 'text-yellow-600 bg-yellow-50';

            return (
              <div key={index} className="border-l-4 border-[#6691ff] pl-6 py-2">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="mb-1">{item.keyword}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{item.mentions.toLocaleString()}회 언급</span>
                        <span>·</span>
                        <span>점수 {item.score}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="text-[#6691ff]">💡 AI 해석:</span>
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.aiInsight}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}