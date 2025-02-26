// src/services/TwoFactorAuthService.ts

import {authenticator} from 'otplib';
import {sendMail} from '@/utils/mailer';
import {generateSsoToken} from '@/controllers/ssoLogin'; // Stellen Sie sicher, dass diese Funktion korrekt importiert ist
import {LOGIN_DOMAIN, SERVICE_NAME, URL_DOMAIN, URL_PROTOCOL} from '@/config/config';

export class TwoFactorAuthService {
    async check2FACode(code: string, user: any): Promise<{ type: string, message: string }> {
        if (!code) {
            return {type: 'invalid_request', message: '2FA code is required.'};
        }
        if (code.length !== 6 || !/^[0-9]+$/.test(code)) {
            return {type: 'invalid_request', message: 'Invalid 2FA code.'};
        }
        if (!user || !user.twoFactorSecret) {
            return {type: 'invalid_request', message: 'User not found or 2FA not enabled.'};
        }

        const isCodeValid = authenticator.check(code, user.twoFactorSecret);

        if (!isCodeValid) {
            return {type: 'invalid_code', message: 'Invalid 2FA code.'};
        }

        const ssoToken = await generateSsoToken(user.id);

        const ssoUrl = `${URL_PROTOCOL}://${URL_DOMAIN}/sso?token=${ssoToken}&redirect=${LOGIN_DOMAIN}/sso`;

        const htmlContent = `Click <a href="${ssoUrl}">here</a> to log in. This link is valid for 30 minutes.`;
        await sendMail(user.email, htmlContent, `Your ${SERVICE_NAME} SSO Login`);

        return {type: 'success', message: 'Login success'};
    }

    check2FACodeValid(code: string, user: any) {
        if (!code) {
            return {type: 'invalid_request', message: '2FA code is required.'};
        }
        if (code.length !== 6 || !/^[0-9]+$/.test(code)) {
            return {type: 'invalid_request', message: 'Invalid 2FA code.'};
        }
        if (!user || !user.twoFactorSecret) {
            return {type: 'invalid_request', message: 'User not found or 2FA not enabled.'};
        }

        const isCodeValid = authenticator.check(code, user.twoFactorSecret);

        if (!isCodeValid) {
            return {type: 'invalid_code', message: 'Invalid 2FA code.'};
        }

        return {type: 'success', message: 'Auth code is valid'};
    }
}
