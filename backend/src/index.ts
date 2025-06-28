import cors from "cors";
import express from "express";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import providersRouter from "./routes/providers";
import accountsRouter from "./routes/accounts";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not set in environment variables");
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  }),
);

app.use(authRoutes);
app.use("/providers", providersRouter);
app.use("/accounts", accountsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
