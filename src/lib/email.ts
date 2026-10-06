import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendQuoteNotificationEmail(
  toEmails: string[],
  customerDetails: { name: string; phone: string; businessName: string | null; message: string | null },
  items: { name: string; qty: number }[],
  quoteId: number
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials not configured. Skipping email notification.");
    return;
  }

  const itemsHtml = items
    .map((item) => `<li><strong>${item.qty}x</strong> ${item.name}</li>`)
    .join("");

  const html = `
    <h2>New Quote Request (ID: #${quoteId})</h2>
    <p>A new quote request has been submitted on OKIKI Store.</p>
    
    <h3>Customer Details</h3>
    <ul>
      <li><strong>Name:</strong> ${customerDetails.name}</li>
      <li><strong>Phone:</strong> ${customerDetails.phone}</li>
      ${customerDetails.businessName ? `<li><strong>Business:</strong> ${customerDetails.businessName}</li>` : ""}
      ${customerDetails.message ? `<li><strong>Message:</strong> ${customerDetails.message}</li>` : ""}
    </ul>

    <h3>Requested Items</h3>
    <ul>
      ${itemsHtml}
    </ul>

    <p>Log in to the <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://okiki-store.vercel.app"}/admin/quotes">Admin Dashboard</a> to view and manage this quote.</p>
  `;

  await transporter.sendMail({
    from: `"OKIKI Store" <${process.env.SMTP_USER}>`,
    to: toEmails,
    subject: `New Quote Request from ${customerDetails.name}`,
    html,
  });
}
