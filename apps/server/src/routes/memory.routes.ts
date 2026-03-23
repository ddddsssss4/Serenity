import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";
import { qdrant, COLLECTION_NAME } from "../lib/qdrant.js";

const router = Router();

/**
 * GET /api/memories/:userId
 * Returns paginated memories for a user.
 * Query params: page (default 1), limit (default 20)
 */
router.get("/:userId", requireAuth, async (req, res) => {
  const { userId } = req.params;

  // Users can only access their own memories
  if (req.userId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
  const skip = (page - 1) * limit;

  try {
    const [memories, total] = await Promise.all([
      prisma.memory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          content: true,
          tags: true,
          emotion: true,
          people: true,
          importance: true,
          createdAt: true,
        },
      }),
      prisma.memory.count({ where: { userId } }),
    ]);

    res.json({
      memories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Get memories error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /api/memories/:memoryId
 * Deletes a specific memory from Prisma and Qdrant.
 * Privacy feature — users can erase their own memories.
 */
router.delete("/:memoryId", requireAuth, async (req, res) => {
  const memoryId = req.params.memoryId as string;

  try {
    // Verify ownership
    const memory = await prisma.memory.findUnique({
      where: { id: memoryId },
      select: { userId: true, qdrantId: true },
    });

    if (!memory) {
      res.status(404).json({ error: "Memory not found" });
      return;
    }

    if (memory.userId !== (req.userId as string)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    // Delete from Qdrant first (non-critical if fails)
    try {
      await qdrant.delete(COLLECTION_NAME, {
        points: [memory.qdrantId],
      });
    } catch (qdrantErr) {
      console.error("Qdrant delete error (non-fatal):", qdrantErr);
    }

    // Delete from Prisma
    await prisma.memory.delete({ where: { id: memoryId } });

    res.json({ success: true, message: "Memory deleted" });
  } catch (err) {
    console.error("Delete memory error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as memoriesRouter };
