import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createSession } from "../services/session.service.js";
import { saveMemoryAsync } from "../services/memory.service.js";

const router = Router();

/**
 * POST /api/journal
 * Saves a journal entry as a new session and auto-extracts memories.
 * Body: { content: string }
 */
router.post("/", requireAuth, async (req, res) => {
  const { content } = req.body as { content: string };

  if (!content || typeof content !== "string" || content.trim().length < 10) {
    res.status(400).json({ error: "Journal entry must be at least 10 characters" });
    return;
  }

  try {
    const userId = req.userId!;

    // Create a new session for this journal entry
    const sessionId = await createSession(userId);

    // Trigger async memory extraction — fire and forget
    const transcript = `user: ${content.trim()}`;
    saveMemoryAsync(userId, sessionId, transcript).catch(console.error);

    res.status(201).json({
      success: true,
      sessionId,
      message: "Journal entry saved. Memories are being extracted in the background.",
    });
  } catch (err) {
    console.error("Journal save error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as journalRouter };
