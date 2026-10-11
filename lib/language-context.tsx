"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Lang = "ar" | "en"

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations = {
  ar: {
    // Common
    "login": "تسجيل الدخول",
    "logout": "تسجيل الخروج",
    "loading": "جارٍ التحميل...",
    
    // Home page
    "home.tryFree": "أبدأ الآن",
    "home.loading": "جارٍ تحويلك للنظام...",
    "home.aboutUs": "من نحن",
    "home.support": "الدعم الفني",
    "home.supportDesc": "متاح على مدار الساعة لمساعدتك في أي استفسار",
    "home.contact": "تواصل معنا",
    "home.email": "البريد الإلكتروني",
    "home.phone": "الهاتف",
    "home.footer": "2026 Spectra Trace. كافة الحقوق محفوظة.",
    
    // About page
    "about.title": "About Us",
    "about.back": "رجوع",
    "about.whatTitle": "ما هو Spectra-Trace؟",
    "about.whatP1": "Spectra-Trace منصة متخصصة في توزيع الوثائق الداخلية بشكل آمن، مصممة لحل أحد أعقد التحديات في الأمن السيبراني المؤسسي معرفة من سرّب الملف بالضبط.",
    "about.whatP2": "كل مؤسسة توزّع وثائق حساسة يومياً. وكل وثيقة موزّعة تحمل في طياتها خطراً محتملاً. Spectra-Trace بُنيت للقضاء على هذا الخطر تماماً ليس بتقييد الوصول، بل بضمان أن كل ملف يحمل هوية من استلمه.",
    "about.howTitle": "كيف تعمل؟",
    "about.howP1": "في كل مرة يتم فيها تحميل ملف عبر المنصة، تُضمَّن داخله بصمة جنائية فريدة وغير مرئية تحتوي على هوية المستلم ورقمه الوظيفي والتوقيت الدقيق للاستلام.",
    "about.howP2": "الملف يبدو مطابقاً للأصل تماماً. يُفتح بشكل طبيعي، يُطبع بشكل طبيعي، ويُشارك بشكل طبيعي. لكنه يحمل في بنيته دليلاً جنائياً لا يمكن إزالته أو تدميره حتى لو تم تعديل الملف أو تحويله أو تصويره بالهاتف.",
    "about.leakTitle": "عند اكتشاف التسريب",
    "about.leakP1": "بمجرد رفع الملف المشبوه، يقوم المحرك الجنائي باستخراج البصمة المخفية تلقائياً وتحديد هوية المسرّب بدقة تامة خلال ثوانٍ معدودة.",
    "about.leakP2": "يتم توثيق كل حادثة تلقائياً في تقرير جنائي شامل يتضمن هوية المسرّب وعنوان IP والتوقيت الدقيق مدعوماً بدليل قانوني معتمد لا يمكن التلاعب به.",
    "about.final": "لا تخمين. لا احتمالات. فقط يقين رياضي حتمي.",
    
    // Sidebar
    "nav.dashboard": "لوحة التحكم الرئيسية",
    "nav.employees": "إدارة الموظفين",
    "nav.encrypt": "نظام تشفير الوثائق",
    "nav.detect": "وحدة كشف التسريب",
    
    // Dashboard
    "dashboard.welcome": "مرحبا",
    "dashboard.user": "مستخدم",
    "dashboard.protectedDocs": "الوثائق المحمية",
    "dashboard.employees": "الموظفين",
    "dashboard.leaks": "التسريبات المكتشفة",
    "dashboard.recentActivity": "النشاط الأخير",
    "dashboard.noActivity": "لا يوجد نشاط حتى الآن",
    
    // Employees
    "emp.title": "إدارة الموظفين",
    "emp.subtitle": "قاعدة بيانات القوى البشرية المصرح لها بالوصول",
    "emp.add": "إضافة موظف جديد",
    "emp.cancel": "إلغاء العملية",
    "emp.fullName": "الاسم الكامل",
    "emp.email": "البريد الإلكتروني",
    "emp.department": "القسم / الإدارة",
    "emp.empNumber": "الرقم الوظيفي",
    "emp.confirm": "تأكيد الإضافة بالنظام",
    "emp.saving": "جارٍ تسجيل البيانات...",
    "emp.loading": "جارٍ مزامنة قاعدة البيانات الجنائية...",
    "emp.noEmployees": "لا يوجد موظفين مسجلين حالياً",
    "emp.colName": "الاسم",
    "emp.colDept": "القسم",
    "emp.colNumber": "الرقم الوظيفي",
    "emp.colActions": "إجراءات",
    "emp.uncategorized": "غير مصنف",
    "emp.delete": "حذف",
    "emp.confirmDelete": "هل أنت متأكد من حذف الموظف",
    
    // Encrypt
    "enc.title": "تشفير وثيقة",
    "enc.subtitle": "يدعم ملفات PDF وWord وExcel",
    "enc.upload": "رفع الوثيقة",
    "enc.dragOrSelect": "اسحب أو اختر الملف",
    "enc.recipients": "المستلمين",
    "enc.selectAll": "تحديد الكل",
    "enc.deselectAll": "إلغاء الكل",
    "enc.encrypting": "جارٍ التشفير",
    "enc.encryptBtn": "تشفير وإنشاء النسخ",
    "enc.empCount": "موظف",
    "enc.success": "تم التشفير بنجاح",
    "enc.copiesGenerated": "تم إنشاء",
    "enc.copies": "نسخة محمية",
    "enc.download": "تحميل",
    "enc.encryptAnother": "تشفير وثيقة أخرى",
    
    // Detect
    "det.title": "كشف التسريب والتحقيق الجنائي",
    "det.subtitle": "ارفع الوثيقة أو الصورة لتحليل البصمات وفحص سلامة المحتوى",
    "det.upload": "ارفع الوثيقة أو الصورة المُراد فحصها",
    "det.analyze": "جارٍ التحليل...",
    "det.detectBtn": "كشف المُسرِّب",
    "det.breachDetected": "تم كشف خرق أمني",
    "det.documentVerified": "تم التحقق من الوثيقة",
    "det.confidence": "نسبة الثقة",
    "det.identifiedLeaker": "المُسرِّب المحدد",
    "det.documentRecipient": "مستلم الوثيقة",
    "det.department": "القسم",
    "det.notSpecified": "غير محدد",
    "det.documentDetails": "تفاصيل الوثيقة",
    "det.filename": "اسم الملف",
    "det.encryptionDate": "تاريخ التشفير",
    "det.distributionDate": "تاريخ التوزيع",
    "det.forensicEvidence": "الأدلة الجنائية الرقمية",
    "det.empName": "اسم الموظف",
    "det.empNumber": "الرقم الوظيفي",
    "det.email": "البريد الإلكتروني",
    "det.ipAddress": "عنوان IP",
    "det.incidentHash": "هاش الحادثة",
    "det.legalEvidence": "هذا السجل لا يمكن حذفه أو تعديله من أي طرف. صالح كدليل قانوني معتمد دولياً.",
    "det.cannotModify": "لا يمكن حذفه أو تعديله",
    "det.byAnyParty": "من أي طرف",
    "det.documentLeaked": "تم تسريب الوثيقة",
    "det.photographedCopy": "تم اكتشاف نسخة مصوّرة خارج التوزيع المصرّح به",
    "det.fileTampered": "تنبيه: تم التلاعب بالملف",
    "det.contentAltered": "المحتوى تغيّر بعد التوزيع",
    "det.intactOriginal": "المحتوى سليم وأصلي",
    "det.notModified": "الملف لم يُعدَّل منذ التوزيع",
    "det.printReport": "طباعة التقرير الجنائي",
    "det.noFingerprints": "لا توجد بصمات",
    "det.notRegistered": "هذا الملف غير مسجل في النظام أو لا يحتوي على بصمات جنائية قابلة للكشف",
  },
  en: {
    "login": "Login",
    "logout": "Logout",
    "loading": "Loading...",
    
    "home.tryFree": "Get Started",
    "home.loading": "Redirecting to system...",
    "home.aboutUs": "About Us",
    "home.support": "Technical Support",
    "home.supportDesc": "Available 24/7 to assist you with any inquiry",
    "home.contact": "Contact Us",
    "home.email": "Email",
    "home.phone": "Phone",
    "home.footer": "2026 Spectra Trace. All Rights Reserved.",
    
    "about.title": "About Us",
    "about.back": "Back",
    "about.whatTitle": "What is Spectra-Trace?",
    "about.whatP1": "Spectra-Trace is a secure document distribution platform built for enterprise environments, designed to solve one of the most persistent challenges in modern cybersecurity tracking the exact source of an internal data leak.",
    "about.whatP2": "Every organization distributes sensitive documents daily. And every distributed document is a potential risk. Spectra-Trace was built to eliminate that risk entirely not by restricting access, but by ensuring that every file carries the identity of whoever received it.",
    "about.howTitle": "How It Works",
    "about.howP1": "Every time a file is downloaded through the platform, a unique forensic signature containing the recipient's identity, employee ID, and an exact timestamp is invisibly embedded into the file's structure using advanced steganographic algorithms.",
    "about.howP2": "The file looks completely identical to the original. It opens normally, prints normally, and shares normally. Yet beneath the surface, it carries an irrefutable forensic artifact that cannot be removed, replaced, or destroyed even if the document is edited, converted, or physically photographed with a smartphone.",
    "about.leakTitle": "When a Leak Happens",
    "about.leakP1": "If a sensitive file is ever discovered outside secure boundaries, the Forensic Extraction Module allows administrators to instantly analyze the suspicious file and extract the hidden signature revealing the exact source of the breach within seconds.",
    "about.leakP2": "The incident is automatically documented with a full forensic report, including the leaker's identity, IP address, and timestamp backed by tamper-proof legal evidence that holds up in court.",
    "about.final": "No AI. No guesswork. Just deterministic, mathematical certainty.",
    
    "nav.dashboard": "Main Dashboard",
    "nav.employees": "Employee Management",
    "nav.encrypt": "Document Encryption",
    "nav.detect": "Leak Detection",
    
    "dashboard.welcome": "Welcome",
    "dashboard.user": "User",
    "dashboard.protectedDocs": "Protected Documents",
    "dashboard.employees": "Employees",
    "dashboard.leaks": "Detected Leaks",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.noActivity": "No activity yet",
    
    "emp.title": "Employee Management",
    "emp.subtitle": "Database of authorized personnel with system access",
    "emp.add": "Add New Employee",
    "emp.cancel": "Cancel Operation",
    "emp.fullName": "Full Name",
    "emp.email": "Email",
    "emp.department": "Department",
    "emp.empNumber": "Employee Number",
    "emp.confirm": "Confirm Addition",
    "emp.saving": "Saving data...",
    "emp.loading": "Synchronizing forensic database...",
    "emp.noEmployees": "No employees registered yet",
    "emp.colName": "Name",
    "emp.colDept": "Department",
    "emp.colNumber": "Employee Number",
    "emp.colActions": "Actions",
    "emp.uncategorized": "Uncategorized",
    "emp.delete": "Delete",
    "emp.confirmDelete": "Are you sure you want to delete employee",
    
    "enc.title": "Encrypt Document",
    "enc.subtitle": "Supports PDF, Word, and Excel files",
    "enc.upload": "Upload Document",
    "enc.dragOrSelect": "Drag or select file",
    "enc.recipients": "Recipients",
    "enc.selectAll": "Select All",
    "enc.deselectAll": "Deselect All",
    "enc.encrypting": "Encrypting",
    "enc.encryptBtn": "Encrypt & Generate Copies",
    "enc.empCount": "employee(s)",
    "enc.success": "Encryption Successful",
    "enc.copiesGenerated": "Generated",
    "enc.copies": "protected copies",
    "enc.download": "Download",
    "enc.encryptAnother": "Encrypt Another Document",
    
    "det.title": "Leak Detection & Forensic Investigation",
    "det.subtitle": "Upload the document or image to analyze fingerprints and verify content integrity",
    "det.upload": "Upload the document or image to be examined",
    "det.analyze": "Analyzing...",
    "det.detectBtn": "Detect Leaker",
    "det.breachDetected": "Security Breach Detected",
    "det.documentVerified": "Document Verified",
    "det.confidence": "Confidence",
    "det.identifiedLeaker": "Identified Leaker",
    "det.documentRecipient": "Document Recipient",
    "det.department": "Department",
    "det.notSpecified": "Not specified",
    "det.documentDetails": "Document Details",
    "det.filename": "Filename",
    "det.encryptionDate": "Encryption Date",
    "det.distributionDate": "Distribution Date",
    "det.forensicEvidence": "Digital Forensic Evidence",
    "det.empName": "Employee Name",
    "det.empNumber": "Employee Number",
    "det.email": "Email",
    "det.ipAddress": "IP Address",
    "det.incidentHash": "Incident Hash",
    "det.legalEvidence": "This record cannot be deleted or modified by any party. Valid as internationally recognized legal evidence.",
    "det.cannotModify": "cannot be deleted or modified",
    "det.byAnyParty": "by any party",
    "det.documentLeaked": "Document Leaked",
    "det.photographedCopy": "Photographed copy detected outside authorized distribution",
    "det.fileTampered": "Alert: File Tampered",
    "det.contentAltered": "Content was altered after distribution",
    "det.intactOriginal": "Document is Intact and Original",
    "det.notModified": "File has not been modified since distribution",
    "det.printReport": "Print Forensic Report",
    "det.noFingerprints": "No Fingerprints Found",
    "det.notRegistered": "This file is not registered in the system or contains no detectable forensic fingerprints",
  },
}

const LangContext = createContext<LangContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar")

  useEffect(() => {
    const saved = localStorage.getItem("spectra-lang") as Lang | null
    if (saved === "ar" || saved === "en") {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem("spectra-lang", newLang)
  }

  const t = (key: string): string => {
    return (translations[lang] as any)[key] || key
  }

  const isRTL = lang === "ar"

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error("useLang must be used within LanguageProvider")
  return ctx
}