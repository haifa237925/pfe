const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(options) {
    try {
      const { to, subject, text, html } = options;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Template methods for specific email types
  async sendReportNotification(adminEmail, reportData) {
    const subject = `Nouveau signalement - ${reportData.type}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f56565;">Nouveau signalement reçu</h2>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Type:</strong> ${reportData.type}</p>
          <p><strong>Raison:</strong> ${reportData.reason}</p>
          <p><strong>Gravité:</strong> ${reportData.severity}</p>
          <p><strong>Signalé par:</strong> ${reportData.reporterEmail}</p>
          <p><strong>Date:</strong> ${new Date(reportData.createdAt).toLocaleString('fr-FR')}</p>
        </div>

        ${reportData.description ? `
          <div style="margin: 20px 0;">
            <h3>Description détaillée:</h3>
            <p style="background: #edf2f7; padding: 15px; border-radius: 4px; font-style: italic;">
              ${reportData.description}
            </p>
          </div>
        ` : ''}

        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/admin/moderation" 
             style="background: #4299e1; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Gérer le signalement
          </a>
        </div>

        <hr style="border: none; height: 1px; background: #e2e8f0; margin: 30px 0;">
        
        <p style="color: #718096; font-size: 14px;">
          Ceci est une notification automatique du système de modération.
          <br>
          Plateforme de livres numériques
        </p>
      </div>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject,
      html
    });
  }

  async sendReportResolution(userEmail, reportData, resolution) {
    const isResolved = resolution.status === 'resolved';
    const subject = `Mise à jour de votre signalement - ${isResolved ? 'Résolu' : 'Rejeté'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${isResolved ? '#48bb78' : '#f56565'};">
          Votre signalement a été ${isResolved ? 'résolu' : 'rejeté'}
        </h2>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Type de signalement:</strong> ${reportData.type}</p>
          <p><strong>Votre raison:</strong> ${reportData.reason}</p>
          <p><strong>Date du signalement:</strong> ${new Date(reportData.createdAt).toLocaleString('fr-FR')}</p>
          <p><strong>Statut:</strong> <span style="color: ${isResolved ? '#48bb78' : '#f56565'}; font-weight: bold;">
            ${isResolved ? 'Résolu' : 'Rejeté'}
          </span></p>
        </div>

        ${resolution.notes ? `
          <div style="margin: 20px 0;">
            <h3>Note de l'équipe de modération:</h3>
            <p style="background: #edf2f7; padding: 15px; border-radius: 4px; font-style: italic;">
              ${resolution.notes}
            </p>
          </div>
        ` : ''}

        <div style="margin: 30px 0;">
          <p style="color: #4a5568;">
            ${isResolved 
              ? 'Merci d\'avoir signalé ce contenu. Grâce à votre vigilance, nous pouvons maintenir une communauté sûre et respectueuse.' 
              : 'Après examen, nous avons déterminé que ce contenu ne viole pas nos conditions d\'utilisation. Si vous avez des questions, n\'hésitez pas à nous contacter.'
            }
          </p>
        </div>

        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/dashboard" 
             style="background: #4299e1; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Retour au tableau de bord
          </a>
        </div>

        <hr style="border: none; height: 1px; background: #e2e8f0; margin: 30px 0;">
        
        <p style="color: #718096; font-size: 14px;">
          Si vous avez des questions concernant cette décision, vous pouvez nous contacter à 
          <a href="mailto:support@ebookplatform.com">support@ebookplatform.com</a>
          <br><br>
          Équipe de modération - Plateforme de livres numériques
        </p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html
    });
  }

  async sendUserSuspensionNotice(userEmail, userName, reason, duration) {
    const subject = 'Suspension temporaire de votre compte';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f56565;">Suspension de compte</h2>
        
        <p>Bonjour ${userName},</p>
        
        <div style="background: #fed7d7; border-left: 4px solid #f56565; padding: 20px; margin: 20px 0;">
          <p><strong>Votre compte a été temporairement suspendu</strong></p>
          <p><strong>Durée:</strong> ${duration}</p>
          <p><strong>Raison:</strong> ${reason}</p>
        </div>

        <div style="margin: 30px 0;">
          <p style="color: #4a5568;">
            Pendant cette période, vous ne pourrez pas accéder à votre compte ni utiliser nos services. 
            Cette mesure a été prise pour maintenir un environnement sûr pour tous nos utilisateurs.
          </p>
        </div>

        <div style="background: #e6fffa; border-left: 4px solid #38b2ac; padding: 20px; margin: 20px 0;">
          <h3 style="color: #2d3748; margin-top: 0;">Pour contester cette décision:</h3>
          <ul style="color: #4a5568;">
            <li>Contactez notre équipe support à support@ebookplatform.com</li>
            <li>Incluez votre nom d'utilisateur et une explication détaillée</li>
            <li>Nous examinerons votre demande sous 48h ouvrables</li>
          </ul>
        </div>

        <hr style="border: none; height: 1px; background: #e2e8f0; margin: 30px 0;">
        
        <p style="color: #718796; font-size: 14px;">
          Équipe de modération - Plateforme de livres numériques
        </p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html
    });
  }

  async sendPublisherApproval(userEmail, userName) {
    const subject = 'Félicitations ! Votre demande d\'éditeur a été approuvée';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #48bb78;">Demande d'éditeur approuvée !</h2>
        
        <p>Bonjour ${userName},</p>
        
        <div style="background: #f0fff4; border-left: 4px solid #48bb78; padding: 20px; margin: 20px 0;">
          <p><strong>🎉 Excellente nouvelle !</strong></p>
          <p>Votre demande pour devenir éditeur sur notre plateforme a été approuvée. 
             Vous pouvez maintenant publier vos livres et commencer votre aventure d'auteur.</p>
        </div>

        <div style="margin: 30px 0;">
          <h3>Vos nouvelles possibilités :</h3>
          <ul style="color: #4a5568; line-height: 1.6;">
            <li>📚 Publier des livres numériques et audio</li>
            <li>💰 Gérer vos revenus et statistiques de ventes</li>
            <li>📊 Accéder aux analytics détaillés</li>
            <li>✍️ Interagir avec vos lecteurs</li>
          </ul>
        </div>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.CLIENT_URL}/writer/upload" 
             style="background: #48bb78; color: white; padding: 15px 30px; 
                    text-decoration: none; border-radius: 8px; display: inline-block; 
                    font-weight: bold;">
            Publier mon premier livre
          </a>
        </div>

        <div style="background: #edf2f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3748; margin-top: 0;">Prochaines étapes :</h3>
          <ol style="color: #4a5568; line-height: 1.6;">
            <li>Connectez-vous à votre tableau de bord auteur</li>
            <li>Complétez votre profil public</li>
            <li>Téléchargez votre premier livre</li>
            <li>Configurez votre méthode de paiement</li>
          </ol>
        </div>

        <hr style="border: none; height: 1px; background: #e2e8f0; margin: 30px 0;">
        
        <p style="color: #718096; font-size: 14px;">
          Bienvenue dans la communauté des auteurs !<br>
          Équipe Plateforme de livres numériques
        </p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html
    });
  }
}

module.exports = new EmailService();