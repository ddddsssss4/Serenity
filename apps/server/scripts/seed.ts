/**
 * Seed script: pre-seeds 5-6 fake memories for a demo user
 * so pattern detection fires immediately and impresses judges.
 *
 * Usage: bun run scripts/seed.ts
 */

import "../src/config/env.js"; // load env validation
import { prisma } from "../src/lib/prisma.js";
import { qdrant, COLLECTION_NAME, ensureCollection } from "../src/lib/qdrant.js";
import { embedText } from "../src/lib/gemini.js";
import { v4 as uuidv4 } from "uuid";

const DEMO_USER = {
  email: "demo@serenity.app",
  name: "Aria",
};

const SEED_MEMORIES = [
  {
    content:
      "She felt overwhelmed by her workload and cried in the bathroom at work. She said she hasn't slept properly in weeks because of work deadlines.",
    tags: ["work", "anxiety", "sleep"],
    emotion: "overwhelmed",
    people: ["manager"],
    importance: 8,
    daysAgo: 45,
  },
  {
    content:
      "She opened up about her relationship with her boyfriend — she feels like she's always the one putting in effort and it leaves her feeling unseen and unappreciated.",
    tags: ["relationship", "self-esteem", "anxiety"],
    emotion: "sad",
    people: ["boyfriend"],
    importance: 9,
    daysAgo: 38,
  },
  {
    content:
      "She mentioned her mom called again asking when she'll get married. She felt frustrated and like her achievements are always overlooked in favor of relationship milestones.",
    tags: ["family", "self-esteem", "relationship"],
    emotion: "frustrated",
    people: ["mom"],
    importance: 6,
    daysAgo: 30,
  },
  {
    content:
      "She hasn't been sleeping well again — waking up at 3am with anxious thoughts about whether she's doing enough in her career. She compared herself to a college friend who just got promoted.",
    tags: ["sleep", "anxiety", "work", "self-esteem"],
    emotion: "anxious",
    people: ["college friend"],
    importance: 7,
    daysAgo: 21,
  },
  {
    content:
      "She shared that she reached out to her boyfriend to talk about feeling disconnected but he dismissed her concerns. She cried after. She's starting to question the relationship.",
    tags: ["relationship", "grief", "anxiety"],
    emotion: "heartbroken",
    people: ["boyfriend"],
    importance: 9,
    daysAgo: 14,
  },
  {
    content:
      "She had a breakthrough moment — her presentation at work went exceptionally well and her director praised her in front of the whole team. She said it was the first time she felt truly seen at work in months.",
    tags: ["work", "self-esteem", "goals"],
    emotion: "hopeful",
    people: ["director", "team"],
    importance: 8,
    daysAgo: 7,
  },
];

async function seed() {
  console.log("🌱 Starting Serenity demo seed...\n");

  // Ensure Qdrant collection exists
  await ensureCollection();

  // Find or create demo user
  let user = await prisma.user.findUnique({
    where: { email: DEMO_USER.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: DEMO_USER.email,
        name: DEMO_USER.name,
      },
    });
    console.log(`✅ Created demo user: ${user.email} (id: ${user.id})`);
  } else {
    console.log(`✅ Using existing demo user: ${user.email} (id: ${user.id})`);
  }

  // Delete existing memories for clean re-seed
  const existing = await prisma.memory.findMany({
    where: { userId: user.id },
    select: { qdrantId: true },
  });

  if (existing.length > 0) {
    await qdrant.delete(COLLECTION_NAME, {
      points: existing.map((m: { qdrantId: string }) => m.qdrantId),
    });
    await prisma.memory.deleteMany({ where: { userId: user.id } });
    console.log(`🗑️  Cleared ${existing.length} existing memories\n`);
  }

  // Seed memories
  for (const seed of SEED_MEMORIES) {
    const memoryId = uuidv4();
    const qdrantId = uuidv4();
    const createdAt = new Date(
      Date.now() - seed.daysAgo * 24 * 60 * 60 * 1000
    );

    // Embed the memory content
    const embedding = await embedText(seed.content);

    // Save to Prisma
    await prisma.memory.create({
      data: {
        id: memoryId,
        userId: user.id,
        content: seed.content,
        qdrantId,
        tags: seed.tags,
        emotion: seed.emotion,
        people: seed.people,
        importance: seed.importance,
        createdAt,
      },
    });

    // Upsert to Qdrant
    await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      points: [
        {
          id: qdrantId,
          vector: embedding,
          payload: {
            userId: user.id,
            memoryId,
            content: seed.content,
            tags: seed.tags,
            emotion: seed.emotion,
            people: seed.people,
            importance: seed.importance,
            createdAt: createdAt.toISOString(),
          },
        },
      ],
    });

    console.log(
      `💾 Seeded memory [${seed.emotion}] tags:[${seed.tags.join(",")}] importance:${seed.importance}`
    );
  }

  console.log(`\n🎉 Seeded ${SEED_MEMORIES.length} memories for demo user!`);
  console.log(`\n📋 Demo user details:`);
  console.log(`   ID:    ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Name:  ${user.name}`);
  console.log(`\n🔍 Try: GET /api/patterns/${user.id}`);
  console.log(`🔍 Try: GET /api/memories/${user.id}\n`);

  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
