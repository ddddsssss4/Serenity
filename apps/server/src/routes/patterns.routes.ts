import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

/**
 * GET /api/patterns/:userId
 * Returns detected emotional/behavioral patterns by grouping memories by tags.
 * Tags that appear 3+ times are flagged as patterns.
 */
router.get("/:userId", requireAuth, async (req, res) => {
  const { userId } = req.params;

  if (req.userId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const memories = await prisma.memory.findMany({
      where: { userId },
      select: {
        tags: true,
        emotion: true,
        importance: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!memories.length) {
      res.json({ patterns: [], emotionDistribution: {}, totalMemories: 0 });
      return;
    }

    // ── Tag pattern detection ──────────────────────────────────────────
    const tagData: Record<
      string,
      { count: number; firstSeen: Date; lastSeen: Date }
    > = {};

    for (const m of memories) {
      for (const tag of m.tags) {
        if (!tagData[tag]) {
          tagData[tag] = {
            count: 0,
            firstSeen: m.createdAt,
            lastSeen: m.createdAt,
          };
        }
        tagData[tag].count += 1;
        if (m.createdAt < tagData[tag].firstSeen) {
          tagData[tag].firstSeen = m.createdAt;
        }
        if (m.createdAt > tagData[tag].lastSeen) {
          tagData[tag].lastSeen = m.createdAt;
        }
      }
    }

    // Pattern = tag appears 3+ times
    const patterns = Object.entries(tagData)
      .filter(([, data]) => data.count >= 3)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([tag, data]) => ({
        tag,
        count: data.count,
        firstSeen: data.firstSeen,
        lastSeen: data.lastSeen,
        spanDays: Math.round(
          (data.lastSeen.getTime() - data.firstSeen.getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      }));

    // ── Emotion distribution ───────────────────────────────────────────
    const emotionDistribution: Record<string, number> = {};
    for (const m of memories) {
      if (m.emotion) {
        emotionDistribution[m.emotion] =
          (emotionDistribution[m.emotion] || 0) + 1;
      }
    }

    // ── Most important memories (for sidebar) ─────────────────────────
    const topMemories = await prisma.memory.findMany({
      where: { userId },
      orderBy: [{ importance: "desc" }, { createdAt: "desc" }],
      take: 5,
      select: {
        id: true,
        content: true,
        tags: true,
        emotion: true,
        importance: true,
        createdAt: true,
      },
    });

    res.json({
      patterns,
      emotionDistribution,
      totalMemories: memories.length,
      topMemories,
    });
  } catch (err) {
    console.error("Get patterns error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as patternsRouter };
