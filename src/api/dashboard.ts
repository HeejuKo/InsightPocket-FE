// src/api/dashboard.ts
import { API_BASE_URL } from "../config/api";

export async function fetchTop5Bestsellers(month: string) {
  const res = await fetch(
    `${API_BASE_URL}/api/dashboard/bestsellers/top5?month=${month}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch top5 bestsellers");
  }

  return res.json();
}
