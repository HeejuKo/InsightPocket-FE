import { TrendingUp, TrendingDown, DollarSign, Package, Star, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AddToCartButton } from './AddToCartButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { InsightItem } from '../App';

const salesData = [
  { date: '11/22', sales: 3800 },
  { date: '11/23', sales: 4200 },
  { date: '11/24', sales: 3900 },
  { date: '11/25', sales: 5100 },
  { date: '11/26', sales: 4600 },
  { date: '11/27', sales: 5800 },
  { date: '11/28', sales: 6200 },
  { date: '11/29', sales: 5900 },
  { date: '11/30', sales: 6500 },
  { date: '12/01', sales: 5800 },
  { date: '12/02', sales: 6100 },
  { date: '12/03', sales: 5700 },
  { date: '12/04', sales: 6300 },
  { date: '12/05', sales: 6800 },
  { date: '12/06', sales: 7100 },
  { date: '12/07', sales: 6900 },
  { date: '12/08', sales: 7400 },
  { date: '12/09', sales: 7200 },
  { date: '12/10', sales: 7600 },
  { date: '12/11', sales: 8100 },
  { date: '12/12', sales: 7800 },
  { date: '12/13', sales: 8300 },
  { date: '12/14', sales: 8000 },
  { date: '12/15', sales: 8500 },
  { date: '12/16', sales: 8200 },
  { date: '12/17', sales: 8700 },
  { date: '12/18', sales: 8400 },
  { date: '12/19', sales: 8900 },
  { date: '12/20', sales: 9200 },
  { date: '12/21', sales: 8800 },
];

const topProducts = [
  { name: 'Water Sleeping Mask', sales: 2840, rank: 1, prevRank: 3, change: 2, rating: 4.7, reviews: 3245 },
  { name: 'Lip Sleeping Mask', sales: 2180, rank: 2, prevRank: 1, change: -1, rating: 4.8, reviews: 4521 },
  { name: 'Cream Skin Refiner', sales: 1956, rank: 3, prevRank: 4, change: 1, rating: 4.6, reviews: 2108 },
  { name: 'Water Bank Moisture Cream', sales: 1742, rank: 4, prevRank: 7, change: 3, rating: 4.5, reviews: 1876 },
  { name: 'Neo Cushion', sales: 1598, rank: 5, prevRank: 5, change: 0, rating: 4.7, reviews: 2934 },
];

const productOfMonth = {
  name: 'Water Sleeping Mask',
  sales: 2840,
  rating: 4.7,
  reviews: 3245,
  growth: '+23%'
};

const risingProduct = {
  name: 'Water Bank Moisture Cream',
  sales: 1742,
  rating: 4.5,
  reviews: 1876,
  growth: '+47%',
  rankChange: 3
};

const insights = [
  {
    icon: '🎉',
    text: 'Lip Sleeping Mask의 순위가 어제에 비해 2등 올랐어요!'
  },
  {
    icon: '🏆',
    text: 'Water Sleeping Mask가 뷰티 카테고리에서 5주 연속 1위를 달성했습니다.'
  }
];

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend,
  onAddToCart,
  onRemoveFromCart,
  isInCart,
}: { 
  title: string; 
  value: string; 
  change: string; 
  icon: any; 
  trend: 'up' | 'down';
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  isInCart: boolean;
}) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all group relative">
    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <AddToCartButton onAdd={onAddToCart} onRemove={onRemoveFromCart} isInCart={isInCart} />
    </div>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-[#6691ff]" />
      </div>
      <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{change}</span>
      </div>
    </div>
    <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
    <p className="text-2xl">{value}</p>
  </div>
);

interface DashboardProps {
  addToCart: (item: Omit<InsightItem, 'id' | 'timestamp'>) => void;
  removeByUniqueKey: (uniqueKey: string) => void;
  isInCart: (uniqueKey: string) => boolean;
}

export function Dashboard({ addToCart, removeByUniqueKey, isInCart }: DashboardProps) {
  const currentInsight = insights[0];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">요약 대시보드</h1>
        <p className="text-gray-600">LANEIGE 아마존 지난 달 데이터 분석</p>
      </div>

      {/* Today's Insight */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-[#6691ff] p-6 rounded-lg mb-8 flex items-start gap-4">
        <div className="text-4xl">{currentInsight.icon}</div>
        <div className="flex-1">
          <h3 className="mb-2 text-gray-500 text-sm">오늘의 인사이트</h3>
          <p className="text-lg text-gray-800">{currentInsight.text}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="총 판매량 (지난 달)"
          value="54,280"
          change="+12.5%"
          icon={Package}
          trend="up"
          onAddToCart={() => addToCart({
            type: 'stat',
            title: '총 판매량 (지난 달)',
            data: { value: '54,280', change: '+12.5%', trend: 'up' },
            page: 'dashboard',
            uniqueKey: 'dashboard-stat-sales',
          })}
          onRemoveFromCart={() => removeByUniqueKey('dashboard-stat-sales')}
          isInCart={isInCart('dashboard-stat-sales')}
        />
        <StatCard
          title="매출액 (지난 달)"
          value="$1.2M"
          change="+8.3%"
          icon={DollarSign}
          trend="up"
          onAddToCart={() => addToCart({
            type: 'stat',
            title: '매출액 (지난 달)',
            data: { value: '$1.2M', change: '+8.3%', trend: 'up' },
            page: 'dashboard',
            uniqueKey: 'dashboard-stat-revenue',
          })}
          onRemoveFromCart={() => removeByUniqueKey('dashboard-stat-revenue')}
          isInCart={isInCart('dashboard-stat-revenue')}
        />

        {/* Product of the Month Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all group relative col-span-1">
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <AddToCartButton 
              onAdd={() => addToCart({
                type: 'stat',
                title: '이달의 제품',
                data: productOfMonth,
                page: 'dashboard',
                uniqueKey: 'dashboard-product-of-month',
              })}
              onRemove={() => removeByUniqueKey('dashboard-product-of-month')}
              isInCart={isInCart('dashboard-product-of-month')}
            />
          </div>
          <div className="flex items-start gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm text-gray-600">이달의 제품</h3>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src="https://via.placeholder.com/64x64/6691ff/ffffff?text=WSM"
                alt={productOfMonth.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate mb-1">{productOfMonth.name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{productOfMonth.rating}</span>
                <span className="text-gray-400">({productOfMonth.reviews.toLocaleString()})</span>
              </div>
            </div>
          </div>
          <div className="text-green-600 text-sm">{productOfMonth.growth} 성장</div>
        </div>

        {/* Rising Product Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all group relative col-span-1">
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <AddToCartButton 
              onAdd={() => addToCart({
                type: 'stat',
                title: '급상승한 제품',
                data: risingProduct,
                page: 'dashboard',
                uniqueKey: 'dashboard-rising-product',
              })}
              onRemove={() => removeByUniqueKey('dashboard-rising-product')}
              isInCart={isInCart('dashboard-rising-product')}
            />
          </div>
          <div className="flex items-start gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-sm text-gray-600">급상승한 제품</h3>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src="https://via.placeholder.com/64x64/6691ff/ffffff?text=WB"
                alt={risingProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate mb-1">{risingProduct.name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{risingProduct.rating}</span>
                <span className="text-gray-400">({risingProduct.reviews.toLocaleString()})</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-sm">{risingProduct.growth} 성장</span>
            <span className="text-gray-400">·</span>
            <span className="text-sm text-gray-600">순위 +{risingProduct.rankChange}</span>
          </div>
        </div>
      </div>

      {/* Sales Trend - Last Month */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all group relative mb-8">
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <AddToCartButton 
            onAdd={() => addToCart({
              type: 'chart',
              title: '지난 달 판매 추이',
              data: salesData,
              page: 'dashboard',
              uniqueKey: 'dashboard-chart-monthly-sales',
            })}
            onRemove={() => removeByUniqueKey('dashboard-chart-monthly-sales')}
            isInCart={isInCart('dashboard-chart-monthly-sales')}
          />
        </div>
        <h2 className="text-xl mb-4">지난 달 판매 추이</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#6691ff" 
              strokeWidth={3}
              dot={{ fill: '#6691ff', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Best Sellers TOP 5 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group relative mb-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl">베스트 셀러 TOP 5 (지난 달 기준)</h2>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <AddToCartButton 
              onAdd={() => addToCart({
                type: 'table',
                title: '베스트 셀러 TOP 5',
                data: [
                  ['순위', '제품명', '판매량', '평점', '리뷰 수'],
                  ...topProducts.map(p => [p.rank, p.name, p.sales, p.rating, p.reviews])
                ],
                page: 'dashboard',
                uniqueKey: 'dashboard-table-top5',
              })}
              onRemove={() => removeByUniqueKey('dashboard-table-top5')}
              isInCart={isInCart('dashboard-table-top5')}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">순위</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">제품명</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">판매량</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">평점</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">리뷰 수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product) => (
                <tr key={product.rank} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#6691ff] text-white">
                      {product.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.sales.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.reviews.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details with Ranking Changes */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group relative">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl">제품별 상세 현황</h2>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <AddToCartButton 
              onAdd={() => addToCart({
                type: 'table',
                title: '제품별 상세 현황',
                data: [
                  ['순위', '제품명', '지난 달 판매량', '이전 달 순위', '순위 변동'],
                  ...topProducts.map(p => [p.rank, p.name, p.sales, p.prevRank, p.change])
                ],
                page: 'dashboard',
                uniqueKey: 'dashboard-table-details',
              })}
              onRemove={() => removeByUniqueKey('dashboard-table-details')}
              isInCart={isInCart('dashboard-table-details')}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600">현재 순위</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">제품명</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">지난 달 판매량</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">이전 달 순위</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600">순위 변동</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product) => (
                <tr key={product.rank} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#6691ff] text-white">
                      {product.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.sales.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">{product.prevRank}위</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {product.change > 0 && (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">+{product.change} 상승</span>
                        </>
                      )}
                      {product.change < 0 && (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">{product.change} 하락</span>
                        </>
                      )}
                      {product.change === 0 && (
                        <span className="text-gray-400">변동 없음</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
