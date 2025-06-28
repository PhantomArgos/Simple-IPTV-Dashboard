import express from "express";
import { PrismaClient } from "@prisma/client";
import { fetchAccountStatus } from "../utils/xtreamApi";
import { decrypt, encrypt } from '../utils/encryption'
import { requireAuth } from "../middleware/requireAuth"

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const accounts = await prisma.account.findMany({ include: { provider: true } });

  const enriched = await Promise.all(accounts.map(async (account) => {
    const live = await fetchAccountStatus(account);
    account.password = decrypt(account.password);

    if (live.expirationDate && account.expirationDate.getTime() !== live.expirationDate.getTime()) {
      await prisma.account.update({
        where: { id: account.id },
        data: { expirationDate: live.expirationDate }
      });
    }

    return {
      ...account,
      status: live.status,
      activeConnections: live.activeConnections,
      maxConnections: live.maxConnections
    };
  }));

  res.json(enriched);
});


router.get("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const account = await prisma.account.findUnique({ where: { id } });
    if (account) {
      account.password = decrypt(account.password)
      res.json(account);
    } else {
      res.status(404).json({ error: "Account nicht gefunden." });
    }
  } catch (error) {
    console.error("GET /accounts/:id", error);
    res.status(500).json({ error: "Fehler beim Laden des Accounts." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { providerId, user, userDescription, password, expirationDate, reseller } = req.body;
  const encryptedPassword = encrypt(password)
  try {
    const account = await prisma.account.create({
      data: {
        providerId: parseInt(providerId),
        user,
        userDescription,
        password: encryptedPassword,
        expirationDate: new Date(expirationDate),
        reseller
      }
    });
    res.status(201).json(account);
  } catch (error) {
    console.error("POST /accounts", error);
    res.status(500).json({ error: "Fehler beim Erstellen des Accounts." });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const { user, userDescription, password, expirationDate, reseller } = req.body;
  const encryptedPassword = encrypt(password)
  try {
    const account = await prisma.account.update({
      where: { id },
      data: {
        user,
        userDescription,
        password: encryptedPassword,
        expirationDate: new Date(expirationDate),
        reseller
      }
    });
    res.json(account);
  } catch (error) {
    console.error("PUT /accounts/:id", error);
    res.status(500).json({ error: "Fehler beim Bearbeiten des Accounts." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.account.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("DELETE /accounts/:id", error);
    res.status(500).json({ error: "Fehler beim Löschen des Accounts." });
  }
});

export default router;
