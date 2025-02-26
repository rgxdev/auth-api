import {DISCORD_INVITE, SERVICE_NAME, URL_DOMAIN, URL_PROTOCOL} from "@/config/config";

export default function getWelcomeEmail(token: any): string {


const unsibscribeLink = `${URL_PROTOCOL}://${URL_DOMAIN}settings/email/unsubscribe`;
const currentYear = new Date().getFullYear();

return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <link as="image" href="LOGO_URL_PLEASE_EDIT" rel="preload" />
        <title>${SERVICE_NAME} Welcome</title>
    <meta name="x-apple-disable-message-reformatting" /><!--$-->
</head>
<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">${SERVICE_NAME} Welcome
</div>

<body style="background-color:rgb(250,251,251);font-size:1rem;line-height:1.5rem;font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;"><img alt=${SERVICE_NAME} draggable="false" height="75" src="LOGO_URL_PLEASE_EDIT" style="margin-left:auto;margin-right:auto;margin-top:20px;margin-bottom:20px;display:block;outline:none;border:none;text-decoration:none" width="184" />
<table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:rgb(255,255,255);padding:45px;max-width:37.5em" width="100%">
    <tbody>
    <tr style="width:100%">
        <td>
            <h1 style="text-align:center;margin-top:0px;margin-bottom:0px;line-height:2rem">Du bist auf der Warteliste 🎉</h1>
            <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                <tbody>
                <tr>
                    <td>
                        <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                            <tbody style="width:100%">
                            <tr style="width:100%">
                                <p style="font-size:1rem;line-height:1.5rem;margin:16px 0">Glückunsch! Du hast es geschafft, du bist eine ganz besondere Person! Du bist nun auf unserer Wartelist von ${SERVICE_NAME}. Du wirst deine Vorteile genießen können, sobald ${SERVICE_NAME} veröffentlicht wurde! </p>
                                <p style="font-size:1rem;line-height:1.5rem;margin:16px 0">Hier einige Dinge vorab:</p>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
            <ul>
                <li style="margin-bottom:20px"><strong>Empfiehl uns weiter.</strong> <a href="${URL_PROTOCOL}://${URL_DOMAIN}" style="color:#067df7;text-decoration:none" target="_blank">Besuche unser Dashboard</a>, und kopiere deinen Einladungslink. Für jeden aktiv, eingeladenen Freund, erhälst du Meilensteine und für jeden Meilenstein eine weitere Belohnung!</li>
                <li style="margin-bottom:20px"><strong>Bleibe auf dem Laufenden.</strong> Überprüfe ab und zu dein Postfach und erfahre, ob es etwas Neues von ${SERVICE_NAME} gibt!</li>
                <li style="margin-bottom:20px"><strong>Untersüze uns.</strong><a href="${URL_PROTOCOL}://${URL_DOMAIN}/socials" style="color:#067df7;text-decoration:none" target="_blank" > Folge uns auf den sozialen Medien</a> und teile unsere Inhalte mit deinen Freunden.</li>
                <li style="margin-bottom:20px"><strong>Verifiziere deine E-Mail</strong><a href="${URL_PROTOCOL}://${URL_DOMAIN}/?key=${token}" style="color:#067df7;text-decoration:none" target="_blank"> Drücke hier um deine E-Mail zu verifizeren</a>, da sie sonst in 5 Tagen automatisch aus unserem System gelöscht wird!</li>
            </ul>
            <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="text-align:center" width="100%">
                <tbody>
                <tr>
                    <td><a href="${URL_PROTOCOL}://${URL_DOMAIN}/?key=${token}" style="background-color:rgb(34,80,244);color:rgb(255,255,255);border-radius:0.5rem;padding-top:0.75rem;padding-bottom:0.75rem;padding-left:18px;padding-right:18px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:12px 18px 12px 18px" target="_blank"><span><!--[if mso]><i style="mso-font-width:450%;mso-text-raise:18" hidden>&#8202;&#8202;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Verifizere deine Email</span><span><!--[if mso]><i style="mso-font-width:450%" hidden>&#8202;&#8202;&#8203;</i><![endif]--></span></a></td>
                </tr>
                </tbody>
            </table>
            <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-top:45px" width="100%">
                <tbody>
                <tr>
                    <td>
                        <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                            <tbody style="width:100%">
                            <tr style="width:100%">
                                <td data-id="__react-email-column"><a href="${DISCORD_INVITE}" style="color:rgb(0,0,0);text-decoration-line:underline;font-weight:700;text-decoration:none" target="_blank">Unsere Community</a> <span style="color:rgb(34,197,94)">→</span></td>
                                <td data-id="__react-email-column"><a href="${URL_PROTOCOL}://${URL_DOMAIN}" style="color:rgb(0,0,0);text-decoration-line:underline;font-weight:700;text-decoration:none" target="_blank">Informiere dich</a> <span style="color:rgb(34,197,94)">→</span></td>
                                <td data-id="__react-email-column"><a href="${DISCORD_INVITE}" style="color:rgb(0,0,0);text-decoration-line:underline;font-weight:700;text-decoration:none" target="_blank">Bekomme Support</a> <span style="color:rgb(34,197,94)">→</span></td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>
<table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-top:20px;max-width:37.5em" width="100%">
    <tbody>
    <tr style="width:100%">
        <td>
            <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                <tbody>
                <tr>
                    <td>
                        <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                            <tbody style="width:100%">
                            <tr style="width:100%">
                                <td  data-id="__react-email-column" style="text-align:right;padding-left:20px;padding-right:20px"><a href="${unsibscribeLink}" style="color:#067df7;text-decoration:none" target="_blank">Unsubscribe</a></td>
                                <td data-id="__react-email-column" style="text-align:left"><a  href="${URL_PROTOCOL}://${URL_DOMAIN}/settings/email" style="color:#067df7;text-decoration:none" target="_blank">Manage Preferences</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
            <p style="text-align:center;color:rgb(156,163,175);margin-bottom:45px;font-size:14px;line-height:24px;margin:16px 0">® © ${SERVICE_NAME} ${currentYear}, Bavaria Germany</p>
        </td>
    </tr>
    </tbody>
</table><!--/$-->
</body>

</html>
`
}