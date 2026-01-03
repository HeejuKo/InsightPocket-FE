import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function InsightCartLoading({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="ic-loading">
          <Sparkles className="ic-loading__icon" />
          <p>보고서 생성 중…</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}