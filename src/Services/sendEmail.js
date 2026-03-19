import { sendEmail } from '../Services/nodemailer';

export async function sendEmailToUser(newUser) {

    await sendEmail(
        newUser.email,
        "Welcome to Our YouTube Backend Platform 🎉",
        "",
        `
  <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
    
    <h2>Welcome, ${newUser.channelName}! 🚀</h2>

    <p>
      We’re thrilled to have you join our platform. Your account has been successfully created,
      and you are now part of our growing community.
    </p>

    <p>
      Our goal is to provide a powerful backend system that helps creators and developers
      manage their YouTube-related workflows efficiently. We hope this platform helps you
      build, experiment, and grow your projects with ease.
    </p>

    <p>
      If you have any questions, suggestions, or need assistance, feel free to reach out to our team.
      We are always happy to help.
    </p>

    <p>
      Once again, welcome aboard! We’re excited to see what you build with our platform.
    </p>

    <br/>

    <p>
      Best regards,<br/>
      <strong>The YouTube Backend Team</strong>
    </p>

  </div>
  `
    );
}
