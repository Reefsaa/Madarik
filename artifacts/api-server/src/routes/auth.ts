import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const authRouter = Router();

// ─── Validation helpers ───────────────────────────────────────────────────────
const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_RE   = /^5\d{8}$/;
const NATID_RE    = /^\d{10,}$/;
const USERNAME_RE = /^[a-zA-Z0-9_]+$/;

function validatePassword(pw: string): string | null {
  if (!pw || pw.length < 8)           return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(pw))             return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(pw))             return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(pw))             return "Password must contain at least one number";
  if (!/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?`~]/.test(pw))
                                      return "Password must contain at least one special character";
  return null;
}

function fieldErr(res: any, status: number, field: string, error: string) {
  res.status(status).json({ field, error });
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────
authRouter.post("/auth/register", async (req, res) => {
  const {
    email      = "",
    password   = "",
    name       = "",
    username   = "",
    company    = "",
    crNumber   = "",
    nationalId = "",
    mobile     = "",
    mode       = "business",
  } = req.body as Record<string, string>;

  // ── Required base fields ──────────────────────────────────────────────────
  if (!email.trim() || !password || !name.trim()) {
    res.status(400).json({ error: "email, password, and name are required" });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normUsername    = username.trim();
  const normNationalId  = nationalId.trim();
  const normMobile      = mobile.trim();

  // ── Email ─────────────────────────────────────────────────────────────────
  if (!EMAIL_RE.test(normalizedEmail)) {
    fieldErr(res, 400, "email", "Please enter a valid email address with a domain"); return;
  }

  // ── National ID (when provided) ───────────────────────────────────────────
  if (normNationalId) {
    if (!/^\d+$/.test(normNationalId)) {
      fieldErr(res, 400, "nationalId", "National ID must contain digits only"); return;
    }
    if (!NATID_RE.test(normNationalId)) {
      fieldErr(res, 400, "nationalId", "National ID must be at least 10 digits"); return;
    }
  }

  // ── Mobile (when provided) ────────────────────────────────────────────────
  if (normMobile) {
    if (!/^\d+$/.test(normMobile)) {
      fieldErr(res, 400, "mobile", "Mobile must contain digits only"); return;
    }
    if (!MOBILE_RE.test(normMobile)) {
      fieldErr(res, 400, "mobile", "Mobile number must be exactly 9 digits and start with 5"); return;
    }
  }

  // ── Username (when provided) ──────────────────────────────────────────────
  if (normUsername && !USERNAME_RE.test(normUsername)) {
    fieldErr(res, 400, "username", "Username can only contain letters, numbers and underscores"); return;
  }

  // ── Password ──────────────────────────────────────────────────────────────
  const pwErr = validatePassword(password);
  if (pwErr) { fieldErr(res, 400, "password", pwErr); return; }

  // ── Uniqueness checks ─────────────────────────────────────────────────────
  try {
    const existEmail = await db.select({ id: usersTable.id }).from(usersTable)
      .where(eq(usersTable.email, normalizedEmail)).limit(1);
    if (existEmail.length > 0) {
      fieldErr(res, 409, "email", "This email is already registered"); return;
    }

    if (normUsername) {
      const existUser = await db.select({ id: usersTable.id }).from(usersTable)
        .where(eq(usersTable.username, normUsername)).limit(1);
      if (existUser.length > 0) {
        fieldErr(res, 409, "username", "This username is already taken"); return;
      }
    }

    if (normNationalId) {
      const existNid = await db.select({ id: usersTable.id }).from(usersTable)
        .where(eq(usersTable.nationalId, normNationalId)).limit(1);
      if (existNid.length > 0) {
        fieldErr(res, 409, "nationalId", "This National ID is already registered"); return;
      }
    }

    if (normMobile) {
      const existMob = await db.select({ id: usersTable.id }).from(usersTable)
        .where(eq(usersTable.mobile, normMobile)).limit(1);
      if (existMob.length > 0) {
        fieldErr(res, 409, "mobile", "This mobile number is already registered"); return;
      }
    }

    // ── Insert ───────────────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(usersTable)
      .values({
        email:      normalizedEmail,
        passwordHash,
        name:       name.trim(),
        username:   normUsername || null,
        company:    company.trim(),
        crNumber:   crNumber.trim(),
        nationalId: normNationalId,
        mobile:     normMobile,
        mode,
      })
      .returning({
        id:      usersTable.id,
        email:   usersTable.email,
        name:    usersTable.name,
        company: usersTable.company,
        mode:    usersTable.mode,
      });

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
    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim())).limit(1);
    if (!user) { res.status(401).json({ error: "Invalid email or password" }); return; }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) { res.status(401).json({ error: "Invalid email or password" }); return; }

    logger.info({ userId: user.id, email: user.email }, "User logged in");
    res.json({
      user: {
        id: user.id, email: user.email, name: user.name,
        company: user.company, mobile: user.mobile,
        nationalId: user.nationalId, mode: user.mode,
      },
    });
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
    const [user] = await db.select({ id: usersTable.id }).from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim())).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const updates: Record<string, string> = {};
    if (name       !== undefined) updates.name       = name.trim();
    if (company    !== undefined) updates.company    = company.trim();
    if (mobile     !== undefined) updates.mobile     = mobile.trim();
    if (nationalId !== undefined) updates.nationalId = nationalId.trim();

    if (Object.keys(updates).length > 0) {
      await db.update(usersTable).set(updates as any)
        .where(eq(usersTable.email, email.toLowerCase().trim()));
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

  const pwErr = validatePassword(newPassword);
  if (pwErr) { res.status(400).json({ field: "newPassword", error: pwErr }); return; }

  try {
    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase().trim())).limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) { res.status(401).json({ field: "currentPassword", error: "Current password is incorrect" }); return; }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({ passwordHash: newHash })
      .where(eq(usersTable.email, email.toLowerCase().trim()));

    logger.info({ userId: user.id }, "Password changed");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Password change error");
    res.status(500).json({ error: "Password change failed. Please try again." });
  }
});

export default authRouter;
