import { Router } from "express";
import { auth } from "../lib/auth.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Mount better-auth handler for all /api/auth/* routes
router.all("/auth/*", async (req, res) => {
  // Convert Express req to a standard Request object for better-auth
  const url = new URL(req.url, `http://${req.headers.host}`);
  const headers = new Headers(req.headers as Record<string, string>);

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = JSON.stringify(req.body);
    headers.set("content-type", "application/json");
  }

  const response = await auth.handler(
    new Request(url.toString(), {
      method: req.method,
      headers,
      body,
    })
  );

  // Forward status and headers
  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const text = await response.text();
  res.send(text);
});

/**
 * POST /api/auth/verify
 * Validates the current better-auth session and returns the user profile.
 * Uses the app User table (not the auth_user table).
 */
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
