import { db } from "../src/db/client";

async function main() {
  if (!db) {
    console.info("[Aegis Seed] No DATABASE_URL active. Skipping physical PostgreSQL seeding.");
    return;
  }

  console.log("[Aegis Seed] Seeding PostgreSQL database with canonical operational data...");

  // Seed Services
  await db.service.upsert({
    where: { name: "payment-checkout-svc" },
    update: {},
    create: {
      id: "svc-checkout",
      name: "payment-checkout-svc",
      description: "Core payment processing & checkout transaction orchestrator microservice",
      status: "critical",
      environment: "production",
      latencyP95Ms: 420,
      latencyP99Ms: 1250,
      uptimePercentage: 98.42,
      errorRatePercentage: 8.75,
      requestRateRps: 1420,
      ownerTeam: "Payments Engineering",
      repositoryUrl: "https://github.com/aegis-org/payment-checkout-svc",
      lastDeployedAt: new Date("2026-09-10T14:32:00Z"),
      activeIncidentsCount: 2,
      framework: "Node.js (Express)",
      runtimeEnv: "Kubernetes v1.29 (AWS EKS)",
      slaTargetPercentage: 99.9,
    },
  });

  // Seed Incident
  await db.incident.upsert({
    where: { code: "INC-8492" },
    update: {},
    create: {
      id: "inc-101",
      code: "INC-8492",
      title: "Payment Checkout 500 Spike & Connection Pool Exhaustion",
      severity: "SEV1",
      status: "investigating",
      affectedServices: ["svc-checkout", "svc-orders"],
      summary: "Elevated 500 error rates on payment checkout processing endpoint post v2.4.1 deployment.",
      impactDescription: "14.2% checkout transaction failure rate affecting ~$42,000 revenue stream per hour.",
      rootCauseHypothesis: "Connection pool exhaustion due to missing idle connection timeout settings.",
      confidenceScore: 89,
      createdAt: new Date("2026-09-10T14:35:00Z"),
      updatedAt: new Date("2026-09-10T14:52:00Z"),
      assignedToName: "Alex Rivera",
      assignedToRole: "Staff Reliability Engineer",
      assignedToInitials: "AR",
      communicationChannel: "#inc-8492-checkout-spike",
      runbookUrl: "/knowledge/kb-201",
      postmortemStatus: "pending",
    },
  });

  console.log("[Aegis Seed] Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("[Aegis Seed Error]:", e);
    process.exit(1);
  });
