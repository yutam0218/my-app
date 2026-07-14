import "dotenv/config";
import express from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter, log: ["query"] });
const app = express();
const PORT = process.env.PORT || 8888;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.render("index", { users });
});

app.post("/users", async (req, res) => {
  // 名前と年齢をリクエストから取り出すぞ
  const { name, age } = req.body;
  
  if (name) {
    await prisma.user.create({
      data: { 
        name, 
        // 年齢は数値として保存する。空なら null にするぞ
        age: age ? parseInt(age) : null 
      }
    });
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
