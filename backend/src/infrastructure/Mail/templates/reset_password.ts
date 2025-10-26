export const resetPasswordHTML = (user: any) => {
    return `
        <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sua Nova Senha - LifeCare</title>
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
        .password-box {
            background-color: #f0f7fb;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
            border: 2px dashed #1a7db7;
        }
        .password {
            font-size: 24px;
            font-weight: bold;
            color: #1a7db7;
            letter-spacing: 2px;
            padding: 10px;
            background-color: white;
            border-radius: 5px;
            margin: 15px 0;
            display: inline-block;
            min-width: 200px;
        }
        .security-alert {
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
            .password {
                font-size: 20px;
                min-width: 150px;
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
                            <h2 style="margin-top: 0; color: #1a7db7;">Sua Nova Senha</h2>
                            
                            <div class="security-alert">
                                <h3 style="color: #856404; margin-top: 0;">🔒 Segurança da Conta</h3>
                                <p style="margin: 0; font-weight: bold;">Sua senha foi redefinida com sucesso. Recomendamos que você altere esta senha após o primeiro acesso.</p>
                            </div>
                            
                            <p>Olá ${user.username},</p>
                            <p>Recebemos uma solicitação para redefinir sua senha na <strong>LifeCare</strong>. Sua nova senha foi gerada com sucesso e está disponível abaixo.</p>
                            
                            <div class="password-box">
                                <h3 style="color: #1a7db7; margin-top: 0;">Sua Nova Senha</h3>
                                <div class="password">${user.password}</div>
                                <p style="margin: 0; font-size: 14px;">Use esta senha para acessar sua conta</p>
                            </div>

                            <div class="action-buttons">
                                <a href="https://saas-system-clinic-les.vercel/app" class="button">Acessar Minha Conta</a>
                            </div>
                            
                            <div class="security-alert">
                                <h4 style="color: #856404; margin-top: 0;">📝 Recomendações de Segurança</h4>
                                <ul style="text-align: left; margin: 10px 0; padding-left: 20px;">
                                    <li>Altere sua senha após o primeiro acesso</li>
                                    <li>Use uma senha forte com letras, números e símbolos</li>
                                    <li>Não compartilhe sua senha com ninguém</li>
                                    <li>Certifique-se de sair da sua conta após o uso em dispositivos compartilhados</li>
                                </ul>
                            </div>
                            
                            <div class="contact-info">
                                <p><strong>Precisa de ajuda?</strong><br>
                                Entre em contato conosco para qualquer dúvida:<br>
                                Telefone: (11) 3456-7890<br>
                                WhatsApp: (11) 98765-4321<br>
                                E-mail: suporte@lifecare.com.br</p>
                            </div>
                            
                            <p>Atenciosamente,<br>
                            <strong>Equipe LifeCare</strong></p>
                        </td>
                    </tr>
                    
                    <!-- Rodapé -->
                    <tr>
                        <td class="email-footer">
                            <p>© 2023 LifeCare Clínica Médica. Todos os direitos reservados.</p>
                            <p>Este e-mail foi enviado automaticamente como parte do processo de redefinição de senha.</p>
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
</html>   `
}