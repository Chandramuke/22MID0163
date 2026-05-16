/**
 * src/lib/priority.ts
 * Max-Heap based priority scoring for notifications.
 */

import type { Notification, ScoredNotification, NotificationType } from "@/types";

export const TYPE_WEIGHT: Record<NotificationType, number> = {
  Placement: 300,
  Result:    200,
  Event:     100,
};

export function computePriorityScore(n: Notification): number {
  return TYPE_WEIGHT[n.Type] + new Date(n.Timestamp).getTime() / 1e9;
}

class MaxHeap {
  private heap: ScoredNotification[] = [];
  get size() { return this.heap.length; }

  insert(item: ScoredNotification): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMax(): ScoredNotification | null {
    if (!this.heap.length) return null;
    const max = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length) { this.heap[0] = last; this.sinkDown(0); }
    return max;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[p].score >= this.heap[i].score) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }

  private sinkDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let largest = i;
      const l = 2*i+1, r = 2*i+2;
      if (l < n && this.heap[l].score > this.heap[largest].score) largest = l;
      if (r < n && this.heap[r].score > this.heap[largest].score) largest = r;
      if (largest === i) break;
      [this.heap[largest], this.heap[i]] = [this.heap[i], this.heap[largest]];
      i = largest;
    }
  }
}

export function getTopNNotifications(notifications: Notification[], n: number): ScoredNotification[] {
  const heap = new MaxHeap();
  for (const notif of notifications) {
    heap.insert({ ...notif, score: computePriorityScore(notif) });
  }
  const result: ScoredNotification[] = [];
  for (let i = 0; i < n && heap.size > 0; i++) {
    result.push(heap.extractMax()!);
  }
  return result;
}
