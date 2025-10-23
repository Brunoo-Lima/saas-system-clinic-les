export const generateSchedulingEmail = (scheduling: any) => {
    return `
        <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Agendamento - LifeCare</title>
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
        .status-confirmed {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
        }
        @media screen and (max-width: 600px) {
            .email-body {
                padding: 20px;
            }
            .button {
                display: block;
                margin: 20px auto;
                text-align: center;
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
                            <h2 style="margin-top: 0; color: #1a7db7;">Agendamento Confirmado!</h2>
                            
                            <div class="status-confirmed">✓ CONFIRMADO</div>
                            
                            <p>Olá [Nome do Paciente],</p>
                            <p>Seu agendamento na <strong>LifeCare</strong> foi confirmado com sucesso! Estamos ansiosos para atendê-lo(a).</p>
                            
                            <div class="appointment-details">
                                <h3>📅 Detalhes do Agendamento</h3>
                                <p><strong>Paciente:</strong> [Nome do Paciente]<br>
                                <strong>Médico(a):</strong> Dr(a). [Nome do Médico]<br>
                                <strong>Especialidade:</strong> [Especialidade]<br>
                                <strong>Data:</strong> [Data do Agendamento]<br>
                                <strong>Horário:</strong> [Horário do Agendamento]<br>
                                <strong>Local:</strong> [Endereço da Clínica/Unidade]<br>
                                <strong>Nº do Agendamento:</strong> [Número do Agendamento]</p>
                            </div>
                            
                            <h3 style="color: #1a7db7;">📋 Preparação para a Consulta</h3>
                            <ul>
                                <li>Chegue com 15 minutos de antecedência</li>
                                <li>Traga seu documento de identidade e carteirinha do convênio (se aplicável)</li>
                                <li>Em caso de primeira consulta, preencha o formulário online em nossa área do paciente</li>
                                <li>Liste suas dúvidas e sintomas para otimizar o tempo com o médico</li>
                            </ul>
                            
                            <div style="text-align: center;">
                                <a href="#" class="button">Acessar Minha Área do Paciente</a>
                            </div>
                            
                            <div class="contact-info">
                                <p><strong>Precisa remarcar ou cancelar?</strong><br>
                                Entre em contato conosco com pelo menos 24 horas de antecedência:<br>
                                Telefone: (11) 3456-7890<br>
                                WhatsApp: (11) 98765-4321<br>
                                E-mail: agendamento@lifecare.com.br</p>
                            </div>
                            
                            <p>Agradecemos sua confiança em nossos serviços!</p>
                            
                            <p>Atenciosamente,<br>
                            <strong>Equipe LifeCare</strong></p>
                        </td>
                    </tr>
                    
                    <!-- Rodapé -->
                    <tr>
                        <td class="email-footer">
                            <p>© 2023 LifeCare Clínica Médica. Todos os direitos reservados.</p>
                            <p>Este e-mail foi enviado automaticamente como confirmação do seu agendamento.</p>
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