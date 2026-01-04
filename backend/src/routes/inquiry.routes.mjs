import { Router } from "express";
import {
  handleInquiry,
  handleAdminDeleteInquiry,
  handleAdminListInquiries,
  handleAdminToggleInquiryRead,
} from "../controllers/inquiry.controller.mjs";
import { requireAdmin } from "../middleware/auth.middleware.mjs";

const router = Router();

router.post("/api/inquiry", handleInquiry);

// Admin routes for managing inquiry submissions
router.get("/api/admin/inquiries", requireAdmin, handleAdminListInquiries);
router.delete(
  "/api/admin/inquiries/:id",
  requireAdmin,
  handleAdminDeleteInquiry
);
router.put(
  "/api/admin/inquiries/:id/toggle-read",
  requireAdmin,
  handleAdminToggleInquiryRead
);

export default router;

