// src/services/EmailService.js
import "dotenv/config";
import nodemailer from "nodemailer";
import { generateEmail } from "../templates/welcome-user";
import { generateSchedulingEmail } from "../templates/scheduling_confirmation";

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

  async sendMail(dataEMail: any) {
    try {
      const { template } = dataEMail
      let htmlTemplate;
      let emails;
      let subject;

      switch(template){
        case "welcome": 
          htmlTemplate = generateEmail(dataEMail)
          emails = dataEMail.email;
          subject = "Boas vindas"

          break
        case "scheduling": 
          htmlTemplate = generateSchedulingEmail(dataEMail)
          emails = dataEMail.patient.email
          subject = "Confirmação de agendamento"
      }
      await this.transporter.sendMail({
        from: `"LifeCare" <${process.env.EMAIL_USER}>`,
        to: emails,
        subject: subject,
        html: htmlTemplate
      });
    } catch(e){
      console.log(e)
    }
  }
}

export default new EmailService();
