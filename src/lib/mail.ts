import { Resend } from "resend";

export async function sendOrderEmail(to: string[], subject: string, html: string) {
  if (!process.env.RESEND_API_KEY || to.length === 0) return { skipped: true };
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: process.env.EMAIL_FROM || "Supplier Portal <noreply@example.com>",
    to,
    subject,
    html
  });
}
