// src/services/EmailService.js
import "dotenv/config";
import nodemailer from "nodemailer";
import { generateEmail } from "../templates/welcome-user";
import { generateSchedulingEmail } from "../templates/scheduling_confirmation";
import { resetPasswordHTML } from "../templates/reset_password";
import { newSchedulingTemplate } from "../templates/new_scheduling";
import { schedulingCanceled } from "../templates/canceled_scheduling";

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
      let subject;
      let emails

      switch(template){
        case "welcome": 
          htmlTemplate = generateEmail(dataEMail)
          subject = "Boas vindas"
          emails = dataEMail.email;
          break

        case "scheduling": 
          htmlTemplate = generateSchedulingEmail(dataEMail)
          subject = "Confirmação de agendamento"
          emails = dataEMail.patient.email
          break;

        case "reset_password":
          htmlTemplate = resetPasswordHTML(dataEMail)
          subject = "Reset de senha"
          emails = dataEMail.email
          break;

        case "new_scheduling":
          htmlTemplate = newSchedulingTemplate(dataEMail)
          subject = "Agendamento confirmado !"
          emails = dataEMail.patient.email
          break;

        case "scheduling_canceled":
          htmlTemplate = schedulingCanceled(dataEMail)
          subject = "Agendamento Cancelado !"
          emails = dataEMail.patient.email
          break
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
