import { useState } from "react";
import { Briefcase, ShoppingCart, FileSpreadsheet, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { InsightItem } from "../App";
import * as XLSX from "xlsx";

import { InsightCartItem } from "./InsightCartItem";
import { InsightCartLoading } from "./InsightCartLoading";

import "../styles/InsightCart.css";
import bagIcon from "../assets/bag.svg";
import docsIcon from "../assets/docs.svg";
import trashIcon from "../assets/trash.svg";

interface InsightCartProps {
  items: InsightItem[];
  isOpen: boolean;
  onToggle: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function InsightCart({
  items,
  isOpen,
  onToggle,
  onRemove,
  onClear,
}: InsightCartProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* =====================
     Derived State
  ===================== */
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const selectedItems = items.filter((item) => selectedIds.includes(item.id));

  /* =====================
     Selection Logic
  ===================== */
  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : items.map((item) => item.id));
  };

  /* =====================
     Excel Generation
  ===================== */
  const generateExcel = async () => {
    if (selectedItems.length === 0) return;

    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 3500));

    const wb = XLSX.utils.book_new();

    /* ===== Summary ===== */
    const summaryData = [
      ["LANEIGE Amazon Analytics Report"],
      ["Generated:", new Date().toLocaleString("ko-KR")],
      ["Total Items:", selectedItems.length],
      [""],
      ["Page", "Item Type", "Title", "Added Time"],
      ...selectedItems.map((item) => [
        item.page,
        item.type,
        item.title,
        item.timestamp.toLocaleString("ko-KR"),
      ]),
    ];

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet(summaryData),
      "Summary"
    );

    /* ===== Item Sheets ===== */
    selectedItems.forEach((item, idx) => {
      let data: any[][] = [];

      if (item.type === "stat") {
        data = [
          [item.title],
          ["Value", item.data.value],
          ["Change", item.data.change],
          ["Trend", item.data.trend],
        ];
      } else if (item.type === "chart") {
        data = [
          [item.title],
          [],
          Object.keys(item.data[0]),
          ...item.data.map(Object.values),
        ];
      } else if (item.type === "table") {
        data = [[item.title], [], ...item.data];
      } else if (item.type === "insight") {
        data = [[item.title], [], [item.data]];
      }

      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.aoa_to_sheet(data),
        `Item_${idx + 1}`
      );
    });

    XLSX.writeFile(wb, `LANEIGE_Insights_${Date.now()}.xlsx`);

    setIsGenerating(false);
    setSelectedIds([]);
    onClear();
  };

  return (
    <>
      {/* ================= Floating Button ================= */}
      <motion.button
        onClick={onToggle}
        className="ic-fab"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src={bagIcon} alt="" className="ic-fab-icon" />
        {items.length > 0 && (
          <span className="ic-fab__count">{items.length}</span>
        )}
      </motion.button>

      {/* ================= Drawer ================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="ic-backdrop" onClick={onToggle} />

            <motion.div
              className="ic-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.35,
              }}
            >
              {/* ===== Header ===== */}
              <header className="ic-header">
                <div className="ic-header__top">
                  <div className="ic-header__title">
                    <img src={bagIcon} alt="" className="ic-btn__icon" />
                    <h2>Insight Pocket</h2>
                  </div>
                  <button onClick={onToggle} className="ic-header__close">
                    ×
                  </button>
                </div>
                <p className="ic-header__desc">
                  {items.length}개의 인사이트가 담겨 있습니다
                </p>
              </header>

              {/* ===== Select Bar ===== */}
              {items.length > 0 && (
                <div className="ic-select-bar">
                  <div className="ic-select-all">
                    <label className="ic-select-all__check">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                      />
                      <span className="ic-checkbox" />
                    </label>
                    <button
                      className="ic-select-all-btn"
                      onClick={toggleSelectAll}
                    >
                      {isAllSelected ? "전체 해제" : "전체 선택"}
                    </button>
                  </div>

                  <span className="ic-select-count">
                    {selectedIds.length}/{items.length} 선택됨
                  </span>
                </div>
              )}

              {/* ===== Item List ===== */}
              <section className="ic-list">
                {items.length === 0 ? (
                  <div className="ic-empty">담긴 인사이트가 없습니다</div>
                ) : (
                  items.map((item) => (
                    <InsightCartItem
                      key={item.id}
                      item={item}
                      checked={selectedIds.includes(item.id)}
                      onToggle={toggleItem}
                      onRemove={onRemove}
                    />
                  ))
                )}
              </section>

              {/* ===== Footer ===== */}
              {items.length > 0 && (
                <footer className="ic-footer">
                  <button
                    className="ic-btn ic-btn--primary"
                    disabled={isGenerating || selectedItems.length === 0}
                    onClick={generateExcel}
                  >
                    <img src={docsIcon} alt="" className="ic-btn__icon" />
                    엑셀 자동 저장 ({selectedItems.length}개)
                  </button>

                  <button
                    className="ic-btn ic-btn--ghost"
                    onClick={() => {
                      setSelectedIds([]);
                      onClear();
                    }}
                  >
                    <img src={trashIcon} alt="" className="ic-btn__icon" />
                    전체 삭제
                  </button>
                </footer>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <InsightCartLoading visible={isGenerating} />
    </>
  );
}
