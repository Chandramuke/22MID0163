/**
 * src/lib/api.ts
 * Calls the local Next.js proxy routes — avoids CORS issues.
 */

import type { Notification, FilterType } from "@/types";

export interface FetchParams {
  limit?: number;
  page?: number;
  notification_type?: FilterType;
}

export async function fetchNotifications(
  params: FetchParams = {}
): Promise<{ notifications: Notification[]; total?: number }> {
  const url = new URL("/api/notifications", window.location.origin);

  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.page)  url.searchParams.set("page",  String(params.page));
  if (params.notification_type && params.notification_type !== "All") {
    url.searchParams.set("notification_type", params.notification_type);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `API Error: ${res.status}`);
  }

  const data = await res.json();
  return {
    notifications: (data.notifications ?? []) as Notification[],
    total: data.total,
  };
}
