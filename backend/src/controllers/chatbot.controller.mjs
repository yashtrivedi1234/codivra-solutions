import Groq from "groq-sdk";
import { getDb } from "../db/mongo.mjs";

// Lazy initialization of Groq client
let groq = null;

function getGroqClient() {
  if (!groq && process.env.GROQ_API_KEY) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

// Build context from website content
async function buildContext() {
  try {
    const db = await getDb();
    
    const [services, blog, portfolio, team] = await Promise.all([
      db.collection("services").find({}).sort({ created_at: -1 }).toArray(),
      db.collection("blog_posts").find({}).sort({ created_at: -1 }).limit(10).toArray(),
      db.collection("portfolio_items").find({}).sort({ created_at: -1 }).limit(10).toArray(),
      db.collection("team_members").find({}).toArray(),
    ]);

    let context = `You are a helpful assistant for Codivra, a technology solutions company. Answer questions based on the following information about the company:\n\n`;

    // Services context
    if (services && services.length > 0) {
      context += `SERVICES:\n`;
      services.forEach((service, idx) => {
        context += `${idx + 1}. ${service.title}${service.description ? ` - ${service.description}` : ""}\n`;
      });
      context += `\n`;
    }

    // Blog context
    if (blog && blog.length > 0) {
      context += `BLOG POSTS:\n`;
      blog.slice(0, 10).forEach((post, idx) => {
        context += `${idx + 1}. ${post.title}${post.category ? ` (${post.category})` : ""}${post.content ? ` - ${post.content.substring(0, 200)}...` : ""}\n`;
      });
      context += `\n`;
    }

    // Portfolio context
    if (portfolio && portfolio.length > 0) {
      context += `PORTFOLIO PROJECTS:\n`;
      portfolio.slice(0, 10).forEach((project, idx) => {
        context += `${idx + 1}. ${project.title}${project.category ? ` (${project.category})` : ""}${project.description ? ` - ${project.description}` : ""}\n`;
      });
      context += `\n`;
    }

    // Team context
    if (team && team.length > 0) {
      context += `TEAM MEMBERS:\n`;
      team.forEach((member, idx) => {
        context += `${idx + 1}. ${member.name} - ${member.role}${member.bio ? ` - ${member.bio}` : ""}\n`;
      });
      context += `\n`;
    }

    // Company information
    context += `COMPANY INFORMATION:\n`;
    context += `- Email: codivrasolutions@gmail.com\n`;
    context += `- Phone: +91 9452819739\n`;
    context += `- Address: 813, Vikas Nagar Colony, Khoobpur, Sitapur\n`;
    context += `- Website: You can visit our website for more information\n`;
    context += `- Contact Form: Available at /contact\n`;
    context += `- Inquiry Form: Available at /inquiry\n\n`;

    context += `INSTRUCTIONS:\n`;
    context += `- Be friendly, professional, and helpful\n`;
    context += `- Answer questions based on the information provided above\n`;
    context += `- If you don't know something, direct users to the appropriate page or contact information\n`;
    context += `- Keep responses concise but informative\n`;
    context += `- Use the company information to help users get in touch\n`;

    return context;
  } catch (error) {
    console.error("[chatbot] Error building context:", error);
    return "You are a helpful assistant for Codivra, a technology solutions company. Answer questions about services, blog posts, portfolio, team, and contact information.";
  }
}

export async function handleChatbotMessage(req, res) {
  const { message, conversationHistory = [] } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("[chatbot] GROQ_API_KEY not configured");
    return res.status(500).json({
      error: "Chatbot service not configured",
      message: "Please contact support or try again later.",
    });
  }

  try {
    // Build context from website content
    const systemContext = await buildContext();

    // Prepare messages for Groq
    const messages = [
      {
        role: "system",
        content: systemContext,
      },
      // Add conversation history (last 10 messages to keep context manageable)
      ...conversationHistory.slice(-10).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      {
        role: "user",
        content: message.trim(),
      },
    ];

    // Get Groq client (lazy initialization)
    const groqClient = getGroqClient();
    if (!groqClient) {
      return res.status(500).json({
        error: "Chatbot service not configured",
        message: "Please contact support or try again later.",
      });
    }

    // Call Groq API
    const completion = await groqClient.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile", // Updated to current model
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    return res.json({
      success: true,
      response: response.trim(),
    });
  } catch (error) {
    console.error("[chatbot] Error:", error);
    
    // Handle specific Groq API errors
    if (error.status === 401) {
      return res.status(500).json({
        error: "Invalid API key",
        message: "Chatbot service configuration error.",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again in a moment.",
      });
    }

    return res.status(500).json({
      error: "Failed to generate response",
      message: "An error occurred while processing your message. Please try again.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export async function handleChatbotHealth(_req, res) {
  const isConfigured = !!process.env.GROQ_API_KEY;
  return res.json({
    status: "ok",
    configured: isConfigured,
  });
}

