import nodemailer from 'nodemailer'
import * as process from "node:process";

export default async function createTransporter() {
    return nodemailer.createTransport({
        port: 587,
        host: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
        secure: false,
        connectionTimeout: 10000,
    });
}
