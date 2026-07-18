export function getWelcomeEmailHtml(
  unsubscribeUrl: string,
  locale: "ar" | "en"
): string {
  const isAr = locale === "ar"
  const title = isAr ? "مرحباً بك في أيفورا 🎉" : "Welcome to Aivora 🎉"
  
  const greeting = isAr ? "أهلاً بك في استوديو أيفورا،" : "Welcome to Aivora Studio,"
  
  const introText = isAr
    ? "يسعدنا جداً انضمامك إلينا! في أيفورا، نقوم ببناء برمجيات متكاملة ومنتجات ذكاء اصطناعي ثورية مصممة خصيصاً للشركات الطموحة والمؤسسات الحديثة."
    : "We are thrilled to have you with us! At Aivora, we engineer state-of-the-art software systems and custom AI agents to accelerate ambitious businesses."

  const sectionTitle = isAr ? "ما الذي نقوم ببنائه؟" : "What we build:"

  const items = isAr ? [
    { title: "الذكاء الاصطناعي وتكامل الأنظمة", desc: "تصميم وكلاء ذكاء اصطناعي وأنظمة RAG مخصصة لربط عملياتك بسلاسة." },
    { title: "منصات الـ SaaS وتطبيقات الويب", desc: "تطبيقات ويب سريعة، تفاعلية وقابلة للتوسع بتصميم راقٍ." },
    { title: "أتمتة الأعمال وسير العمل", desc: "ربط واجهات الـ APIs لإنشاء سلاسل عمليات مؤتمتة تلغي المهام اليدوية المكررة." }
  ] : [
    { title: "AI & System Integration", desc: "Tailored AI agents, LLM orchestration, and semantic retrieval systems built into your workflow." },
    { title: "SaaS Platforms & Web Apps", desc: "High-performance, secure, and responsive web products built with next-gen designs." },
    { title: "Workflow Automation", desc: "Integrate third-party APIs to automate critical business sequences and eliminate manual overhead." }
  ]

  const ctaTitle = isAr ? "هل لديك مشروع ترغب في نقاشه؟" : "Ready to scale your next product?"
  const ctaDesc = isAr 
    ? "احجز استشارة مجانية مع فريقنا الهندسي اليوم وسنساعدك في تحويل فكرتك إلى حقيقة."
    : "Book a free strategic consultation with our engineering team, and let's map out your roadmap."
  const ctaBtnText = isAr ? "احجز استشارتك المجانية" : "Book Free Consultation"
  const ctaUrl = "https://aivora-lac.vercel.app/intake"

  const footerText = isAr
    ? "ستتلقى رسائل شهرية خفيفة تحتوي على مقالات هندسية ودراسات حالة لمنتجاتنا."
    : "You will receive lightweight monthly updates containing our engineering notes and product case studies."

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
                  <h1 style="font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 24px; color: #ffffff;">${title}</h1>
                  <p style="font-size: 15px; font-weight: 600; color: #ffffff; margin-bottom: 10px;">${greeting}</p>
                  <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin-bottom: 30px;">
                    ${introText}
                  </p>
                  
                  <!-- Services Section -->
                  <h3 style="font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 15px;">${sectionTitle}</h3>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    ${items.map(item => `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
                          <div style="font-size: 14px; font-weight: 600; color: #ffffff; margin-bottom: 4px;">• ${item.title}</div>
                          <div style="font-size: 13px; color: #9ca3af; line-height: 1.5; padding-left: 12px;">${item.desc}</div>
                        </td>
                      </tr>
                    `).join("")}
                  </table>

                  <!-- Interactive CTA Card -->
                  <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 12px; padding: 24px; text-align: center; margin-top: 20px;">
                    <h4 style="font-size: 15px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">${ctaTitle}</h4>
                    <p style="font-size: 13px; color: #9ca3af; line-height: 1.5; margin: 0 0 16px 0;">${ctaDesc}</p>
                    <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 13px; font-weight: 600; color: #ffffff; background-color: #3b82f6; text-decoration: none; border-radius: 9999px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);">
                      ${ctaBtnText}
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer Block -->
              <tr>
                <td align="center" style="padding: 30px; background: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(255, 255, 255, 0.05);">
                  <p style="font-size: 11px; color: #6b7280; margin: 0 0 12px 0; line-height: 1.5;">
                    ${footerText}
                  </p>
                  <p style="font-size: 11px; color: #4b5563; margin: 0 0 15px 0;">
                    Aivora Studio • Premium AI & Software Engineering Studio
                  </p>
                  <div style="font-size: 11px;">
                    <a href="https://aivora-lac.vercel.app/privacy-policy" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">${isAr ? "سياسة الخصوصية" : "Privacy Policy"}</a>
                    <span style="color: #374151;">•</span>
                    <a href="${unsubscribeUrl}" style="color: #ef4444; text-decoration: none; margin: 0 10px;">${isAr ? "إلغاء الاشتراك" : "Unsubscribe"}</a>
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
