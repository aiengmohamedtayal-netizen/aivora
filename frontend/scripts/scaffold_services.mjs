import fs from 'fs';
import path from 'path';

const SLUGS = [
  "ai-solutions",
  "custom-software",
  "saas-development",
  "web-development",
  "automation",
  "startup-mvp"
];

const locales = ['en', 'ar'];

const defaultContentEn = {
  hero: {
    title: "",
    description: "",
    primaryCta: "Start a Project",
    secondaryCta: "Talk to Sales"
  },
  problems: {
    title: "The Challenge",
    description: ""
  },
  solution: {
    title: "Our Solution",
    description: ""
  },
  features: {
    title: "Key Features",
    items: [
      { title: "Scalability", description: "Built to scale seamlessly as your user base grows." },
      { title: "Security", description: "Enterprise-grade security and compliance out of the box." },
      { title: "Performance", description: "High-speed performance with optimized architectures." },
      { title: "Customization", description: "Tailored perfectly to your unique business workflows." }
    ]
  },
  process: {
    title: "Development Process",
    steps: [
      { title: "Discovery", description: "Deep dive into your requirements and business goals." },
      { title: "Planning", description: "Architecting the solution and defining milestones." },
      { title: "Development", description: "Iterative, agile building with regular updates." },
      { title: "Deployment", description: "Seamless launch and handover." }
    ]
  },
  techStack: {
    title: "Technology Stack",
    technologies: ["React", "Next.js", "Node.js", "PostgreSQL", "Supabase", "TypeScript"]
  },
  benefits: {
    title: "Business Benefits",
    items: [
      { title: "Cost Reduction", description: "Eliminate manual errors and reduce operational overhead." },
      { title: "Time Saving", description: "Automate repetitive tasks to free up your team." },
      { title: "Growth", description: "Scale your revenue streams with robust technology." }
    ]
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { question: "How long does a typical project take?", answer: "A standard project takes 4 to 12 weeks depending on the complexity and scope." },
      { question: "Do you offer post-launch support?", answer: "Yes, we provide continuous maintenance, monitoring, and feature updates." },
      { question: "Will I own the source code?", answer: "Absolutely. You retain 100% intellectual property and code ownership upon completion." }
    ]
  },
  cta: {
    title: "Ready to transform your business?",
    description: "Let's build something great together. Book a free consultation today.",
    button: "Get Started"
  },
  seoTitle: "",
  seoDescription: ""
};

const defaultContentAr = {
  hero: {
    title: "",
    description: "",
    primaryCta: "ابدأ مشروعك",
    secondaryCta: "تحدث إلى المبيعات"
  },
  problems: {
    title: "التحدي",
    description: ""
  },
  solution: {
    title: "الحل",
    description: ""
  },
  features: {
    title: "الميزات الرئيسية",
    items: [
      { title: "قابلية التوسع", description: "مصمم للتوسع بسلاسة مع نمو قاعدة مستخدميك." },
      { title: "الأمان", description: "أمان وحماية بيانات على مستوى المؤسسات الكبرى." },
      { title: "الأداء", description: "أداء عالي السرعة بفضل البنى التحتية المحسنة." },
      { title: "التخصيص", description: "مصمم خصيصاً ليناسب مسارات عملك الفريدة." }
    ]
  },
  process: {
    title: "عملية التطوير",
    steps: [
      { title: "الاكتشاف", description: "فهم عميق لاحتياجاتك وأهداف أعمالك." },
      { title: "التخطيط", description: "هندسة الحل البرمجي وتحديد المعالم الرئيسية." },
      { title: "التطوير", description: "بناء رشيق وتكراري مع تحديثات منتظمة." },
      { title: "الإطلاق", description: "نشر سلس وتسليم كامل للمشروع." }
    ]
  },
  techStack: {
    title: "التقنيات المستخدمة",
    technologies: ["React", "Next.js", "Node.js", "PostgreSQL", "Supabase", "TypeScript"]
  },
  benefits: {
    title: "فوائد الأعمال",
    items: [
      { title: "تقليل التكاليف", description: "التخلص من الأخطاء اليدوية وخفض الأعباء التشغيلية." },
      { title: "توفير الوقت", description: "أتمتة المهام المتكررة لتفريغ فريقك للأعمال الأهم." },
      { title: "النمو", description: "توسيع مصادر الإيرادات بتقنيات حديثة وقوية." }
    ]
  },
  faq: {
    title: "الأسئلة الشائعة",
    items: [
      { question: "كم يستغرق المشروع عادةً؟", answer: "يستغرق المشروع المعتاد من 4 إلى 12 أسبوعاً حسب التعقيد ونطاق العمل." },
      { question: "هل تقدمون دعماً بعد الإطلاق؟", answer: "نعم، نقدم صيانة مستمرة، ومراقبة، وتحديثات للميزات." },
      { question: "هل سأمتلك الكود المصدري؟", answer: "بالتأكيد. تحتفظ بملكية فكرية كاملة وملكية الكود عند الانتهاء." }
    ]
  },
  cta: {
    title: "جاهز لتحويل أعمالك؟",
    description: "دعنا نبني شيئاً عظيماً معاً. احجز استشارتك المجانية اليوم.",
    button: "ابدأ الآن"
  },
  seoTitle: "",
  seoDescription: ""
};

locales.forEach(locale => {
  const servicesPath = path.join(process.cwd(), `messages/${locale}/services`);
  if (!fs.existsSync(servicesPath)) {
    fs.mkdirSync(servicesPath, { recursive: true });
  }

  // Load existing services.json to copy existing details
  const oldJsonPath = path.join(process.cwd(), `messages/${locale}/services.json`);
  const oldData = JSON.parse(fs.readFileSync(oldJsonPath, 'utf8'));

  SLUGS.forEach(slug => {
    const slugData = oldData[slug];
    const newContent = locale === 'en' ? JSON.parse(JSON.stringify(defaultContentEn)) : JSON.parse(JSON.stringify(defaultContentAr));

    newContent.hero.title = slugData.title;
    newContent.hero.description = slugData.description;
    newContent.problems.description = slugData.challenge;
    newContent.solution.description = slugData.solution;
    newContent.seoTitle = slugData.seoTitle;
    newContent.seoDescription = slugData.seoDescription;

    // Save
    fs.writeFileSync(path.join(servicesPath, `${slug}.json`), JSON.stringify(newContent, null, 2));
  });
});

console.log("Scaffolded translation JSON files for all services.");
