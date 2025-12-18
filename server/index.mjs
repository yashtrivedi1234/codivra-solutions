import express from "express";
import cors from "cors";
import { z } from "zod";
import nodemailer from "nodemailer";

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : "*",
  })
);
app.use(express.json());

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email"),
  service: z.string().min(2, "Service is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  phone: z.string().optional(),
});

// Configure Nodemailer transporter using environment variables:
// Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (true|false),
// EMAIL_FROM, EMAIL_TO in your environment or .env file.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === "true" || false,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

transporter
  .verify()
  .then(() => {
    console.log("SMTP transporter verified");
  })
  .catch((err) => {
    console.warn(
      "SMTP transporter not verified:",
      err && err.message ? err.message : err
    );
  });

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/contact", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid input",
      issues: parsed.error.flatten(),
    });
  }

  const payload = parsed.data;

  console.log("[contact]", {
    ...payload,
    receivedAt: new Date().toISOString(),
  });

  const mailFrom =
    process.env.EMAIL_FROM || process.env.SMTP_USER || "no-reply@example.com";
  const mailTo = process.env.EMAIL_TO || "codivrasolution@gmail.com";

  const mailOptions = {
    from: mailFrom,
    to: mailTo,
    subject: `New contact request from ${payload.name} — ${payload.service}`,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${
      payload.phone || "N/A"
    }\nService: ${payload.service}\n\nMessage:\n${payload.message}`,
    html: `<p><strong>Name:</strong> ${payload.name}</p>
           <p><strong>Email:</strong> ${payload.email}</p>
           <p><strong>Phone:</strong> ${payload.phone || "N/A"}</p>
           <p><strong>Service:</strong> ${payload.service}</p>
           <p><strong>Message:</strong><br/>${payload.message.replace(
             /\n/g,
             "<br/>"
           )}</p>`,
  };

  try {
    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log("Contact email sent to", mailTo);
    }

    // small delay to simulate work / allow logging
    await new Promise((resolve) => setTimeout(resolve, 200));

    return res.json({
      status: "ok",
      message: "Message received and emailed. We'll reach out soon.",
    });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return res.status(500).json({
      status: "error",
      error: "Failed to send email",
      details: err && err.message ? err.message : String(err),
    });
  }
});

// Test endpoint to verify mail sending quickly.
// If SMTP env vars are not provided, this will use Nodemailer's
// Ethereal test account and return a preview URL.
app.get("/test-email", async (_req, res) => {
  try {
    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        process.env.SMTP_USER ||
        "no-reply@example.com",
      to:
        process.env.EMAIL_TO ||
        process.env.SMTP_USER ||
        "" ||
        "recipient@example.com",
      subject: "Test email from Codivra Launchpad",
      text: "This is a test message from the /test-email endpoint.",
      html: "<p>This is a <strong>test</strong> message from the /test-email endpoint.</p>",
    };

    // If SMTP config exists, attempt to use the existing transporter.
    const hasSmtp = !!(process.env.SMTP_HOST || process.env.SMTP_USER);

    if (hasSmtp) {
      const info = await transporter.sendMail(mailOptions);
      return res.json({ status: "ok", messageId: info.messageId });
    }

    // Fallback to Ethereal test account when no SMTP is configured.
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransporter.sendMail({
      ...mailOptions,
      from: testAccount.user,
      to: testAccount.user,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;

    return res.json({ status: "ok", previewUrl, messageId: info.messageId });
  } catch (err) {
    console.error("/test-email error:", err);
    return res
      .status(500)
      .json({
        status: "error",
        error: err && err.message ? err.message : String(err),
      });
  }
});

app.listen(port, () => {
  console.log(`Contact API listening on http://localhost:${port}`);
});
