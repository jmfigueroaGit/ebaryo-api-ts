import nodemailer from 'nodemailer';
import { ValidationError } from './error_handler';
import User from '../models/User';

interface EmailParams {
	user: typeof User;
	subject?: string;
	message: string;
}

export const sendEmail = async (options: any) => {
	const host: any = process.env.SMTP_HOST;
	const port: any = process.env.SMTP_PORT;
	const auth: any = {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	};
	const transport = nodemailer.createTransport({
		host,
		port,
		auth,
	});

	const message = {
		from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	const info = await transport.sendMail(message);

	console.log('Message sent %s', info.messageId);
};
