import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@riskapp.com";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function sendActionCompletedEmail({
  toEmail,
  toName,
  actionTitle,
  organizationName,
  completedByName,
}: {
  toEmail: string;
  toName: string;
  actionTitle: string;
  organizationName: string;
  completedByName: string;
}) {
  if (!SENDGRID_API_KEY) {
    console.warn("SendGrid API key not configured, skipping email notification");
    return;
  }

  const msg = {
    to: toEmail,
    from: { email: FROM_EMAIL, name: "Risk App" },
    subject: `Action Item Completed: ${actionTitle}`,
    text: `Hi ${toName},\n\nThe following action item has been marked as completed:\n\n"${actionTitle}"\nOrganization: ${organizationName}\nCompleted by: ${completedByName}\n\nLog in to Risk App to review the details and any attached proof documents.\n\nBest regards,\nRisk App`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #16a34a; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">Action Item Completed</h2>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
          <p>Hi ${toName},</p>
          <p>The following action item has been marked as completed:</p>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin: 16px 0;">
            <p style="font-weight: bold; margin: 0 0 8px 0;">${actionTitle}</p>
            <p style="color: #6b7280; margin: 0 0 4px 0;">Organization: ${organizationName}</p>
            <p style="color: #6b7280; margin: 0;">Completed by: ${completedByName}</p>
          </div>
          <p>Log in to Risk App to review the details and any attached proof documents.</p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">This is an automated notification from Risk App.</p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Completion email sent to ${toEmail} for action: ${actionTitle}`);
  } catch (error: any) {
    console.error("Failed to send completion email:", error?.response?.body || error.message);
  }
}
