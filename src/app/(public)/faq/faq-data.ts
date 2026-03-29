import {
  CreditCard,
  Key,
  Sparkles,
  Shield,
  Users,
  RefreshCw,
  LucideIcon,
} from 'lucide-react';

export interface FaqQuestion {
  id: string;
  question: string;
  answer: string;
  popular?: boolean;
}

export interface FaqCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  questions: FaqQuestion[];
}

export const faqCategories: FaqCategory[] = [
  {
    id: 'credits',
    title: 'Credits & Usage',
    icon: Sparkles,
    questions: [
      {
        id: 'credits-what',
        question: 'What are credits?',
        answer: 'Credits are consumed each time your chatbot answers a question or processes a knowledge source. A simple one-line answer uses ~1 credit. A detailed multi-paragraph response uses 2–3 credits. A back-and-forth conversation of 10 messages typically uses 5–15 credits total.',
        popular: true,
      },
      {
        id: 'credits-balance',
        question: 'How do I check my credit balance?',
        answer: "You can view your current credit balance and usage history in your Dashboard under the Usage tab. This shows your remaining credits, when they reset, and a breakdown of how you've used them.",
      },
      {
        id: 'credits-rollover',
        question: 'Do unused credits roll over?',
        answer: 'No, credits reset at the beginning of each billing period. We recommend using your credits before your renewal date to get the most value from your subscription.',
      },
      {
        id: 'credits-empty',
        question: 'What happens if I run out of credits?',
        answer: "You can purchase additional credits anytime, enable auto-topup to never run out, or upgrade for a higher monthly allocation. Enterprise customers have unlimited credits.",
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & Subscriptions',
    icon: CreditCard,
    questions: [
      {
        id: 'billing-how',
        question: 'How does billing work?',
        answer: 'We offer monthly and annual subscription plans. Your payment method is charged at the start of each billing period. Annual plans offer a discount compared to monthly billing.',
      },
      {
        id: 'billing-cancel',
        question: 'Can I cancel my subscription?',
        answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.',
        popular: true,
      },
      {
        id: 'billing-refunds',
        question: 'Do you offer refunds?',
        answer: "We offer a 14-day money-back guarantee. If you're not satisfied, contact support within 14 days of your initial purchase for a full refund.",
      },
      {
        id: 'billing-change',
        question: 'Can I change my plan?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at your next billing cycle.',
      },
    ],
  },
  {
    id: 'api',
    title: 'API & Integration',
    icon: Key,
    questions: [
      {
        id: 'api-key',
        question: 'How do I get an API key?',
        answer: 'API keys can be generated from your Dashboard under the API Keys section. Free plans get 2 API keys, while Pro and Enterprise plans get unlimited keys.',
        popular: true,
      },
      {
        id: 'api-limits',
        question: 'What are the API rate limits?',
        answer: 'Rate limits vary by plan. Free: 10 requests/minute, Pro: 60 requests/minute, Enterprise: Custom limits. If you need higher limits, contact us about an Enterprise plan.',
      },
      {
        id: 'api-docs',
        question: 'Is there API documentation?',
        answer: 'Yes, comprehensive API documentation is available in the SDK section. It includes endpoint references, code examples, and best practices for integration.',
      },
      {
        id: 'api-production',
        question: 'Can I use the API in production?',
        answer: 'Absolutely. Our API is production-ready with 99.9% uptime SLA for Pro and Enterprise customers. We recommend using environment variables for API keys and implementing proper error handling.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: Shield,
    questions: [
      {
        id: 'security-data',
        question: 'How is my data protected?',
        answer: 'We use industry-standard encryption (TLS 1.3) for data in transit and AES-256 for data at rest. Your data is stored in secure data centers with strict access controls.',
      },
      {
        id: 'security-training',
        question: 'Do you train AI models on my data?',
        answer: 'No, we do not use your input data or generated content to train our AI models. Your data remains private and is only used to provide the service you request.',
      },
      {
        id: 'security-delete',
        question: 'Can I delete my data?',
        answer: 'Yes, you can delete your generation history at any time from your Dashboard. For complete account deletion including all associated data, contact support.',
      },
      {
        id: 'security-gdpr',
        question: 'Are you GDPR compliant?',
        answer: 'Yes, we are fully GDPR compliant. You have the right to access, rectify, and delete your personal data. See our Privacy Policy for more details.',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    icon: RefreshCw,
    questions: [
      {
        id: 'tools-available',
        question: 'What tools are available?',
        answer: 'VocUI lets you build AI chatbots trained on your own content. Import your website, documents, or FAQs and deploy via embed widget, Slack, or Telegram.',
        popular: true,
      },
      {
        id: 'tools-accuracy',
        question: 'How accurate is the AI-generated content?',
        answer: 'Our AI generates high-quality content, but we recommend reviewing and editing all outputs before use. The AI may occasionally make errors or generate content that needs refinement.',
      },
      {
        id: 'tools-customize',
        question: 'Can I customize the AI output?',
        answer: 'Yes, all our tools offer customization options including tone, length, and specific instructions. Pro users also get access to advanced customization features.',
      },
      {
        id: 'tools-export',
        question: 'What integrations are available?',
        answer: 'You can deploy chatbots via an embeddable web widget, Slack, or Telegram. API access is available for custom integrations.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & Support',
    icon: Users,
    questions: [
      {
        id: 'account-password',
        question: 'How do I reset my password?',
        answer: "Click \"Forgot password\" on the login page and enter your email. You'll receive a link to reset your password. For security, this link expires after 24 hours.",
      },
      {
        id: 'account-team',
        question: 'Can I have multiple users on one account?',
        answer: 'Enterprise plans support multiple team members with role-based access control. Contact sales to learn more about team features.',
      },
      {
        id: 'account-support',
        question: 'How do I contact support?',
        answer: 'You can reach our support team through the Help page, by emailing support@vocui.com, or using the in-app chat (Pro and Enterprise only).',
      },
      {
        id: 'account-hours',
        question: 'What are your support hours?',
        answer: 'Email support is available 24/7 with responses within 24 hours. Enterprise customers get priority support with 4-hour response times during business hours.',
      },
    ],
  },
];

// Popular question IDs for the quick-access section
export const popularQuestionIds = [
  'credits-what',
  'billing-cancel',
  'api-key',
  'tools-available',
];

// Helper to get all questions flat
export function getAllQuestions(): (FaqQuestion & { categoryId: string; categoryTitle: string })[] {
  return faqCategories.flatMap((category) =>
    category.questions.map((q) => ({
      ...q,
      categoryId: category.id,
      categoryTitle: category.title,
    }))
  );
}

// Helper to get popular questions
export function getPopularQuestions(): (FaqQuestion & { categoryId: string; categoryTitle: string; icon: LucideIcon })[] {
  const allQuestions = getAllQuestions();
  return popularQuestionIds
    .map((id) => {
      const question = allQuestions.find((q) => q.id === id);
      if (!question) return null;
      const category = faqCategories.find((c) => c.id === question.categoryId);
      return {
        ...question,
        icon: category?.icon || Sparkles,
      };
    })
    .filter((q): q is NonNullable<typeof q> => q !== null);
}
