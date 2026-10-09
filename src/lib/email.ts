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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://okiki-store.vercel.app";

export async function sendQuoteNotificationEmail(
  toEmails: string[],
  customerDetails: { name: string; phone: string; businessName: string | null; message: string | null; receiptUrl?: string | null },
  items: { name: string; qty: number }[],
  quoteId: number
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials not configured. Skipping email notification.");
    return;
  }

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;">${item.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:center;">${item.qty}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>New Quote Request</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header with logo -->
          <tr>
            <td style="background:#0a1628;padding:24px 32px;text-align:center;">
              <img
                src="${APP_URL}/brand/logo.jpg"
                alt="OKIKI Electronics Store"
                width="100"
                style="height:auto;display:inline-block;border-radius:8px;"
              />
              <p style="color:#c9a84c;font-size:13px;margin:8px 0 0;letter-spacing:1px;text-transform:uppercase;">Admin Notification</p>
            </td>
          </tr>

          <!-- Alert banner -->
          <tr>
            <td style="background:#c9a84c;padding:12px 32px;text-align:center;">
              <p style="margin:0;color:#0a1628;font-weight:bold;font-size:15px;">ðŸ›’ New Quote Request â€” #${quoteId}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 24px;font-size:15px;color:#444;">A new quote request has been submitted on the OKIKI Store website.</p>

              <!-- Customer details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="background:#f8f8fa;padding:10px 16px;font-size:12px;font-weight:bold;color:#888;letter-spacing:0.5px;text-transform:uppercase;">Customer Details</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:14px;color:#888;border-top:1px solid #f0f0f0;width:35%;">Name</td>
                  <td style="padding:10px 16px;font-size:14px;color:#222;border-top:1px solid #f0f0f0;font-weight:600;">${customerDetails.name}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;font-size:14px;color:#888;border-top:1px solid #f0f0f0;">Phone</td>
                  <td style="padding:10px 16px;font-size:14px;color:#222;border-top:1px solid #f0f0f0;font-weight:600;">${customerDetails.phone}</td>
                </tr>
                ${customerDetails.businessName ? `
                <tr>
                  <td style="padding:10px 16px;font-size:14px;color:#888;border-top:1px solid #f0f0f0;">Business</td>
                  <td style="padding:10px 16px;font-size:14px;color:#222;border-top:1px solid #f0f0f0;">${customerDetails.businessName}</td>
                </tr>` : ""}
                ${customerDetails.message ? `
                <tr>
                  <td style="padding:10px 16px;font-size:14px;color:#888;border-top:1px solid #f0f0f0;vertical-align:top;">Message</td>
                  <td style="padding:10px 16px;font-size:14px;color:#222;border-top:1px solid #f0f0f0;">${customerDetails.message}</td>
                </tr>` : ""}
              </table>

              <!-- Items table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;border-radius:8px;overflow:hidden;margin-bottom:32px;">
                <tr>
                  <td style="background:#f8f8fa;padding:10px 12px;font-size:12px;font-weight:bold;color:#888;letter-spacing:0.5px;text-transform:uppercase;">Product</td>
                  <td style="background:#f8f8fa;padding:10px 12px;font-size:12px;font-weight:bold;color:#888;letter-spacing:0.5px;text-transform:uppercase;text-align:center;">Qty</td>
                </tr>
                ${itemsHtml}
              </table>

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${APP_URL}/admin/orders"
                  style="display:inline-block;background:#0a1628;color:#ffffff;font-weight:bold;font-size:15px;padding:14px 36px;border-radius:50px;text-decoration:none;">
                  View in Admin Dashboard
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f8fa;padding:20px 32px;text-align:center;border-top:1px solid #efefef;">
              <p style="margin:0;font-size:12px;color:#aaa;">OKIKI Electronics Store &bull; Ibadan, Nigeria</p>
              <p style="margin:4px 0 0;font-size:12px;color:#aaa;">This is an automated notification. Do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
New Quote Request (ID: #${quoteId})
A new quote request has been submitted on OKIKI Store.

Customer Details:
- Name: ${customerDetails.name}
- Phone: ${customerDetails.phone}
${customerDetails.businessName ? `- Business: ${customerDetails.businessName}` : ""}
${customerDetails.message ? `- Message: ${customerDetails.message}` : ""}

Requested Items:
${items.map((item) => `- ${item.qty}x ${item.name}`).join("\n")}

View in Admin Dashboard:
${APP_URL}/admin/orders
  `;

  await transporter.sendMail({
    from: `"OKIKI Store" <${process.env.SMTP_USER}>`,
    to: toEmails,
    subject: `ðŸ›’ New Quote Request from ${customerDetails.name} â€” #${quoteId}`,
    html,
    text,
  });
}

export async function sendOrderStatusEmail(toEmail: string, customerName: string, reference: string, status: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  const statusDisplay = status.charAt(0).toUpperCase() + status.slice(1);
  const html = `
  <div style="font-family:Arial,sans-serif;padding:20px;color:#333;">
    <h2>Order Status Update</h2>
    <p>Hello ${customerName},</p>
    <p>Your order (<strong>${reference}</strong>) status has been updated to: <strong style="color:#0a1628;">${statusDisplay}</strong>.</p>
    <p>You can track your order anytime on our <a href="${APP_URL}/my-orders">Track Order</a> page.</p>
    <p>Thank you for shopping with OKIKI Store!</p>
  </div>
  `;
  await transporter.sendMail({
    from: `"OKIKI Store" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Order ${reference} is now ${statusDisplay}`,
    html,
  });
}


