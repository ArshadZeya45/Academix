import { env } from "../config/env.js";
import { transporter } from "../config/mail.config.js";
export const sendPasswordResetEmail = async (email, rawToken) => {
  const resetPasswordUrl = `${env.frontendUrl}/auth/reset-password?token=${rawToken}`;
  await transporter.sendMail({
    from: `Academix Team <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",

    html: `
         <div style="font-family: Arial;">
        <h2>Reset your password</h2>
        <p>This link expires in 3 minutes.</p>
        <a href="${resetPasswordUrl}"
          style="background:#4CAF50;color:white;padding:12px 20px;
                 text-decoration:none;border-radius:5px;">
          Verify Your Email
        </a>
      </div>
        `,
  });
};
