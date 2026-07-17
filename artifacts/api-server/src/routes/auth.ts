import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const authRouter = Router();

// ─── POST /api/auth/register ─────────────────────────────────────────────────
authRouter.post("/auth/register", async (req, res) => {
  const {
    email,
    password,
    name,
    company = "",
    crNumber = "",
    nationalId = "",
    mobile = "",
    mode = "business",
  } = req.body as Record<string, string>;

  if (!email?.trim() || !password || !name?.trim()) {
    res.status(400).json({ error: "email, password, and name are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  try {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(usersTable)
      .values({ email: normalizedEmail, passwordHash, name: name.trim(), company: company.trim(), crNumber: crNumber.trim(), nationalId: nationalId.trim(), mobile: mobile.trim(), mode })
      .returning({ id: usersTable.id, email: usersTable.email, name: usersTable.name, company: usersTable.company, mode: usersTable.mode });

    logger.info({ userId: user.id, email: user.email }, "User registered");
    res.status(201).json({ user });
  } catch (err) {
    logger.error({ err }, "Register error");
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
authRouter.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email?.trim() || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim())).limit(1);
    if (!user) { res.status(401).json({ error: "Invalid email or password" }); return; }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) { res.status(401).json({ error: "Invalid email or password" }); return; }

    logger.info({ userId: user.id, email: user.email }, "User logged in");
    res.json({ user: { id: user.id, email: user.email, name: user.name, company: user.company, mobile: user.mobile, nationalId: user.nationalId, mode: user.mode } });
  } catch (err) {
    logger.error({ err }, "Login error");
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ─── PATCH /api/auth/profile ──────────────────────────────────────────────────
authRouter.patch("/auth/profile", async (req, res) => {
  const { email, name, company, mobile, nationalId } = req.body as Record<string, string>;
  if (!email?.trim()) { res.status(400).json({ error: "email is required" }); return; }

  try {
    const [user] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim())).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const updates: Record<string, string> = {};
    if (name !== undefined) updates.name = name.trim();
    if (company !== undefined) updates.company = company.trim();
    if (mobile !== undefined) updates.mobile = mobile.trim();
    if (nationalId !== undefined) updates.nationalId = nationalId.trim();

    if (Object.keys(updates).length > 0) {
      await db.update(usersTable).set(updates as any).where(eq(usersTable.email, email.toLowerCase().trim()));
    }

    logger.info({ email }, "Profile updated");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Profile update error");
    res.status(500).json({ error: "Update failed. Please try again." });
  }
});

// ─── PATCH /api/auth/password ─────────────────────────────────────────────────
authRouter.patch("/auth/password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body as Record<string, string>;
  if (!email?.trim() || !currentPassword || !newPassword) {
    res.status(400).json({ error: "email, currentPassword, and newPassword are required" });
    return;
  }
  if (newPassword.length < 6) {
    res.status(400).json({ error: "New password must be at least 6 characters" });
    return;
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim())).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) { res.status(401).json({ error: "Current password is incorrect" }); return; }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({ passwordHash: newHash }).where(eq(usersTable.email, email.toLowerCase().trim()));

    logger.info({ userId: user.id }, "Password changed");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Password change error");
    res.status(500).json({ error: "Password change failed. Please try again." });
  }
});

export default authRouter;
