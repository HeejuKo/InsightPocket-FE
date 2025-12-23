import { useState } from 'react';
import { Briefcase, X, FileSpreadsheet, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { InsightItem } from '../App';
import * as XLSX from 'xlsx';

interface InsightCartProps {
  items: InsightItem[];
  isOpen: boolean;
  onToggle: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function InsightCart({ items, isOpen, onToggle, onRemove, onClear }: InsightCartProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExcel = async () => {
    if (items.length === 0) return;

    setIsGenerating(true);

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 3500));

    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['LANEIGE Amazon Analytics Report'],
      ['Generated:', new Date().toLocaleString('ko-KR')],
      ['Total Items:', items.length],
      [''],
      ['Page', 'Item Type', 'Title', 'Added Time'],
      ...items.map(item => [
        item.page,
        item.type,
        item.title,
        item.timestamp.toLocaleString('ko-KR')
      ])
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

    // Data Sheets for each item
    items.forEach((item, index) => {
      let sheetData: any[][] = [];
      
      if (item.type === 'stat') {
        sheetData = [
          [item.title],
          ['Value', item.data.value],
          ['Change', item.data.change],
          ['Trend', item.data.trend]
        ];
      } else if (item.type === 'chart') {
        sheetData = [
          [item.title],
          [''],
          ...item.data.map((d: any) => Object.values(d))
        ];
        if (item.data.length > 0) {
          sheetData.splice(2, 0, Object.keys(item.data[0]));
        }
      } else if (item.type === 'table') {
        sheetData = [
          [item.title],
          [''],
          ...item.data
        ];
      } else if (item.type === 'insight') {
        sheetData = [
          [item.title],
          [''],
          [item.data]
        ];
      }

      const sheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, sheet, `Item_${index + 1}`);
    });

    // Generate and download
    XLSX.writeFile(wb, `LANEIGE_Insights_${new Date().getTime()}.xlsx`);

    setIsGenerating(false);
    onClear();
  };

  return (
    <>
      {/* Floating Pocket Button */}
      <motion.button
        onClick={onToggle}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#6691ff] text-white rounded-full shadow-lg hover:bg-[#5580ee] transition-colors z-40 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Briefcase className="w-6 h-6" />
        {items.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[24px] h-6 px-1.5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-md border-2 border-white"
          >
            {items.length}
          </motion.div>
        )}
      </motion.button>

      {/* Cart Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
            />

            {/* Cart Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#6691ff] to-[#7aa0ff] text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6" />
                    <h2 className="text-xl">Insight Pocket</h2>
                  </div>
                  <button
                    onClick={onToggle}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-sm text-white text-opacity-90">
                  {items.length}개의 인사이트가 담겨있습니다
                </p>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Briefcase className="w-16 h-16 mb-4 opacity-50" />
                    <p>담긴 인사이트가 없습니다</p>
                    <p className="text-sm mt-2">카드의 + 버튼을 클릭하세요</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 100 }}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-[#6691ff] transition-colors group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs px-2 py-1 bg-[#6691ff] text-white rounded">
                                  {item.page}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {item.type}
                                </span>
                              </div>
                              <h3 className="text-sm">{item.title}</h3>
                            </div>
                            <button
                              onClick={() => onRemove(item.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-400">
                            {item.timestamp.toLocaleString('ko-KR')}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              {items.length > 0 && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <button
                    onClick={generateExcel}
                    disabled={isGenerating}
                    className="w-full py-3 bg-[#6691ff] text-white rounded-lg hover:bg-[#5580ee] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    {isGenerating ? '생성 중...' : '엑셀 보고서 생성'}
                  </button>
                  <button
                    onClick={onClear}
                    className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    전체 삭제
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Loading Animation Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-[#6691ff] to-[#8fb3ff] z-50 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="mb-12"
            >
              <Sparkles className="w-20 h-20 text-white" />
            </motion.div>

            <h2 className="text-3xl text-white mb-12">보고서 생성 중...</h2>

            {/* Chart Drawing Animations */}
            <div className="relative w-[600px] h-[300px] bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
              {/* Bar Chart Animation */}
              <svg width="100%" height="100%" className="absolute inset-0 p-8">
                {/* Grid Lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.line
                    key={`grid-${i}`}
                    x1="60"
                    y1={60 + i * 50}
                    x2="540"
                    y2={60 + i * 50}
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                ))}

                {/* Animated Bars */}
                {[
                  { x: 100, height: 150, delay: 0.5 },
                  { x: 180, height: 120, delay: 0.7 },
                  { x: 260, height: 180, delay: 0.9 },
                  { x: 340, height: 100, delay: 1.1 },
                  { x: 420, height: 160, delay: 1.3 },
                ].map((bar, i) => (
                  <motion.rect
                    key={`bar-${i}`}
                    x={bar.x}
                    y={260 - bar.height}
                    width="40"
                    height={bar.height}
                    fill="white"
                    opacity="0.7"
                    initial={{ height: 0, y: 260 }}
                    animate={{ height: bar.height, y: 260 - bar.height }}
                    transition={{ duration: 0.6, delay: bar.delay, ease: "easeOut" }}
                  />
                ))}

                {/* Line Chart Animation */}
                <motion.path
                  d="M 60 200 L 150 150 L 240 180 L 330 120 L 420 140 L 520 100"
                  stroke="white"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                />

                {/* Dots on line */}
                {[
                  { cx: 60, cy: 200 },
                  { cx: 150, cy: 150 },
                  { cx: 240, cy: 180 },
                  { cx: 330, cy: 120 },
                  { cx: 420, cy: 140 },
                  { cx: 520, cy: 100 },
                ].map((dot, i) => (
                  <motion.circle
                    key={`dot-${i}`}
                    cx={dot.cx}
                    cy={dot.cy}
                    r="5"
                    fill="white"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.3 }}
                  />
                ))}

                {/* Pie Chart Segments */}
                <g transform="translate(500, 80)">
                  {[
                    { start: 0, end: 120, delay: 1.5 },
                    { start: 120, end: 240, delay: 1.7 },
                    { start: 240, end: 360, delay: 1.9 },
                  ].map((segment, i) => {
                    const startAngle = (segment.start - 90) * (Math.PI / 180);
                    const endAngle = (segment.end - 90) * (Math.PI / 180);
                    const x1 = Math.cos(startAngle) * 40;
                    const y1 = Math.sin(startAngle) * 40;
                    const x2 = Math.cos(endAngle) * 40;
                    const y2 = Math.sin(endAngle) * 40;
                    const largeArc = segment.end - segment.start > 180 ? 1 : 0;

                    return (
                      <motion.path
                        key={`pie-${i}`}
                        d={`M 0 0 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill="white"
                        opacity="0.6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: segment.delay }}
                      />
                    );
                  })}
                </g>
              </svg>
            </div>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white text-lg mt-12"
            >
              데이터를 정리하고 있습니다...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}