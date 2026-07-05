import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // 1. Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 2. SMTP Setup
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const receiver = process.env.CONTACT_RECEIVER_EMAIL || "kaprachir23@gmail.com";

    if (!host || !port || !user || !pass) {
      console.error("Missing SMTP environment configuration.");
      return NextResponse.json(
        { error: "Server mailer configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: parseInt(port, 10) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    // 3. Mail Options
    const mailOptions = {
      from: `"${name}" <${user}>`, // Sender address must match SMTP user on some hosts like Gmail
      to: receiver,
      replyTo: email, // Direct replies will go to the sender's actual email
      subject: `Portfolio Contact Form: Message from ${name}`,
      text: `You received a new message from your portfolio website contact form.\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #fafafa;">
          <h2 style="color: #7c3aed; margin-top: 0;">New Portfolio Message</h2>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-left: 4px solid #00d4ff; border-radius: 4px; white-space: pre-wrap;">
            <strong>Message:</strong><br/>
            ${message.replace(/\n/g, "<br/>")}
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 10px;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Sent via Portfolio Website Contact System</p>
        </div>
      `,
    };

    // 4. Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email via Nodemailer:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
