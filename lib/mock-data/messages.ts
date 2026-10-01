import type { Message } from "@/types";

/** Messages between the demo user (usr-01) and the people in `conversations`. */
export const messages: Message[] = [
  // conv-01 — ياسين مرابط (متطوع) · حملة التشجير
  {
    id: "msg-01",
    conversationId: "conv-01",
    senderId: "usr-02",
    content: "أهلًا أستاذة أمينة، أنا جاهز للمشاركة في أيام الغرس القادمة.",
    createdAt: "2026-09-28T17:20:00.000Z",
    readAt: "2026-09-28T18:00:00.000Z",
  },
  {
    id: "msg-02",
    conversationId: "conv-01",
    senderId: "usr-01",
    content: "وعليكم السلام يا ياسين، يسعدنا انضمامك إلى الفريق. سنرسل لك تفاصيل الأيام قريبًا.",
    createdAt: "2026-09-28T18:15:00.000Z",
    readAt: "2026-09-28T19:00:00.000Z",
  },
  {
    id: "msg-03",
    conversationId: "conv-01",
    senderId: "usr-02",
    content: "السلام عليكم، متى تبدأ أنشطة المبادرة؟",
    createdAt: "2026-09-30T08:10:00.000Z",
  },

  // conv-02 — سارة بن يوسف (خبيرة) · حملة التشجير
  {
    id: "msg-05",
    conversationId: "conv-02",
    senderId: "usr-03",
    content: "مرحبًا أمينة، أعددت قائمة بالأنواع المحلية المناسبة للغرس في الأحياء: الزيتون والخروب والصنوبر الحلبي.",
    createdAt: "2026-09-26T11:00:00.000Z",
    readAt: "2026-09-26T12:00:00.000Z",
  },
  {
    id: "msg-06",
    conversationId: "conv-02",
    senderId: "usr-01",
    content: "ممتاز يا سارة، هل يمكنك مشاركتها مع الفريق قبل اجتماع الخميس؟",
    createdAt: "2026-09-26T13:15:00.000Z",
    readAt: "2026-09-26T14:00:00.000Z",
  },
  {
    id: "msg-07",
    conversationId: "conv-02",
    senderId: "usr-03",
    content: "بالتأكيد، سأرسلها غدًا صباحًا.",
    createdAt: "2026-09-27T10:30:00.000Z",
    readAt: "2026-09-27T11:00:00.000Z",
  },

  // conv-03 — محمد الأمين قاسمي (منظم) · تنظيف وترميم واحات الوادي
  {
    id: "msg-08",
    conversationId: "conv-03",
    senderId: "usr-06",
    content: "أهلًا أمينة، هل يناسبك الحضور يوم السبت القادم لجلسة استشارة حول ترميم الواحات؟",
    createdAt: "2026-09-29T14:00:00.000Z",
  },
  {
    id: "msg-09",
    conversationId: "conv-03",
    senderId: "usr-06",
    content: "نحتاج رأيك في اختيار المواقع ذات الأولوية.",
    createdAt: "2026-09-29T14:05:00.000Z",
  },

  // conv-04 — خديجة عمراني (شريكة) · حملة التشجير
  {
    id: "msg-10",
    conversationId: "conv-04",
    senderId: "usr-01",
    content: "مرحبًا خديجة، هل تأكدت جمعيتكم من عدد الشتلات التي يمكنها توفيرها؟",
    createdAt: "2026-09-25T15:00:00.000Z",
    readAt: "2026-09-25T15:30:00.000Z",
  },
  {
    id: "msg-11",
    conversationId: "conv-04",
    senderId: "usr-05",
    content: "نعم، يمكننا توفير 150 شتلة بداية من الأسبوع المقبل.",
    createdAt: "2026-09-25T17:45:00.000Z",
    readAt: "2026-09-25T18:10:00.000Z",
  },

  // conv-05 — توفيق بن عيسى (داعم) · حملة التشجير
  {
    id: "msg-12",
    conversationId: "conv-05",
    senderId: "usr-10",
    content: "السلام عليكم، أرسلت طلبًا للانضمام كداعم، وأودّ توضيح نوع الدعم الذي أستطيع تقديمه.",
    createdAt: "2026-09-24T10:30:00.000Z",
    readAt: "2026-09-24T11:00:00.000Z",
  },
  {
    id: "msg-13",
    conversationId: "conv-05",
    senderId: "usr-01",
    content: "أهلًا توفيق، شكرًا على اهتمامك. سنراجع طلبك ونعود إليك خلال أيام.",
    createdAt: "2026-09-24T14:20:00.000Z",
    readAt: "2026-09-24T15:00:00.000Z",
  },

  // conv-06 — عبد النور شريف · بلا مبادرة
  {
    id: "msg-14",
    conversationId: "conv-06",
    senderId: "usr-04",
    content: "مرحبًا أمينة، سررت بلقائك في ملتقى المبادرات الشبابية بسطيف.",
    createdAt: "2026-09-20T19:00:00.000Z",
    readAt: "2026-09-20T19:20:00.000Z",
  },
  {
    id: "msg-15",
    conversationId: "conv-06",
    senderId: "usr-01",
    content: "وأنا أيضًا، شكرًا على الدعوة. لنتواصل قريبًا حول فرص التعاون.",
    createdAt: "2026-09-20T19:40:00.000Z",
    readAt: "2026-09-20T20:00:00.000Z",
  },
];
