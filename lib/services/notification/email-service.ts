import nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../../prisma';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface EmailTemplateData {
  [key: string]: any;
}

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: EmailTemplateData;
  bookingId?: string;
  tenantId: string;
}

export enum EmailStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED'
}

/**
 * Email Service
 * Handles sending templated emails with delivery tracking
 */
export class EmailService {
  private transporter: nodemailer.Transporter;
  private templates: Map<string, handlebars.TemplateDelegate> = new Map();
  private config: EmailConfig;
  private defaultTenantId: string;

  constructor(config: EmailConfig, defaultTenantId: string = 'default-tenant') {
    this.config = config;
    this.defaultTenantId = defaultTenantId;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    this.loadTemplates();
  }

  /**
   * Load email templates
   */
  private loadTemplates(): void {
    const templatesDir = path.join(process.cwd(), 'lib/services/notification/templates');

    try {
      const templateFiles = fs.readdirSync(templatesDir);

      for (const file of templateFiles) {
        if (file.endsWith('.hbs')) {
          const templateName = file.replace('.hbs', '');
          const templatePath = path.join(templatesDir, file);
          const templateContent = fs.readFileSync(templatePath, 'utf-8');
          const compiledTemplate = handlebars.compile(templateContent);
          this.templates.set(templateName, compiledTemplate);
        }
      }

      console.log(`[EmailService] Loaded ${this.templates.size} email templates`);
    } catch (error) {
      console.error('[EmailService] Failed to load templates:', error);
    }
  }

  /**
   * Send templated email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const { to, subject, template, data, bookingId, tenantId } = options;

    try {
      // Get template
      const compiledTemplate = this.templates.get(template);
      if (!compiledTemplate) {
        throw new Error(`Template '${template}' not found`);
      }

      // Render HTML
      const html = compiledTemplate(data);

      // Create email log
      const emailLog = await prisma.emailLog.create({
        data: {
          tenantId,
          recipient: to,
          subject,
          template,
          bookingId,
          status: EmailStatus.PENDING,
          provider: 'smtp',
        },
      });

      // Send email
      const mailOptions = {
        from: this.config.from,
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      // Update email log
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: EmailStatus.SENT,
          messageId: info.messageId,
          sentAt: new Date(),
        },
      });

      console.log(`[EmailService] Email sent successfully to ${to}, messageId: ${info.messageId}`);
      return true;

    } catch (error) {
      console.error('[EmailService] Failed to send email:', error);

      // Update email log with error
      if (bookingId) {
        await prisma.emailLog.updateMany({
          where: {
            tenantId,
            recipient: to,
            bookingId,
            status: EmailStatus.PENDING,
          },
          data: {
            status: EmailStatus.FAILED,
            errorMessage: (error as Error).message,
          },
        });
      }

      return false;
    }
  }

  /**
   * Send booking confirmation email to guest
   */
  async sendBookingConfirmationToGuest(
    guestEmail: string,
    guestName: string,
    bookingId: string,
    bookingData: any,
    tenantId: string = this.defaultTenantId
  ): Promise<boolean> {
    const templateData = {
      guestName,
      bookingId,
      checkInDate: bookingData.checkIn.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      checkInTime: '2:00 PM', // Default check-in time
      checkOutDate: bookingData.checkOut.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      checkOutTime: '11:00 AM', // Default check-out time
      guestCount: bookingData.guests,
      totalAmount: bookingData.totalAmount.toFixed(2),
      propertyName: bookingData.propertyName,
      propertyAddress: bookingData.propertyAddress,
      propertyDescription: bookingData.propertyDescription,
      specialRequests: bookingData.specialRequests,
      hostName: bookingData.hostName,
      hostEmail: bookingData.hostEmail,
      hostPhone: bookingData.hostPhone,
      bookingUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/${bookingId}`,
    };

    return this.sendEmail({
      to: guestEmail,
      subject: `Booking Confirmed - ${bookingData.propertyName}`,
      template: 'booking-confirmation-guest',
      data: templateData,
      bookingId,
      tenantId,
    });
  }

  /**
   * Send booking confirmation email to owner
   */
  async sendBookingConfirmationToOwner(
    ownerEmail: string,
    ownerName: string,
    bookingId: string,
    bookingData: any,
    tenantId: string = this.defaultTenantId
  ): Promise<boolean> {
    const templateData = {
      hostName: ownerName,
      bookingId,
      checkInDate: bookingData.checkIn.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      checkInTime: '2:00 PM',
      checkOutDate: bookingData.checkOut.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      checkOutTime: '11:00 AM',
      guestCount: bookingData.guests,
      totalAmount: bookingData.totalAmount.toFixed(2),
      propertyName: bookingData.propertyName,
      propertyAddress: bookingData.propertyAddress,
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
      guestPhone: bookingData.guestPhone,
      specialRequests: bookingData.specialRequests,
      bookingManagementUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/bookings/${bookingId}`,
    };

    return this.sendEmail({
      to: ownerEmail,
      subject: `New Booking Confirmed - ${bookingData.propertyName}`,
      template: 'booking-confirmation-owner',
      data: templateData,
      bookingId,
      tenantId,
    });
  }

  /**
   * Get email delivery status
   */
  async getEmailStatus(emailLogId: string): Promise<any> {
    const emailLog = await prisma.emailLog.findUnique({
      where: { id: emailLogId },
    });

    return emailLog;
  }

  /**
   * Get email logs for a booking
   */
  async getBookingEmailLogs(bookingId: string): Promise<any[]> {
    const emailLogs = await prisma.emailLog.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });

    return emailLogs;
  }

  /**
   * Retry failed emails
   */
  async retryFailedEmails(maxRetries: number = 3): Promise<void> {
    const failedEmails = await prisma.emailLog.findMany({
      where: {
        status: EmailStatus.FAILED,
        retryCount: { lt: maxRetries },
      },
      take: 10, // Process in batches
    });

    for (const emailLog of failedEmails) {
      // Note: In a real implementation, you'd need to reconstruct the email data
      // For now, just mark as retried
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          retryCount: { increment: 1 },
          status: EmailStatus.PENDING,
        },
      });

      console.log(`[EmailService] Retrying email ${emailLog.id} (attempt ${emailLog.retryCount + 1})`);
    }
  }
}