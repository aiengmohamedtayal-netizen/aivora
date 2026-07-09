import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, company, projectType, budget, phone, message } = await request.json();

    const port = Number(process.env.SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        ciphers:'SSLv3'
      }
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'aivoraaa@outlook.com',
      subject: `New Project Request from ${name || 'Aivora User'}`,
      text: `
        New Lead Submission:
        
        Name: ${name}
        Email: ${email}
        Company: ${company}
        Phone: ${phone}
        Project Type: ${projectType}
        Budget: ${budget}
        Message: ${message}
      `,
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn("SMTP credentials not provided. Email not sent.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
