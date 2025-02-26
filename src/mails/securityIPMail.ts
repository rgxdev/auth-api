import {SERVICE_NAME, URL_DOMAIN, URL_PROTOCOL} from "@/config/config";

function getFormattedDate() {
    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${month} ${day}, ${year} at ${formattedHours}:${formattedMinutes} ${ampm}`;
}


export default function getSecurityIPMail(user: any, ip: string, location: string, source: any): string {

    const currentYear = new Date().getFullYear();

    const date = getFormattedDate();

    const device = source.browser + " on " + source.os + " | " + source.version

    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
</head>
<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">${SERVICE_NAME} recent login
</div>

<body style="background-color:#fff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
<table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em" width="100%">
    <tbody>
    <tr style="width:100%">
        <td>
            <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:30px 20px" width="100%">
                <tbody>
                <tr>
                    <td><img src="https://cdn.rgxdev.de/api/files/download/images/logo-banner.png" style="height:76px;width:230px;display:block;outline:none;border:none;text-decoration:none" /></td>
                </tr>
                </tbody>
            </table>
            <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="border:1px solid rgb(0,0,0, 0.1);border-radius:3px;overflow:hidden" width="100%">
                <tbody>
                <tr>
                    <td>
                        <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                            <tbody style="width:100%">
                            <tr style="width:100%"><img src="https://cdn.rgxdev.de/api/files/download/images/email-vault.png" style="display:block;outline:none;border:none;text-decoration:none;max-width:100%" width="620" /></tr>
                            </tbody>
                        </table>
                        <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:20px;padding-bottom:0" width="100%">
                            <tbody style="width:100%">
                            <tr style="width:100%">
                                <td data-id="__react-email-column">
                                    <h1 style="font-size:32px;font-weight:bold;text-align:center">Hi ${user.username},</h1>
                                    <h2 style="font-size:26px;font-weight:bold;text-align:center">We noticed a recent login to your ${SERVICE_NAME} account.</h2>
                                    <p style="font-size:16px;line-height:24px;margin:16px 0"><b>Time: </b>${date}</p>
                                    <p style="font-size:16px;line-height:24px;margin:16px 0;margin-top:-5px"><b>Device: </b>${device}</p>
                                    <p style="font-size:16px;line-height:24px;margin:16px 0;margin-top:-5px"><b>Location: </b>${location}</p>
                                    <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0, 0.5);margin-top:-5px">*Approximate geographic location based on IP address: <!-- -->${ip}</p>
                                    <p style="font-size:16px;line-height:24px;margin:16px 0">If this was you, there&#x27;s nothing else you need to do.</p>
                                    <p style="font-size:16px;line-height:24px;margin:16px 0;margin-top:-5px">If this wasn&#x27;t you or if you have additional questions, please see our support page.</p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:20px;padding-top:0" width="100%">
                            <tbody style="width:100%">
                            <tr style="width:100%">
                                <td colSpan="2" data-id="__react-email-column" style="display:flex;justify-content:center;width:100%"><a href="${URL_PROTOCOL}://${URL_DOMAIN}" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;background-color:#e00707;border-radius:3px;color:#FFF;font-weight:bold;border:1px solid rgb(0,0,0, 0.1);cursor:pointer;padding:12px 30px 12px 30px" target="_blank"><span><!--[if mso]><i style="letter-spacing: 30px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Learn More</span><span><!--[if mso]><i style="letter-spacing: 30px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
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
                    <td><img src="https://cdn.rgxdev.de/api/files/download/images/footer-image.png" style="display:block;outline:none;border:none;text-decoration:none;max-width:100%" width="620" /></td>
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
