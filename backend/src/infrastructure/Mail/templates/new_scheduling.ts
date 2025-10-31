export const newSchedulingTemplate = (scheduling: any) => {
    return `
        <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirme seu Agendamento - LifeCare</title>
    <style>
        /* Reset CSS para compatibilidade entre clientes de email */
        body, table, td, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333333;
        }
        .email-container {
            width: 100%;
            background-color: #f8f9fa;
        }
        .email-content {
            background-color: #ffffff;
            margin: 20px auto;
            width: 100%;
            max-width: 600px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .email-header {
            background: linear-gradient(135deg, #1a7db7 0%, #2aa9b9 100%);
            padding: 25px;
            text-align: center;
        }
        .email-body {
            padding: 30px;
            line-height: 1.6;
        }
        .email-footer {
            background-color: #f0f7fb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #5a6d7e;
        }
        .button {
            display: inline-block;
            padding: 14px 30px;
            background-color: #1a7db7;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .button-confirm {
            background-color: #28a745;
        }
        .button-cancel {
            background-color: #dc3545;
        }
        .appointment-details {
            background-color: #f0f7fb;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .appointment-details h3 {
            color: #1a7db7;
            margin-top: 0;
        }
        .urgent-alert {
            background-color: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .contact-info {
            background-color: #e8f5f7;
            border-left: 4px solid #2aa9b9;
            padding: 15px;
            margin: 20px 0;
        }
        .logo {
            color: white;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-style: italic;
            margin-top: 5px;
        }
        .status-pending {
            display: inline-block;
            background-color: #a5f3a2ff;
            color: #856404;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
        }
        .action-buttons {
            text-align: center;
            margin: 25px 0;
        }
        @media screen and (max-width: 600px) {
            .email-body {
                padding: 20px;
            }
            .button {
                display: block;
                margin: 10px auto;
                text-align: center;
                width: 80%;
            }
        }
    </style>
</head>
<body>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="email-container" width="100%">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="email-content">
                    <!-- Cabeçalho -->
                    <tr>
                        <td class="email-header">
                            <div class="logo">LIFECARE</div>
                            <div class="tagline">Sua saúde em primeiro lugar</div>
                        </td>
                    </tr>
                    
                    <!-- Corpo do email -->
                    <tr>
                        <td class="email-body">
                            <h2 style="margin-top: 0; color: #1a7db7;">Seu agendamento foi aberto.</h2>
                            
                            <div class="status-pending">AGENDAMENTO ABERTO !</div>                    
                            <p>Olá ${scheduling.patient.name},</p>
                            <p>Identificamos que seu agendamento na <strong>LifeCare</strong> foi aberto. Estamos enviando os dados do seu agendamento em nossa clinica, lembrando que 1 dia antes da sua consulta você receberá um e-mail para que confirme o agendamento.</p>
                            
                            <div class="appointment-details">
                                <h3>📅 Detalhes do Agendamento</h3>
                                <p><strong>Paciente:</strong> ${scheduling.patient.name}<br>
                                <strong>Médico(a):</strong> Dr(a). ${scheduling.doctor.name}<br>
                                <strong>Especialidade:</strong> ${scheduling.specialty.name}<br>
                                <strong>Data:</strong> ${scheduling.date}<br>
                                <strong>Nº do Agendamento:</strong> ${scheduling.id}</p>
                            </div>

                            <div class="contact-info">
                                <p><strong>Precisa de ajuda?</strong><br>
                                Entre em contato conosco para qualquer dúvida:<br>
                                Telefone: (11) 3456-7890<br>
                                WhatsApp: (11) 98765-4321<br>
                                E-mail: agendamento@lifecare.com.br</p>
                            </div>
                            
                            <p>Atenciosamente,<br>
                            <strong>Equipe LifeCare</strong></p>
                        </td>
                    </tr>
                    
                    <!-- Rodapé -->
                    <tr>
                        <td class="email-footer">
                            <p>© 2023 LifeCare Clínica Médica. Todos os direitos reservados.</p>
                            <p>Este e-mail foi enviado automaticamente como lembrete de que o usuário possui um agendamento marcado.</p>
                            <p>
                                <a href="#" style="color: #5a6d7e;">Políticas de Privacidade</a> | 
                                <a href="#" style="color: #5a6d7e;">Termos de Uso</a> | 
                                <a href="#" style="color: #5a6d7e;">Fale Conosco</a>
                            </p>
                            <p>
                                <strong>LifeCare Clínica</strong><br>
                                Av. Médico Ramos, 1234, Saúde<br>
                                São Paulo - SP, 04038-000
                            </p>
                            <p>
                                <a href="#" style="color: #5a6d7e;">Cancelar inscrição</a> | 
                                <a href="#" style="color: #5a6d7e;">Preferências de e-mail</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `
}