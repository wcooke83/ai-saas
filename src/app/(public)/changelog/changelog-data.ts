export type BadgeType = 'New' | 'Improved' | 'Fix';

export interface ChangelogEntry {
  badge: BadgeType;
  title: string;
  detail: string;
}

export interface ChangelogMonth {
  month: string;
  entries: ChangelogEntry[];
}

export const changelog: ChangelogMonth[] = [
  {
    month: 'April 2026',
    entries: [
      {
        badge: 'New',
        title: 'Industry Landing Pages',
        detail:
          '56 industry-specific landing pages with tailored use cases, structured FAQs, and links to related guides — so visitors can see exactly how VocUI fits their business.',
      },
      {
        badge: 'New',
        title: 'Password Reset Flow',
        detail:
          'Reset your password from the login page with a secure email link. No more support tickets for locked-out accounts.',
      },
      {
        badge: 'Improved',
        title: 'Blog Visual Overhaul',
        detail:
          'Infographics, charts, and diagrams added across the blog. Key concepts are now easier to scan and understand at a glance.',
      },
    ],
  },
  {
    month: 'March 2026',
    entries: [
      {
        badge: 'New',
        title: 'Proactive Messaging',
        detail:
          'Trigger chatbot messages automatically based on visitor behavior. Configure up to 8 trigger types including scroll depth, time on page, exit intent, and URL match.',
      },
      {
        badge: 'New',
        title: 'Sentiment & Loyalty Scoring',
        detail:
          'Every conversation is now scored for sentiment and loyalty in real time. Flag high-risk conversations and identify your most engaged visitors automatically.',
      },
      {
        badge: 'Improved',
        title: 'Knowledge Source Management',
        detail:
          'Re-scrape URLs on demand, replace uploaded files without deleting and re-adding sources, and see per-source status in the dashboard.',
      },
    ],
  },
  {
    month: 'February 2026',
    entries: [
      {
        badge: 'New',
        title: 'Live Agent Handoff Console',
        detail:
          'Agents now have a dedicated console to take over chatbot conversations. Full conversation context is visible from the moment of handoff.',
      },
      {
        badge: 'New',
        title: 'Telegram Deployment',
        detail:
          'Deploy your trained chatbot to a Telegram bot. Same knowledge base, new channel — configured from your deploy dashboard.',
      },
      {
        badge: 'Improved',
        title: 'Multi-language Support',
        detail:
          "Expanded automatic language detection to 20+ languages. Your chatbot now responds in the visitor's language without any configuration.",
      },
    ],
  },
  {
    month: 'January 2026',
    entries: [
      {
        badge: 'New',
        title: 'In-Chat Appointment Booking',
        detail:
          'Connect to Easy!Appointments to let visitors check availability and book appointments directly in the chat window — no redirect required.',
      },
      {
        badge: 'New',
        title: 'Lead Capture & Surveys',
        detail:
          'Collect visitor contact information and run NPS or custom surveys inside any conversation flow.',
      },
      {
        badge: 'Improved',
        title: 'Widget Customization',
        detail:
          'Full control over chatbot widget appearance: colors, position, avatar, launcher icon, and welcome message.',
      },
    ],
  },
  {
    month: 'December 2025',
    entries: [
      {
        badge: 'New',
        title: 'Slack Integration',
        detail:
          'Deploy your knowledge base chatbot to any Slack workspace. Answer team questions from the same content that powers your website chatbot.',
      },
      {
        badge: 'New',
        title: 'REST API & SDK',
        detail:
          'Full REST API for custom integrations. Embed the agent console in your own app using the JavaScript SDK.',
      },
      {
        badge: 'Improved',
        title: 'PDF & DOCX Support',
        detail:
          'Improved text extraction from complex PDFs and Word documents, including multi-column layouts and embedded tables.',
      },
    ],
  },
  {
    month: 'November 2025',
    entries: [
      {
        badge: 'New',
        title: 'Q&A Pairs',
        detail:
          "Add manual question-and-answer pairs directly to any knowledge base. Fill gaps your documents don't cover with precise, authored responses.",
      },
      {
        badge: 'Improved',
        title: 'Knowledge Processing',
        detail:
          'Faster knowledge source processing and more accurate answer matching for better chatbot response quality.',
      },
      {
        badge: 'Fix',
        title: 'Session Continuity',
        detail:
          'Fixed an issue where returning visitors occasionally started a new session instead of continuing their previous conversation.',
      },
    ],
  },
];

export const entryLinks: Record<string, string> = {
  'Industry Landing Pages': '/industries',
  'Slack Integration': '/slack-chatbot',
  'Proactive Messaging': '/chatbot-for-customer-support',
  'In-Chat Appointment Booking': '/chatbot-booking',
};
