const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("⏳ Seeding demo data...");

  // Clear existing
  await prisma.interview.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.user.deleteMany();

  // -------------------------
  // 1️⃣ Create Demo User
  // -------------------------
  const user = await prisma.user.create({
    data: {
      username: "Demo User",
      email: "demo.user@example.com",
      password: await bcrypt.hash("demo123", 10),
      role: "USER",
    },
  });

  console.log("✅ User created:", user.email);

  // -------------------------
  // 2️⃣ Create Demo Mentor
  // -------------------------
  const mentor = await prisma.mentor.create({
    data: {
      name: "Demo Mentor",
      email: "demo.mentor@example.com",
      speciality: "AI/ML",
      bio: "Expert in Machine Learning & AI interviews.",
      imageUrl: "",
      isActive: true,
    },
  });

  // 2.1 Create User account for this Mentor (so they can log in)
  await prisma.user.create({
    data: {
      username: "Demo Mentor",
      email: "demo.mentor@example.com",
      password: await bcrypt.hash("demo123", 10),
      role: "MENTOR",
    },
  });

  console.log("✅ Mentor created:", mentor.email);

  // -------------------------
  // 3️⃣ Create Admin User
  // -------------------------
  const admin = await prisma.user.create({
    data: {
      username: "Abhijeet",
      email: "abhijeet@gmail.com",
      password: await bcrypt.hash("12345678", 10),
      role: "ADMIN",
    },
  });

  console.log("✅ Admin created:", admin.email);

  // -------------------------
  // 3️⃣ Create Demo Interviews
  // -------------------------
  const interviews = [
    // ✅ Live human mentor interview
    {
      role: "Machine Learning Engineer",
      type: "HUMAN",
      level: "Mid",
      techstack: ["Python", "TensorFlow", "ML Algorithms"],
      questions: [],
      finalized: false,
      coverImage: null,
      date: new Date(),
      time: "10:00 AM",
      duration: 60,
      status: "ACCEPTED",
      userId: user.id,
      mentorId: mentor.id,
    },
    // ✅ AI-generated interview sample
    {
      role: "Frontend Developer",
      type: "AI",
      level: "Junior",
      techstack: ["React", "JavaScript", "HTML", "CSS"],
      questions: [
        "Explain virtual DOM.",
        "What is closure in JavaScript?",
        "When do you use useEffect in React?",
      ],
      finalized: true,
      coverImage: "",
      date: new Date(),
      time: "2:00 PM",
      duration: 45,
      status: "ACCEPTED",
      userId: user.id,
      mentorId: null,
    },
  ];

  for (const data of interviews) {
    const interview = await prisma.interview.create({ data });
    console.log(`✅ Interview created: ${interview.role} (${interview.type})`);
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => console.error("❌ Seed error:", e))
  .finally(() => prisma.$disconnect());
