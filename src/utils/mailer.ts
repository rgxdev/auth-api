import axios from "axios";
import createTransporter from "@/lib/nodemailer";
import getSecurityIPMail from "@/mails/securityIPMail";
import {Request} from "express";
import {logger} from "@/lib/logger";
import {SERVICE_NAME, URL_DOMAIN} from "@/config/config";

export async function sendIPMail(user: any, req: Request) {
    const ip = req.header("CF-Connecting-IP") || "0.0.0.0";

    try {
        const apiResponse = await axios.get(`http://ip-api.com/json/${ip}`);
        const locationData = apiResponse.data;

        const location =
            locationData.status === "success"
                ? `${locationData.city}, ${locationData.regionName}, ${locationData.country}`
                : "Unknown Location";

        const htmlContent = getSecurityIPMail(
            user,
            ip,
            location,
            req.headers["user-agent"] || "unknown"
        );
        await sendMail(user, htmlContent, `New device login detected | ${SERVICE_NAME}`);
        logger.log("MAILER", `Email sent successfully to: ${user.email}`);
    } catch (error) {
        logger.error(
            "MAILER",
            `Failed to send security IP email: ${(error as Error).message}`
        );
    }
}

export async function sendMail(
    user: any,
    htmlContent: string,
    subject: string
) {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: `${SERVICE_NAME} System <no-reply@${URL_DOMAIN}>`,
            to: user.email,
            subject: subject,
            html: htmlContent,
        };

        const result = await transporter.sendMail(mailOptions);
        logger.log("MAILER", `Email sent successfully to: ${result.accepted}`);
        return true;
    } catch (error) {
        logger.error("MAILER", `Failed to send email: ${(error as Error).message}`);
        return false;
    }
}
