import fs from 'fs';
import path from 'path';

const baseStructure = {
  seoTitle: "Start Your Project | Aivora",
  seoDescription: "Tell us about your project and receive a tailored software engineering roadmap.",
  keywords: "project intake, consultation, software development",
  hero: {
    headline: "Let's build the right solution together.",
    description: "This takes only 2–3 minutes.",
    benefits: [
      "No commitment",
      "Free consultation",
      "Personalized recommendations"
    ],
    cta: "Start"
  },
  howItWorks: {
    title: "How it Works",
    steps: [
      { id: "1", title: "Tell us about your idea", desc: "" },
      { id: "2", title: "We analyze your goals", desc: "" },
      { id: "3", title: "Receive a tailored roadmap", desc: "" }
    ]
  },
  wizard: {
    progressText: "Question {current} / {total}",
    estimatedTime: "Estimated time remaining: {time} min",
      whyAsk: {
      type: "We use this information to recommend the right architecture.",
      audience: "Understanding your audience helps us optimize performance and user experience.",
      stage: "Knowing your current stage helps us determine the right starting point for engineering.",
      timeline: "This allows us to allocate the right engineering resources to meet your deadlines.",
      budget: "We align our technical recommendations with your financial framework.",
      description: "Any context you provide helps us prepare for our first discovery call.",
      contact: "We'll use this to send your personalized roadmap and schedule a call."
    },
    questions: {
      type: {
        title: "What are you trying to build?",
        options: {
          ai: "AI Assistant",
          saas: "SaaS Platform",
          business: "Business Software",
          website: "Website",
          automation: "Automation",
          unsure: "Not sure"
        }
      },
      audience: {
        title: "Who is this for?",
        options: {
          startup: "Startup",
          business: "Existing Business",
          enterprise: "Enterprise",
          personal: "Personal Project"
        }
      },
      stage: {
        title: "Current project stage",
        options: {
          idea: "Idea",
          prototype: "Prototype",
          existing: "Existing Product",
          scaling: "Scaling"
        }
      },
      timeline: {
        title: "Timeline",
        options: {
          asap: "ASAP",
          short: "1-3 Months",
          medium: "3-6 Months",
          flexible: "Flexible"
        }
      },
      budget: {
        title: "Budget",
        options: {
          tier1: "<$10k",
          tier2: "$10k-$50k",
          tier3: "$50k-$100k",
          tier4: "$100k+"
        }
      },
      description: {
        title: "Project description",
        placeholder: "Tell us a bit more about what you want to achieve..."
      },
      contact: {
        title: "Contact details",
        fields: {
          name: "Full Name",
          email: "Professional Email",
          company: "Company Name",
          phone: "Phone Number (Optional)"
        }
      }
    },
    trust: {
      title: "Why companies choose Aivora",
      points: [
        "Senior engineering approach",
        "Transparent communication",
        "Fast iterations",
        "Long-term partnership"
      ]
    },
    actions: {
      next: "Next",
      prev: "Back",
      submit: "Submit Request"
    }
  },
  success: {
    title: "Your request has been received.",
    description: "Our team reviews every project personally.",
    timeline: "We will get back to you within 24 hours.",
    ctaCall: "Book a Discovery Call",
    ctaHome: "Return Home"
  }
};

const arStructure = {
  seoTitle: "ابدأ مشروعك | أيفورا",
  seoDescription: "أخبرنا عن مشروعك واحصل على خارطة طريق مخصصة لهندسة البرمجيات.",
  keywords: "استشارة, تطوير البرمجيات, طلب مشروع",
  hero: {
    headline: "دعنا نبني الحل الأنسب معاً.",
    description: "يستغرق هذا من دقيقتين إلى 3 دقائق فقط.",
    benefits: [
      "بدون أي التزام",
      "استشارة مجانية",
      "توصيات مخصصة"
    ],
    cta: "ابدأ الآن"
  },
  howItWorks: {
    title: "كيف نعمل",
    steps: [
      { id: "1", title: "أخبرنا عن فكرتك", desc: "" },
      { id: "2", title: "نحلل أهدافك", desc: "" },
      { id: "3", title: "احصل على خارطة طريق", desc: "" }
    ]
  },
  wizard: {
    progressText: "السؤال {current} / {total}",
    estimatedTime: "الوقت المتبقي: {time} دقيقة",
    whyAsk: {
      type: "نستخدم هذه المعلومات لاقتراح البنية التقنية المناسبة.",
      audience: "فهم جمهورك يساعدنا على تحسين الأداء وتجربة المستخدم.",
      stage: "معرفة مرحلتك الحالية يساعدنا في تحديد نقطة البداية الهندسية المناسبة.",
      timeline: "يسمح لنا هذا بتخصيص الموارد الهندسية المناسبة لتلبية المواعيد النهائية.",
      budget: "نحن نوائم توصياتنا التقنية مع إطارك المالي.",
      description: "أي تفاصيل تقدمها تساعدنا في التحضير لمكالمتنا الاستكشافية الأولى.",
      contact: "سنستخدم هذه المعلومات لإرسال خارطة الطريق المخصصة وتحديد موعد المكالمة."
    },
    questions: {
      type: {
        title: "ما الذي تحاول بناءه؟",
        options: {
          ai: "مساعد ذكاء اصطناعي",
          saas: "منصة SaaS",
          business: "برمجيات أعمال",
          website: "موقع إلكتروني",
          automation: "أتمتة",
          unsure: "غير متأكد"
        }
      },
      audience: {
        title: "لمن هذا المشروع؟",
        options: {
          startup: "شركة ناشئة",
          business: "عمل قائم",
          enterprise: "مؤسسة كبيرة",
          personal: "مشروع شخصي"
        }
      },
      stage: {
        title: "المرحلة الحالية للمشروع",
        options: {
          idea: "فكرة",
          prototype: "نموذج أولي (Prototype)",
          existing: "منتج قائم",
          scaling: "توسع (Scaling)"
        }
      },
      timeline: {
        title: "الجدول الزمني",
        options: {
          asap: "في أسرع وقت",
          short: "١-٣ أشهر",
          medium: "٣-٦ أشهر",
          flexible: "مرن"
        }
      },
      budget: {
        title: "الميزانية",
        options: {
          tier1: "أقل من ١٠ آلاف دولار",
          tier2: "١٠ - ٥٠ ألف دولار",
          tier3: "٥٠ - ١٠٠ ألف دولار",
          tier4: "أكثر من ١٠٠ ألف دولار"
        }
      },
      description: {
        title: "وصف المشروع",
        placeholder: "أخبرنا المزيد عما تريد تحقيقه..."
      },
      contact: {
        title: "بيانات التواصل",
        fields: {
          name: "الاسم الكامل",
          email: "البريد الإلكتروني المهني",
          company: "اسم الشركة",
          phone: "رقم الهاتف (اختياري)"
        }
      }
    },
    trust: {
      title: "لماذا تختار الشركات أيفورا",
      points: [
        "نهج هندسي متقدم",
        "تواصل شفاف",
        "تطوير سريع",
        "شراكة طويلة الأمد"
      ]
    },
    actions: {
      next: "التالي",
      prev: "رجوع",
      submit: "إرسال الطلب"
    }
  },
  success: {
    title: "تم استلام طلبك بنجاح.",
    description: "يقوم فريقنا بمراجعة كل مشروع شخصياً.",
    timeline: "سنقوم بالرد عليك خلال ٢٤ ساعة.",
    ctaCall: "حجز مكالمة استكشافية",
    ctaHome: "العودة للرئيسية"
  }
};

fs.writeFileSync(path.join(process.cwd(), 'messages/en/intake-portal.json'), JSON.stringify(baseStructure, null, 2));
fs.writeFileSync(path.join(process.cwd(), 'messages/ar/intake-portal.json'), JSON.stringify(arStructure, null, 2));

console.log("Intake JSON updated.");
