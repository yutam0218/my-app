import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// Prisma 7 のお作法で DB に接続するぞ
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

async function main() {
  // ユーザーを 1 件追加して、一覧を取得するぞ
  await prisma.user.create({
    data: { name: `ユーザー ${new Date().toLocaleTimeString()}` },
  });
  const users = await prisma.user.findMany();
  console.log("DBの中身:", users);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => Promise.all([prisma.$disconnect(), pool.end()]));
