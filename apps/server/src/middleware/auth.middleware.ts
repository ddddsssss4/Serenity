import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      userName?: string;
    }
  }
}

/**
 * Middleware that validates a better-auth session token from the
 * Authorization header or cookie, then attaches user info to req.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });

    if (!session?.user) {
      res.status(401).json({ error: "Unauthorized - invalid or expired session" });
      return;
    }

    req.userId = session.user.id;
    req.userEmail = session.user.email;
    req.userName = session.user.name;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
}

/**
 * WebSocket auth: validate token from query params or headers.
 * Returns userId if valid, null if not.
 */
export async function verifyWsToken(
  token: string
): Promise<{ userId: string; email: string; name: string } | null> {
  try {
    const session = await auth.api.getSession({
      headers: { authorization: `Bearer ${token}` },
    });

    if (!session?.user) return null;

    return {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name || "there",
    };
  } catch {
    return null;
  }
}
