import express from "express";
import cors from "cors";
import { createServer } from "http";
import { env } from "./config/env.js";
import { ensureCollection } from "./lib/qdrant.js";
import { authRouter } from "./routes/auth.routes.js";
import { memoriesRouter } from "./routes/memory.routes.js";
import { journalRouter } from "./routes/journal.routes.js";
import { patternsRouter } from "./routes/patterns.routes.js";
import { createVoiceWebSocketServer } from "./handlers/voice.handler.js";

// ─────────────────────────────────────────────────────────────────────────────
// Express App
// ─────────────────────────────────────────────────────────────────────────────

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "serenity-backend",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────────────────

app.use("/api/auth", authRouter);
app.use("/api/memories", memoriesRouter);
app.use("/api/journal", journalRouter);
app.use("/api/patterns", patternsRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// HTTP + WebSocket Server
// ─────────────────────────────────────────────────────────────────────────────

const server = createServer(app);

// Attach WebSocket voice handler
createVoiceWebSocketServer(server);

// ─────────────────────────────────────────────────────────────────────────────
// Startup
// ─────────────────────────────────────────────────────────────────────────────

async function start(): Promise<void> {
  try {
    // Ensure Qdrant collection exists before accepting requests
    await ensureCollection();

    server.listen(env.PORT, () => {
      console.log(`\n🌸 Serenity backend listening on http://localhost:${env.PORT}`);
      console.log(`📡 WebSocket voice stream: ws://localhost:${env.PORT}/api/voice/stream`);
      console.log(`🔑 Auth: http://localhost:${env.PORT}/api/auth`);
      console.log(`\nEnvironment: ${env.NODE_ENV}\n`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
