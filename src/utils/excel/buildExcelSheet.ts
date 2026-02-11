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
        case "dashboard-product-of-month": {
            const res = await fetchTop1BestSellerAIContext(item.meta?.month);
            const it = res?.result?.item ?? res?.item ?? res;

            return [
                ["지난 달 매출 1위"],
                ["제품명", it?.product_name ?? "-"],
                ["평점", it?.rating ?? "-"],
                ["리뷰 수", it?.review_count ?? "-"],
                ["순위 변동", it?.rank_change ?? "-"],
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

        default:
            return [[item.title], ["지원하지 않는 카드", kind]];
        }
}