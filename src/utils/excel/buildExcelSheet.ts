import type { InsightItem } from "../../App";
import {
  fetchTop1BestSellerAIContext,
  fetchRisingProductItemAIContext,
} from "../../api/dashboard";

export async function buildExcelSheetData(
  item: InsightItem
): Promise<any[][]> {
    const kind = item.meta?.kind ?? item.uniqueKey;

    switch (kind) {
        case "dashboard-stat-sales": {
            return [
                ["지난 달 총 판매량"],
                ["값", item.data?.value ?? "-"],
                ["변화", item.data?.change ?? "-"],
                ["추세", item.data?.trend ?? "-"],
            ];
            }

        case "dashboard-stat-revenue": {
            return [
                ["지난 달 매출액"],
                ["값", item.data?.value ?? "-"],
                ["변화", item.data?.change ?? "-"],
                ["추세", item.data?.trend ?? "-"],
            ];
            }
        case "dashboard-product-of-month": {
            const res = await fetchTop1BestSellerAIContext(item.meta?.month);
            const it = res?.result?.item ?? res?.item ?? res;

            return [
                ["지난 달 매출 1위"],
                ["제품명", it?.product_name ?? "-"],
                ["평점", it?.rating ?? "-"],
                ["리뷰 수", it?.review_count ?? "-"],
                ["순위 변동", it?.rank_change === 0 ? 0 : "-"],
            ];
        }

        case "dashboard-rising-product": {
            const res = await fetchRisingProductItemAIContext(item.meta?.month);
            const it = res?.result?.item ?? res?.item ?? res;

            return [
                ["급상승한 제품"],
                ["제품명", it?.product_name ?? "-"],
                ["평점", it?.rating ?? "-"],
                ["리뷰 수", it?.review_count ?? "-"],
                ["성장률", it?.growth_rate ?? "-"], 
            ];
        }

        case "dashboard-chart-monthly-sales": {
            const rows = Array.isArray(item.data) ? item.data : [];
            if (rows.length === 0) {
                return [["지난 달 판매 추이"], [], ["데이터 없음"]];
            }

            const headers = Object.keys(rows[0]); // 예: date, sales
            return [
                ["지난 달 판매 추이"],
                [],
                headers,
                ...rows.map((r) => headers.map((h) => r?.[h] ?? "")),
            ];
        }

        case "dashboard-table-top5": {
            const rows = Array.isArray(item.data) ? item.data : [];

            return [
                ["지난 달 베스트 셀러 TOP 5"],
                [],
                ["순위", "제품명", "판매량", "평점", "리뷰 수"],
                ...rows.map((r: any) => [
                r?.rank ?? "-",
                r?.name ?? "-",
                r?.sales ?? "-",
                r?.rating ?? "-",
                r?.reviews ?? "-",
                ]),
            ];
        }

        case "dashboard-table-product-detail": {
            const rows = Array.isArray(item.data) ? item.data : [];

            const formatRankChange = (v: number | undefined | null) => {
                if (v === 0) return "0";
                if (typeof v === "number" && v > 0) return `+${v}`;
                if (typeof v === "number" && v < 0) return `-${v}`;
                return "-";
            };

            return [
                ["지난 달 베스트 셀러 TOP 5 상세 정보"],
                [],
                ["순위", "제품명", "지난 달 판매량", "지난달 순위", "순위 변동"],
                ...rows.map((r: any) => [
                    r?.rank ?? "-",
                    r?.name ?? "-",
                    r?.sales ?? "-",
                    r?.prevRank ?? "-",
                    formatRankChange(
                        r?.rankChange ?? r?.rank_change
                    ),
                ]),
            ];
        }

        default:
            return [[item.title], ["지원하지 않는 카드", kind]];
  
    }
}