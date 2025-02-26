import {SERVICE_NAME, URL_DOMAIN, URL_PROTOCOL} from "@/config/config";


export default function getcompleteAccountSetupMail(user: any): string {

    const currentYear = new Date().getFullYear();


    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
</head>
<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Welcome to ${SERVICE_NAME} - Your Registration is Successful</div>

<body style="background-color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif">
<table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em" width="100%">
    <tbody>
    <tr style="width:100%">
        <td>
            <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:30px 20px" width="100%">
                <tbody>
                <tr>
                    <td><img src="LOGO_URL_PLEASE_EDIT" style="height:76px;width:230px;display:block;outline:none;border:none;text-decoration:none" /></td>
                </tr>
                </tbody>
            </table>
            <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="border:1px solid rgb(0,0,0, 0.1);border-radius:3px;overflow:hidden" width="100%">
                <tbody>
                <tr>
                    <td>
                        <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                            <tbody style="width:100%">
                            <tr style="width:100%"><img src="hLOGO_URL_PLEASE_EDIT" style="display:block;outline:none;border:none;text-decoration:none;max-width:100%" width="620" /></tr>
                            </tbody>
                        </table>
                        <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:20px;padding-bottom:0" width="100%">
                            <tbody style="width:100%">
                            <tr style="width:100%">
                                <td data-id="__react-email-column">
                                    <h1 style="font-size:32px;font-weight:bold;text-align:center">Welcome, ${user.username}!</h1>
                                    <p style="font-size:16px;line-height:24px;margin:16px 0">Thank you for registering with ${SERVICE_NAME}. We're excited to have you join our community!</p>
                                    <p style="font-size:16px;line-height:24px;margin:16px 0">You can start exploring your dashboard and set up your preferences by clicking the button below.</p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:20px;padding-top:0" width="100%">
                            <tbody style="width:100%">
                            <tr style="width:100%">
                                <td colSpan="2" data-id="__react-email-column" style="display:flex;justify-content:center;width:100%"><a href="${URL_PROTOCOL}://${URL_DOMAIN}" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;background-color:#4CAF50;border-radius:3px;color:#FFF;font-weight:bold;border:1px solid rgb(0,0,0, 0.1);cursor:pointer;padding:12px 30px 12px 30px" target="_blank"><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Get Started</span></a></td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
            <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:45px 0 0 0" width="100%">
                <tbody>
                <tr>
                    <td><img src="LOGO_URL_PLEASE_EDIT" style="display:block;outline:none;border:none;text-decoration:none;max-width:100%" width="620" /></td>
                </tr>
                </tbody>
            </table>
            <p style="font-size:12px;line-height:24px;margin:16px 0;text-align:center;color:rgb(0,0,0, 0.7)">© ${currentYear} | ${SERVICE_NAME}, Germany | www.${URL_DOMAIN}</p>
        </td>
    </tr>
    </tbody>
</table>
</body>

</html>

    `;
}
