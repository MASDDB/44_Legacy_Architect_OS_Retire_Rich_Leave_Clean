import { supabase } from '../lib/supabase.js';

class EmailService {
  constructor() {
    this.baseUrl = `${import.meta.env?.VITE_SUPABASE_URL}/functions/v1`;
  }

  /**
   * Send email using Resend via Supabase Edge Function
   */
  async sendEmail({
    recipientEmail,
    recipientName,
    subject,
    htmlBody,
    textBody = null,
    notificationType = 'campaign_email',
    templateId = null,
    relatedEntityId = null,
    relatedEntityType = null,
    metadata = {}
  }) {
    try {
      // First, create a record in our database
      const { data: notification, error: dbError } = await supabase?.rpc('send_email_notification', {
          recipient_email_param: recipientEmail,
          recipient_name_param: recipientName,
          subject_param: subject,
          html_body_param: htmlBody,
          text_body_param: textBody,
          notification_type_param: notificationType,
          template_id_param: templateId,
          related_entity_id_param: relatedEntityId,
          related_entity_type_param: relatedEntityType,
          metadata_param: metadata
        });

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      const notificationId = notification;

      // Get the current session for authorization
      const { data: { session } } = await supabase?.auth?.getSession();
      
      // Send email via Edge Function
      const { data, error } = await supabase?.functions?.invoke('send-email', {
        body: {
          recipient_email: recipientEmail,
          recipient_name: recipientName,
          subject: subject,
          html_body: htmlBody,
          text_body: textBody,
          notification_type: notificationType,
          metadata: { ...metadata, notification_id: notificationId }
        }
      });

      if (error) {
        // Update notification status to failed
        await this.updateEmailStatus(notificationId, 'failed', error?.message);
        throw new Error(`Email sending failed: ${error.message}`);
      }

      // Update notification status to sent
      await this.updateEmailStatus(notificationId, 'sent', null, data?.message_id);

      return {
        success: true,
        notificationId,
        messageId: data?.message_id,
        ...data
      };
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  /**
   * Update email notification status
   */
  async updateEmailStatus(notificationId, status, errorMessage = null, resendMessageId = null) {
    try {
      const updateData = {
        email_status: status,
        updated_at: new Date()?.toISOString()
      };

      if (status === 'sent') {
        updateData.sent_at = new Date()?.toISOString();
      }

      if (status === 'delivered') {
        updateData.delivered_at = new Date()?.toISOString();
      }

      if (errorMessage) {
        updateData.error_message = errorMessage;
      }

      if (resendMessageId) {
        updateData.resend_message_id = resendMessageId;
      }

      const { error } = await supabase?.from('email_notifications')?.update(updateData)?.eq('id', notificationId);

      if (error) {
        console.error('Failed to update email status:', error);
      }
    } catch (error) {
      console.error('Status update error:', error);
    }
  }

  /**
   * Send appointment confirmation email
   */
  async sendAppointmentConfirmation(appointment, lead) {
    const templateData = {
      name: `${lead?.first_name} ${lead?.last_name}`,
      appointmentTitle: appointment?.title,
      appointmentDate: new Date(appointment?.scheduled_at)?.toLocaleDateString(),
      appointmentTime: new Date(appointment?.scheduled_at)?.toLocaleTimeString(),
      meetingLink: appointment?.meeting_link || '',
      description: appointment?.description || ''
    };

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Appointment Confirmed</h1>
        <p>Dear ${templateData?.name},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">${templateData?.appointmentTitle}</h3>
          <p><strong>Date:</strong> ${templateData?.appointmentDate}</p>
          <p><strong>Time:</strong> ${templateData?.appointmentTime}</p>
          ${templateData?.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${templateData?.meetingLink}">${templateData?.meetingLink}</a></p>` : ''}
          ${templateData?.description ? `<p><strong>Description:</strong> ${templateData?.description}</p>` : ''}
        </div>
        
        <p>We look forward to meeting with you!</p>
        <p>Best regards,<br>Your CRM Team</p>
      </div>
    `;

    const textBody = `
      Appointment Confirmed

      Dear ${templateData?.name},

      Your appointment has been confirmed with the following details:

      Title: ${templateData?.appointmentTitle}
      Date: ${templateData?.appointmentDate}
      Time: ${templateData?.appointmentTime}
      ${templateData?.meetingLink ? `Meeting Link: ${templateData?.meetingLink}` : ''}
      ${templateData?.description ? `Description: ${templateData?.description}` : ''}

      We look forward to meeting with you!

      Best regards,
      Your CRM Team
    `;

    return this.sendEmail({
      recipientEmail: lead?.email,
      recipientName: templateData?.name,
      subject: `Appointment Confirmed: ${templateData?.appointmentTitle}`,
      htmlBody,
      textBody,
      notificationType: 'appointment_confirmation',
      relatedEntityId: appointment?.id,
      relatedEntityType: 'appointment',
      metadata: {
        appointment_id: appointment?.id,
        lead_id: lead?.id,
        scheduled_at: appointment?.scheduled_at
      }
    });
  }

  /**
   * Send lead welcome email
   */
  async sendLeadWelcome(lead, campaign = null) {
    const templateData = {
      name: `${lead?.first_name} ${lead?.last_name}`,
      firstName: lead?.first_name,
      company: lead?.company_name || 'your company',
      source: lead?.lead_source || 'our website'
    };

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to our CRM!</h1>
        <p>Dear ${templateData?.firstName},</p>
        <p>Thank you for your interest in our services. We're excited to have you as a potential client!</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #1e40af;">What's Next?</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Our team will review your information</li>
            <li>We'll schedule a discovery call within 24 hours</li>
            <li>You'll receive a customized proposal based on your needs</li>
          </ul>
        </div>
        
        <p>If you have any immediate questions, feel free to reply to this email.</p>
        <p>Best regards,<br>Your CRM Team</p>
      </div>
    `;

    const textBody = `
      Welcome to our CRM!

      Dear ${templateData?.firstName},

      Thank you for your interest in our services. We're excited to have you as a potential client! What's Next?
      - Our team will review your information
      - We'll schedule a discovery call within 24 hours - You'll receive a customized proposal based on your needs

      If you have any immediate questions, feel free to reply to this email.

      Best regards,
      Your CRM Team
    `;

    return this.sendEmail({
      recipientEmail: lead?.email,
      recipientName: templateData?.name,
      subject: `Welcome ${templateData?.firstName} - Let's discuss your goals`,
      htmlBody,
      textBody,
      notificationType: 'lead_welcome',
      relatedEntityId: lead?.id,
      relatedEntityType: 'lead',
      metadata: {
        lead_id: lead?.id,
        campaign_id: campaign?.id,
        lead_source: lead?.lead_source,
        priority: lead?.priority
      }
    });
  }

  /**
   * Send campaign email
   */
  async sendCampaignEmail(campaign, lead, customContent = null) {
    const templateData = {
      name: `${lead?.first_name} ${lead?.last_name}`,
      firstName: lead?.first_name,
      campaignName: campaign?.name,
      content: customContent || campaign?.message_template || ''
    };

    // Replace template variables
    let processedContent = templateData?.content?.replace(/{{first_name}}/g, templateData?.firstName)?.replace(/{{name}}/g, templateData?.name)?.replace(/{{campaign_name}}/g, templateData?.campaignName);

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">${templateData?.campaignName}</h1>
        <p>Dear ${templateData?.firstName},</p>
        ${processedContent}
        <p>Best regards,<br>Your CRM Team</p>
      </div>
    `;

    const textBody = `
      ${templateData?.campaignName}

      Dear ${templateData?.firstName},

      ${processedContent?.replace(/<[^>]*>/g, '')}

      Best regards,
      Your CRM Team
    `;

    return this.sendEmail({
      recipientEmail: lead?.email,
      recipientName: templateData?.name,
      subject: templateData?.campaignName,
      htmlBody,
      textBody,
      notificationType: 'campaign_email',
      relatedEntityId: campaign?.id,
      relatedEntityType: 'campaign',
      metadata: {
        campaign_id: campaign?.id,
        lead_id: lead?.id,
        campaign_type: campaign?.campaign_type,
        campaign_status: campaign?.campaign_status
      }
    });
  }

  /**
   * Get email templates
   */
  async getEmailTemplates(templateType = null) {
    try {
      let query = supabase?.from('email_templates')?.select('*')?.eq('is_active', true)?.order('created_at', { ascending: false });

      if (templateType) {
        query = query?.eq('template_type', templateType);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch templates: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Get templates error:', error);
      throw error;
    }
  }

  /**
   * Get email notifications
   */
  async getEmailNotifications(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase?.from('email_notifications')?.select('*')?.order('created_at', { ascending: false })?.range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  /**
   * Get email preferences for current user
   */
  async getEmailPreferences() {
    try {
      const { data, error } = await supabase?.from('email_preferences')?.select('*')?.order('notification_type');

      if (error) {
        throw new Error(`Failed to fetch preferences: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Get preferences error:', error);
      throw error;
    }
  }

  /**
   * Update email preferences
   */
  async updateEmailPreferences(preferences) {
    try {
      const updates = preferences?.map(pref => ({
        user_id: pref?.user_id,
        notification_type: pref?.notification_type,
        is_enabled: pref?.is_enabled
      }));

      const { data, error } = await supabase?.from('email_preferences')?.upsert(updates, { 
          onConflict: 'user_id,notification_type',
          returning: 'minimal'
        });

      if (error) {
        throw new Error(`Failed to update preferences: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
export default emailService;