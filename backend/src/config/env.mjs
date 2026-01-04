export const PORT = process.env.PORT || 4000;

export const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const MONGODB_URI =
  process.env.MONGODB_URI;

export const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

export const EMAIL_FROM =
  process.env.EMAIL_FROM || process.env.SMTP_USER;

export const EMAIL_TO = process.env.EMAIL_TO;
// Cloudinary Configuration
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const GROQ_API_KEY = process.env.GROQ_API_KEY;
