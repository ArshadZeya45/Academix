import { env } from "../config/env.js";
import { transporter } from "../config/mail.config.js";
export const sendVerificationEmail = async (email, rawToken) => {
  const verificationUrl = `${env.frontendUrl}/auth/verify-email?token=${rawToken}`;
  await transporter.sendMail({
    from: `Academix Team <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",

    html: `
         <div style="font-family: Arial;">
        <h2>Verify Your Email</h2>
        <p>This link expires in 3 minutes.</p>
        <a href="${verificationUrl}"
          style="background:#4CAF50;color:white;padding:12px 20px;
                 text-decoration:none;border-radius:5px;">
          Verify Your Email
        </a>
      </div>
        `,
  });
};
