import express from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/requireAuth"

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const providers = await prisma.provider.findMany();
    res.json(providers);
  } catch (error) {
    console.error("GET /providers", error);
    res.status(500).json({ error: "Fehler beim Laden der Provider." });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const provider = await prisma.provider.findUnique({ where: { id } });
    if (provider) {
      res.json(provider);
    } else {
      res.status(404).json({ error: "Provider nicht gefunden." });
    }
  } catch (error) {
    console.error("GET /providers/:id", error);
    res.status(500).json({ error: "Fehler beim Laden des Providers." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { name, domain, port } = req.body;
  try {
    const provider = await prisma.provider.create({
      data: { name, domain, port }
    });
    res.status(201).json(provider);
  } catch (error) {
    console.error("POST /providers", error);
    res.status(500).json({ error: "Fehler beim Erstellen des Providers." });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, domain, port } = req.body;
  try {
    const provider = await prisma.provider.update({
      where: { id },
      data: { name, domain, port }
    });
    res.json(provider);
  } catch (error) {
    console.error("PUT /providers/:id", error);
    res.status(500).json({ error: "Fehler beim Bearbeiten des Providers." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.provider.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    console.error("DELETE /providers/:id", error);
    if (error.code === 'P2003') {
      res.status(409).json({ error: "Provider ist noch mit Accounts verknüpft und kann nicht gelöscht werden." });
    } else {
      res.status(500).json({ error: "Fehler beim Löschen des Providers." });
    }
  }
});

export default router;
