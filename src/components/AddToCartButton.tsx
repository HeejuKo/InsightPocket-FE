import { Plus, Check, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface AddToCartButtonProps {
  onAdd: () => void;
  onRemove: () => void;
  isInCart: boolean;
}

export function AddToCartButton({ onAdd, onRemove, isInCart }: AddToCartButtonProps) {
  const [justChanged, setJustChanged] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJustChanged(true);

    if (isInCart) {
      onRemove();
    } else {
      onAdd();
    }

    // Reset after animation
    setTimeout(() => {
      setJustChanged(false);
    }, 1000);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`group relative p-2 rounded-lg transition-all ${
        isInCart
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white text-[#6691ff] hover:bg-[#6691ff] hover:text-white border border-[#6691ff]'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={justChanged ? { scale: [1, 1.3, 1], rotate: isInCart ? 0 : 360 } : {}}
        transition={{ duration: 0.5 }}
      >
        {isInCart ? (
          <Minus className="w-5 h-5" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
      </motion.div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-gray-800 text-white text-xs py-1 px-3 rounded whitespace-nowrap">
          {isInCart ? '장바구니에서 빼기' : '보고서에 담기'}
        </div>
      </div>

      {/* Flying Animation (only when adding) */}
      {justChanged && !isInCart && (
        <motion.div
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: window.innerWidth - 100,
            y: window.innerHeight - 100,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 bg-[#6691ff] rounded-lg pointer-events-none"
        />
      )}
    </motion.button>
  );
}
