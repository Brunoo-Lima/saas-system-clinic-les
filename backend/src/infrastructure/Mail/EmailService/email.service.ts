// src/services/EmailService.js
import "dotenv/config";
import nodemailer from "nodemailer";
import {generateEmail} from "../templates/welcome-user";

class EmailService {
  private transporter: any
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // Só envia true se for a porta 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendMail(userInformation: any) {
    console.log(userInformation)
    await this.transporter.sendMail({
      from: `"LifeCare" <${process.env.EMAIL_USER}>`,
      to: userInformation.email,
      subject: "Boas vindas",
      html: generateEmail()
    });
  }
}

export default new EmailService();
