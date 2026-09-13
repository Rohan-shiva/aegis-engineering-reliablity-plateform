export class DatabaseClient {
  private static instance: any = null;
  private static isConnected = false;

  public static getClient(): any {
    if (!DatabaseClient.instance && process.env.DATABASE_URL) {
      try {
        // Dynamically require PrismaClient if installed and DATABASE_URL is present
        const { PrismaClient } = require("@prisma/client");
        DatabaseClient.instance = new PrismaClient({
          log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        });
        DatabaseClient.isConnected = true;
        console.log("[Aegis DB] Initialized Prisma Client connection.");
      } catch (err) {
        console.info("[Aegis DB] PrismaClient not initialized. Running in memory repository fallback mode.");
        DatabaseClient.instance = null;
        DatabaseClient.isConnected = false;
      }
    }
    return DatabaseClient.instance;
  }

  public static isDbAvailable(): boolean {
    return DatabaseClient.isConnected && Boolean(process.env.DATABASE_URL);
  }
}

export const db = DatabaseClient.getClient();
