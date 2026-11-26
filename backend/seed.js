const prisma = require("./lib/prisma");
const bcrypt = require("bcrypt");

async function main() {
  console.log("=========================================");
  console.log("🌱 Resetting and Seeding InterBit Database");
  console.log("=========================================\n");

  // -------------------------
  // 1️⃣ Reset Database
  // -------------------------
  console.log("🧹 Purging existing data...");
  await prisma.interview.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ All tables cleared.\n");

  // Default hashed passwords
  const userPasswordHash = await bcrypt.hash("user123", 10);
  const mentorPasswordHash = await bcrypt.hash("mentor123", 10);
  const adminPasswordHash = await bcrypt.hash("12345678", 10);

  // -------------------------
  // 2️⃣ Create Admin User
  // -------------------------
  console.log("👑 Creating Admin User...");
  const admin = await prisma.user.create({
    data: {
      username: "Abhijeet (Admin)",
      email: "abhijeet@gmail.com",
      password: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin: ${admin.email} (Password: 12345678)\n`);

  // -------------------------
  // 3️⃣ Create Normal Users
  // -------------------------
  console.log("👤 Creating Candidate Users...");
  const candidateUsersData = [
    {
      username: "Alex Chen",
      email: "alex.chen@example.com",
      password: userPasswordHash,
      role: "USER",
    },
    {
      username: "Sarah Connor",
      email: "sarah.connor@example.com",
      password: userPasswordHash,
      role: "USER",
    },
    {
      username: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      password: userPasswordHash,
      role: "USER",
    },
  ];

  const createdUsers = [];
  for (const u of candidateUsersData) {
    const user = await prisma.user.create({ data: u });
    createdUsers.push(user);
    console.log(`✅ Candidate: ${user.username} <${user.email}> (Password: user123)`);
  }
  console.log();

  // -------------------------
  // 4️⃣ Create Mentors & Mentor User Accounts
  // -------------------------
  console.log("🧑‍🏫 Creating Mentors & Login Credentials...");
  const mentorsData = [
    {
      name: "Dr. Priya Patel",
      email: "priya.patel@example.com",
      phone: "+1-555-0101",
      speciality: "AI/ML & Data Science",
      bio: "Senior ML Engineer with 8+ years leading deep learning and computer vision architectures at Tier-1 tech.",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      isActive: true,
    },
    {
      name: "Marcus Vance",
      email: "marcus.vance@example.com",
      phone: "+1-555-0102",
      speciality: "Full Stack & Cloud Architecture",
      bio: "Principal Software Architect specializing in distributed Node.js/Go backends, GraphQL, and AWS cloud migrations.",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      isActive: true,
    },
    {
      name: "Elena Rostova",
      email: "elena.rostova@example.com",
      phone: "+1-555-0103",
      speciality: "Frontend Engineering & UI Systems",
      bio: "Staff Frontend Engineer specializing in Next.js, performance optimization, and scalable design system engineering.",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      isActive: true,
    },
    {
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1-555-0104",
      speciality: "DevOps & Platform Engineering",
      bio: "Site Reliability Director helping candidates master Kubernetes, Terraform, CI/CD, and system resiliency interviews.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      isActive: true,
    },
  ];

  const createdMentors = [];
  for (const m of mentorsData) {
    // 1. Create Mentor profile
    const mentor = await prisma.mentor.create({ data: m });
    createdMentors.push(mentor);

    // 2. Create corresponding User account so Mentor can log in
    await prisma.user.create({
      data: {
        username: m.name,
        email: m.email,
        password: mentorPasswordHash,
        role: "MENTOR",
      },
    });

    console.log(`✅ Mentor & Login: ${mentor.name} <${mentor.email}> (${mentor.speciality}) (Password: mentor123)`);
  }
  console.log();

  // -------------------------
  // 5️⃣ Create Demo Interviews
  // -------------------------
  console.log("📋 Seeding Demo Interviews...");

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const demoInterviews = [
    // 1. Completed AI Interview with full scorecard
    {
      role: "Senior Full Stack Engineer",
      type: "AI",
      level: "Senior",
      techstack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      questions: [
        "How do you design a database indexing strategy for high-concurrency read-heavy workloads?",
        "Explain React Server Components vs client-side hydration under the hood.",
        "How would you prevent and debug memory leaks in long-running Node.js processes?",
        "Describe your approach to implementing distributed idempotency across microservices.",
      ],
      finalized: true,
      coverImage: "",
      date: now,
      time: "11:00 AM",
      duration: 45,
      status: "COMPLETED",
      score: 88,
      feedback: {
        totalScore: 88,
        categoryScores: [
          { name: "Communication Skills", score: 90, comment: "Crisp, concise, and structured explanations." },
          { name: "Technical Knowledge", score: 88, comment: "Strong command of RSC and database internals." },
          { name: "Problem-Solving", score: 85, comment: "Good methodical troubleshooting approach." },
          { name: "Cultural & Role Fit", score: 92, comment: "Demonstrates senior ownership and leadership values." },
          { name: "Confidence & Clarity", score: 87, comment: "Calm and articulate under follow-up questions." },
        ],
        strengths: ["Strong systems architectural intuition", "Clear communication", "Practical trade-off analysis"],
        areasForImprovement: ["Provide more concrete metrics when describing past project impacts"],
        finalAssessment: "Strong Senior candidate recommended for next stage.",
      },
      userId: createdUsers[0].id,
      mentorId: null,
    },

    // 2. Scheduled Human Mentor Interview (Accepted, upcoming)
    {
      role: "Machine Learning Specialist",
      type: "HUMAN",
      level: "Mid-level",
      techstack: ["Python", "PyTorch", "HuggingFace", "Vector DBs"],
      questions: [
        "Walk me through fine-tuning a transformer model for domain-specific Q&A.",
        "How do you evaluate hallucination rates in RAG pipelines?",
      ],
      finalized: true,
      coverImage: null,
      date: tomorrow,
      time: "10:00 AM",
      duration: 60,
      status: "ACCEPTED",
      userId: createdUsers[0].id,
      mentorId: createdMentors[0].id, // Dr. Priya Patel
    },

    // 3. Pending Human Mentor Interview
    {
      role: "Frontend Architect",
      type: "HUMAN",
      level: "Staff",
      techstack: ["Next.js", "Web Performance", "Design Systems"],
      questions: [],
      finalized: false,
      coverImage: null,
      date: nextWeek,
      time: "03:00 PM",
      duration: 60,
      status: "PENDING",
      userId: createdUsers[1].id,
      mentorId: createdMentors[2].id, // Elena Rostova
    },

    // 4. Completed Human Mentor Interview
    {
      role: "Cloud Platform Engineer",
      type: "HUMAN",
      level: "Senior",
      techstack: ["Kubernetes", "AWS", "Terraform"],
      questions: [
        "Explain multi-region failover design for a stateful containerized service.",
      ],
      finalized: true,
      coverImage: null,
      date: now,
      time: "02:00 PM",
      duration: 60,
      status: "COMPLETED",
      score: 92,
      feedback: {
        totalScore: 92,
        categoryScores: [
          { name: "Technical Knowledge", score: 95, comment: "Superb depth on Kubernetes networking and CNI." },
          { name: "Problem-Solving", score: 90, comment: "Thoughtful multi-region architecture breakdown." },
          { name: "Communication Skills", score: 91, comment: "Very articulate diagrams and explanations." },
        ],
        strengths: ["Deep Kubernetes expertise", "High operational clarity"],
        areasForImprovement: ["Consider cost implications more explicitly during design trade-offs"],
        finalAssessment: "Outstanding session. Candidate demonstrated production-grade platform leadership.",
      },
      userId: createdUsers[2].id,
      mentorId: createdMentors[1].id, // Marcus Vance
    },
  ];

  for (const item of demoInterviews) {
    const interview = await prisma.interview.create({ data: item });
    console.log(`✅ Interview created: [${interview.type}] ${interview.role} (Status: ${interview.status})`);
  }

  console.log("\n=========================================");
  console.log("🎉 Seeding completed successfully!");
  console.log("=========================================");
  console.log("\nLogin Credentials Quick Reference:");
  console.log("-----------------------------------------");
  console.log("👑 Admin:      abhijeet@gmail.com        | password: 12345678");
  console.log("👤 Candidate:  alex.chen@example.com      | password: user123");
  console.log("👤 Candidate:  sarah.connor@example.com   | password: user123");
  console.log("👤 Candidate:  rahul.sharma@example.com   | password: user123");
  console.log("🧑‍🏫 Mentor:     priya.patel@example.com    | password: mentor123");
  console.log("🧑‍🏫 Mentor:     marcus.vance@example.com   | password: mentor123");
  console.log("🧑‍🏫 Mentor:     elena.rostova@example.com  | password: mentor123");
  console.log("🧑‍🏫 Mentor:     david.kim@example.com      | password: mentor123");
  console.log("-----------------------------------------\n");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
