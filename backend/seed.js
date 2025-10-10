const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("⏳ Seeding demo data...");

  // Clear existing interviews
  await prisma.interview.deleteMany();

  // -------------------------
  // 1️⃣ Create or Upsert Demo User
  // -------------------------
  const user = await prisma.user.upsert({
    where: { email: "demo.user@example.com" },
    update: {},
    create: {
      username: "Demo User",
      email: "demo.user@example.com",
      password: "demo123", // hash if needed
      role: "USER",
    },
  });
  console.log("✅ Demo user created or found:", user.username);

  // -------------------------
  // 2️⃣ Create or Upsert Demo Mentor
  // -------------------------
  const mentor = await prisma.mentor.upsert({
    where: { email: "demo.mentor@example.com" },
    update: {},
    create: {
      name: "Demo Mentor",
      email: "demo.mentor@example.com",
      speciality: "AI/ML",
      imageUrl: "",
      bio: "Expert in AI and Machine Learning",
      isActive: true,
    },
  });
  console.log("✅ Demo mentor created or found:", mentor.name);

  // -------------------------
  // 3️⃣ Create Demo Interviews
  // -------------------------
  const interviews = [
    {
      userId: user.id,
      mentorId: mentor.id,
      date: new Date(),
      time: "10:00 AM",
      type: "HUMAN",
      duration: 60,
      status: "SCHEDULED",
    },
    {
      userId: user.id,
      mentorId: null, // AI interview
      date: new Date(),
      time: "2:00 PM",
      type: "AI",
      duration: 45,
      status: "SCHEDULED",
    },
    {
      userId: user.id,
      mentorId: mentor.id,
      date: new Date(),
      time: "4:00 PM",
      type: "HUMAN",
      duration: 30,
      status: "COMPLETED",
    },
  ];

  for (const data of interviews) {
    const interview = await prisma.interview.create({
      data,
      include: { user: true, mentor: true },
    });
    console.log(
      `✅ Interview created: ${interview.user.username} ↔ ${interview.mentor?.name || "AI Interview"} (${interview.type}, ${interview.status})`
    );
  }

  console.log("🎉 Seeder finished!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
