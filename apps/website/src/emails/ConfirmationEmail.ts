export function getConfirmationEmailHtml(
  confirmUrl: string,
  unsubscribeUrl: string,
  locale: "ar" | "en"
): string {
  const isAr = locale === "ar"
  const title = isAr ? "تأكيد الاشتراك في نشرة أيفورا البريدية" : "Confirm your Aivora newsletter subscription"
  const bodyText = isAr 
    ? "شكراً لاهتمامك بالانضمام إلى نشرة أيفورا البريدية. يرجى الضغط على الزر أدناه لتأكيد عنوان بريدك الإلكتروني والبدء في تلقي آخر تحديثاتنا."
    : "Thank you for subscribing to the Aivora newsletter. Please confirm your email address by clicking the button below to start receiving our updates."
  const buttonText = isAr ? "تأكيد الاشتراك" : "Confirm Subscription"
  const footerText = isAr
    ? "إذا لم تقم بطلب هذا الاشتراك، يمكنك تجاهل هذا البريد الإلكتروني بأمان."
    : "If you did not request this, you can safely ignore this email."
  const companyInfo = "Aivora Studio • Premium AI & Software Engineering Studio"
  const privacyText = isAr ? "سياسة الخصوصية" : "Privacy Policy"
  const unsubscribeText = isAr ? "إلغاء الاشتراك" : "Unsubscribe"

  const direction = isAr ? "rtl" : "ltr"
  const textAlign = isAr ? "right" : "left"

  return `
    <!DOCTYPE html>
    <html dir="${direction}" lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #05050a; color: #f3f4f6; -webkit-font-smoothing: antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #05050a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
              
              <!-- Header Brand Logo -->
              <tr>
                <td align="center" style="padding: 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); background: rgba(0, 0, 0, 0.2);">
                  <span style="font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #ffffff;">AIVORA</span>
                </td>
              </tr>
              
              <!-- Content Body -->
              <tr>
                <td style="padding: 40px 35px; text-align: ${textAlign}; direction: ${direction};">
                  <h1 style="font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 20px; color: #ffffff; line-height: 1.4;">${title}</h1>
                  <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 30px;">
                    ${bodyText}
                  </p>
                  
                  <!-- Button Link -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-bottom: 10px;">
                        <a href="${confirmUrl}" target="_blank" style="display: inline-block; padding: 14px 30px; font-size: 14px; font-weight: 600; color: #ffffff; background-color: #3b82f6; text-decoration: none; border-radius: 9999px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); transition: background-color 0.2s;">
                          ${buttonText}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer Block -->
              <tr>
                <td align="center" style="padding: 30px; background: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(255, 255, 255, 0.05);">
                  <p style="font-size: 11px; color: #6b7280; margin: 0 0 12px 0; line-height: 1.5;">
                    ${footerText}
                  </p>
                  <p style="font-size: 11px; color: #4b5563; margin: 0 0 15px 0;">
                    ${companyInfo}
                  </p>
                  <div style="font-size: 11px;">
                    <a href="https://aivora-lac.vercel.app/privacy-policy" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">${privacyText}</a>
                    <span style="color: #374151;">•</span>
                    <a href="${unsubscribeUrl}" style="color: #ef4444; text-decoration: none; margin: 0 10px;">${unsubscribeText}</a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
