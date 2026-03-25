import { Router } from "express";
import { auth } from "../lib/auth.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";

const router: Router = Router();

import { toNodeHandler } from "better-auth/node";

// Mount better-auth handler for all routes under this router
router.all("/*", toNodeHandler(auth));


router.post("/verify", requireAuth, async (req, res) => {
  try {
    // Try to find or create the app User record keyed by better-auth userId
    let user = await prisma.user.findFirst({
      where: { id: req.userId! },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // If no app user record yet, create it (first login)
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: req.userId!,
          email: req.userEmail!,
          name: req.userName || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Auth verify error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as authRouter };
