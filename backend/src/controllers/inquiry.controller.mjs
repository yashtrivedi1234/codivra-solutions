import { ObjectId } from "mongodb";
import { inquirySchema } from "../validation/inquiry.schema.mjs";
import {
  sendInquiryEmail,
  sendInquiryConfirmationEmail,
} from "../services/email.service.mjs";
import { getCollection } from "../db/mongo.mjs";

export async function handleInquiry(req, res) {
  const parsed = inquirySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid input",
      issues: parsed.error.flatten(),
    });
  }

  const payload = parsed.data;

  console.log("[inquiry]", {
    ...payload,
    receivedAt: new Date().toISOString(),
  });

  try {
    // Try to send email, but do not fail the whole request if email fails
    let emailError = null;
    try {
      await sendInquiryEmail(payload);
    } catch (err) {
      emailError = err;
      console.error("[inquiry] Email send failed, but saving anyway:", err);
    }

    const collection = await getCollection("inquiry_submissions");
    const doc = {
      ...payload,
      read: false,
      created_at: new Date().toISOString(),
      email_error: emailError
        ? emailError.message || String(emailError)
        : undefined,
    };
    await collection.insertOne(doc);

    // Send confirmation email to the user (do not block response)
    sendInquiryConfirmationEmail(payload).catch((err) => {
      console.error("[inquiry] Confirmation email to user failed:", err);
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    return res.json({
      status: "ok",
      message: emailError
        ? "Inquiry received, but email notification failed. We'll still reach out."
        : "Inquiry received. We'll reach out soon. A confirmation email has been sent to you.",
    });
  } catch (err) {
    console.error("Failed to process inquiry submission:", err);
    return res.status(500).json({
      status: "error",
      error: "Failed to save submission",
      details: err && err.message ? err.message : String(err),
    });
  }
}

export async function handleAdminListInquiries(_req, res) {
  try {
    const collection = await getCollection("inquiry_submissions");
    const items = await collection.find({}).sort({ created_at: -1 }).toArray();
    return res.json({ success: true, items });
  } catch (err) {
    console.error("[admin] list inquiries error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to list inquiries" });
  }
}

export async function handleAdminDeleteInquiry(req, res) {
  const { id } = req.params;
  try {
    const collection = await getCollection("inquiry_submissions");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Inquiry not found" });
    }
    return res.json({ success: true, status: "ok" });
  } catch (err) {
    console.error("[admin] delete inquiry error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete inquiry" });
  }
}

export async function handleAdminToggleInquiryRead(req, res) {
  const { id } = req.params;
  try {
    const collection = await getCollection("inquiry_submissions");
    const inquiry = await collection.findOne({ _id: new ObjectId(id) });
    if (!inquiry) {
      return res
        .status(404)
        .json({ success: false, error: "Inquiry not found" });
    }
    const updated = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { read: !inquiry.read } },
      { returnDocument: "after" }
    );
    return res.json({ success: true, data: updated.value });
  } catch (err) {
    console.error("[admin] toggle inquiry read error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update inquiry" });
  }
}

