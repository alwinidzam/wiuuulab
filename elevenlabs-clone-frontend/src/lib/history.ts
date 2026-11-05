import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { getPresignedUrl } from "./s3";

export interface HistoryItem {
  id: string;
  title: string;
  voice: string;
  date: string;
  audioUrl: string;
  service: string;
  createdAt: Date;
}

function formatDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = today.getTime() - itemDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export async function getHistoryItems(service: string): Promise<HistoryItem[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    const clips = await db.generatedAudioClip.findMany({
      where: {
        userId: session.user.id,
        service: service,
        failed: false,
        s3Key: { not: null },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const items: HistoryItem[] = [];

    for (const clip of clips) {
      if (!clip.s3Key) continue;

      try {
        const audioUrl = await getPresignedUrl({ key: clip.s3Key });
        items.push({
          id: clip.id,
          title: clip.text || clip.voice || "Audio Clip",
          voice: clip.voice || "default",
          date: formatDate(clip.createdAt),
          audioUrl,
          service: clip.service,
          createdAt: clip.createdAt,
        });
      } catch {
        // Continue if S3 presigned generation fails for a single clip
      }
    }

    return items;
  } catch (err) {
    console.warn("getHistoryItems non-fatal fallback:", err);
    return [];
  }
}
