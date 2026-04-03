// ─── Post metadata registry ──────────────────────────────────────────────────
// Minimal post metadata used by author pages and post listings.
// This is the single source of truth for post titles/descriptions.

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  tag: string;
}

export const BLOG_POSTS: BlogPostMeta[] = [
  // ─── Tech/Engineering ───────────────────────────────────────────────────────
  {
    slug: 'what-is-rag-retrieval-augmented-generation',
    title: 'What Is RAG? Retrieval-Augmented Generation Explained',
    description:
      'RAG (Retrieval-Augmented Generation) is the technique behind knowledge base chatbots. Learn how it works, why it matters, and how it reduces hallucinations.',
    tag: 'Explainer',
  },
  {
    slug: 'what-are-embeddings-explained-simply',
    title: 'What Are Embeddings? A Simple Explanation',
    description:
      'Embeddings turn text into numbers that capture meaning. Learn how AI chatbots use embeddings to find relevant answers.',
    tag: 'Explainer',
  },
  {
    slug: 'what-is-vector-search',
    title: 'What Is Vector Search? How AI Chatbots Find Answers',
    description:
      'Vector search finds content by meaning, not keywords. Learn how AI chatbots use vector search to find the most relevant answers.',
    tag: 'Explainer',
  },
  {
    slug: 'what-is-conversational-ai',
    title: "What Is Conversational AI? A Beginner's Guide",
    description:
      'Conversational AI lets machines understand and respond to human language naturally. Learn what it is and how businesses use it.',
    tag: 'Explainer',
  },
  {
    slug: 'what-is-prompt-engineering',
    title: 'What Is Prompt Engineering? A Practical Introduction',
    description:
      'Prompt engineering is the art of writing instructions that get better results from AI. Learn the basics.',
    tag: 'Explainer',
  },
  {
    slug: 'what-is-a-system-prompt',
    title: 'What Is a System Prompt?',
    description:
      'A system prompt tells an AI how to behave. Learn what system prompts are and how to write effective ones for chatbots.',
    tag: 'Explainer',
  },
  {
    slug: 'how-ai-chatbots-understand-questions',
    title: 'How AI Chatbots Understand Your Questions',
    description:
      "AI chatbots don't just match keywords -- they understand meaning. Learn how NLP, embeddings, and LLMs work together.",
    tag: 'Explainer',
  },
  {
    slug: 'ai-hallucination-what-it-is-how-to-prevent-it',
    title: 'AI Hallucination: What It Is and How to Prevent It',
    description:
      'AI hallucination is when a chatbot generates confident but incorrect answers. Learn why it happens and how to prevent it.',
    tag: 'Explainer',
  },
  {
    slug: 'how-to-write-chatbot-system-prompt',
    title: 'How to Write a Chatbot System Prompt That Actually Works',
    description:
      "Your chatbot's system prompt controls its personality, accuracy, and boundaries. Learn how to write one that works.",
    tag: 'Guide',
  },
  {
    slug: 'how-to-improve-chatbot-accuracy',
    title: "How to Improve Your Chatbot's Answer Accuracy",
    description:
      'Getting vague or wrong answers from your chatbot? Practical steps to improve accuracy.',
    tag: 'Guide',
  },
  {
    slug: 'how-to-train-chatbot-on-your-own-data',
    title: 'How to Train a Chatbot on Your Own Data',
    description:
      'Train an AI chatbot on your own PDFs, URLs, and documents -- no ML experience needed.',
    tag: 'Guide',
  },
  {
    slug: 'what-is-a-chatbot-widget',
    title: 'What Is a Chatbot Widget and How Does It Work?',
    description:
      'A chatbot widget is a small chat interface embedded on your website. Learn how it works and how to add one.',
    tag: 'Explainer',
  },
  // ─── Growth/Marketing ───────────────────────────────────────────────────────
  {
    slug: 'chatbot-lead-generation-strategies',
    title: '7 Chatbot Lead Generation Strategies That Work',
    description:
      'Seven proven strategies for using AI chatbots to capture leads, qualify prospects, and fill your sales pipeline.',
    tag: 'Strategy',
  },
  {
    slug: 'chatbot-conversion-rate-optimization',
    title: 'How Chatbots Improve Website Conversion Rates',
    description:
      'AI chatbots improve website conversion rates by engaging visitors, answering objections, and guiding prospects toward action.',
    tag: 'Strategy',
  },
  {
    slug: 'chatbot-analytics-what-to-track',
    title: 'Chatbot Analytics: What to Track and Why It Matters',
    description:
      'Track the right chatbot metrics to improve performance. Learn which analytics matter.',
    tag: 'Best Practice',
  },
  {
    slug: 'how-to-measure-chatbot-roi',
    title: 'How to Measure Chatbot ROI for Your Business',
    description:
      'Learn how to calculate the return on investment of your AI chatbot.',
    tag: 'Guide',
  },
  {
    slug: 'cost-of-customer-support-without-ai',
    title: 'The Hidden Cost of Customer Support Without AI',
    description:
      'Manual customer support costs more than you think. Calculate the hidden expenses.',
    tag: 'Strategy',
  },
  {
    slug: 'ai-customer-service-statistics',
    title: '15 AI Customer Service Statistics Every Business Should Know',
    description:
      'Key statistics on AI in customer service: adoption rates, cost savings, and ROI.',
    tag: 'Strategy',
  },
  {
    slug: 'small-business-ai-automation-guide',
    title: 'The Small Business Guide to AI Automation in 2025',
    description:
      'A practical guide to AI automation for small businesses -- what to automate first and how to start.',
    tag: 'Strategy',
  },
  {
    slug: 'reduce-employee-onboarding-time-with-ai',
    title: 'Reduce Employee Onboarding Time with an AI Knowledge Bot',
    description:
      'An AI knowledge bot trained on your internal docs cuts onboarding time and frees up managers.',
    tag: 'Strategy',
  },
  {
    slug: 'ai-chatbot-for-after-hours-support',
    title: 'Why Your Business Needs an After-Hours AI Chatbot',
    description:
      'Most customer questions happen outside business hours. An AI chatbot answers them instantly.',
    tag: 'Strategy',
  },
  {
    slug: 'chatbot-best-practices-for-small-business',
    title: 'Chatbot Best Practices for Small Business Owners',
    description:
      'Nine practical chatbot best practices for small businesses.',
    tag: 'Best Practice',
  },
  {
    slug: 'automate-repetitive-customer-questions',
    title: 'How to Automate Repetitive Customer Questions',
    description:
      'Automate the questions your team answers over and over with an AI chatbot.',
    tag: 'Strategy',
  },
  // ─── Product/Practitioner ───────────────────────────────────────────────────
  {
    slug: 'how-to-add-chatbot-to-website',
    title: 'How to Add a Chatbot to Your Website (No Coding Required)',
    description:
      'Learn how to add a chatbot to your website in minutes -- no coding required.',
    tag: 'Guide',
  },
  {
    slug: 'how-to-create-faq-chatbot',
    title: 'How to Create an FAQ Chatbot in Minutes',
    description:
      'Learn how to create an FAQ chatbot that answers common customer questions instantly.',
    tag: 'Guide',
  },
  {
    slug: 'how-to-build-internal-knowledge-bot',
    title: 'How to Build an Internal Knowledge Bot for Your Team',
    description:
      'Build an internal knowledge bot that lets your team find answers instantly.',
    tag: 'Guide',
  },
  {
    slug: 'how-to-embed-chatbot-in-wordpress',
    title: 'How to Embed a Chatbot in WordPress',
    description:
      'Add an AI chatbot to your WordPress site in under 5 minutes.',
    tag: 'Guide',
  },
  {
    slug: 'how-to-embed-chatbot-in-shopify',
    title: 'How to Embed a Chatbot in Shopify',
    description:
      'Add an AI chatbot to your Shopify store to answer product questions and shipping inquiries.',
    tag: 'Guide',
  },
  {
    slug: 'how-to-embed-chatbot-in-squarespace',
    title: 'How to Embed a Chatbot in Squarespace',
    description:
      'Add an AI chatbot to your Squarespace website using a simple code injection.',
    tag: 'Guide',
  },
  {
    slug: 'how-to-embed-chatbot-in-wix',
    title: 'How to Embed a Chatbot in Wix',
    description:
      'Embed an AI chatbot on your Wix website in minutes.',
    tag: 'Guide',
  },
  {
    slug: 'how-to-set-up-slack-chatbot-for-team',
    title: 'How to Set Up a Slack Chatbot for Your Team',
    description:
      'Deploy an AI chatbot in Slack that answers team questions from your internal docs.',
    tag: 'Guide',
  },
  {
    slug: 'chatbot-personality-and-tone-guide',
    title: 'How to Choose the Right Personality and Tone for Your Chatbot',
    description:
      "Your chatbot's personality affects how customers perceive your brand. Learn how to define the right tone.",
    tag: 'Best Practice',
  },
  {
    slug: 'chatbot-security-and-privacy-guide',
    title: 'Chatbot Security and Privacy: What Business Owners Need to Know',
    description:
      'Understand the security and privacy considerations for business chatbots.',
    tag: 'Best Practice',
  },
  {
    slug: 'knowledge-base-content-best-practices',
    title: 'How to Organize Your Knowledge Base for Better Chatbot Answers',
    description:
      'The quality of your chatbot answers depends on how you organize your knowledge base.',
    tag: 'Best Practice',
  },
  {
    slug: 'what-is-a-knowledge-base-chatbot',
    title: 'What Is a Knowledge Base Chatbot?',
    description:
      'A knowledge base chatbot is an AI trained on your own documents to answer questions instantly.',
    tag: 'Explainer',
  },
  {
    slug: 'chatbot-vs-virtual-assistant',
    title: "Chatbot vs Virtual Assistant: What's the Difference?",
    description:
      'Chatbots and virtual assistants are often confused. Learn the key differences.',
    tag: 'Explainer',
  },
  {
    slug: 'chatbot-for-restaurants',
    title: 'AI Chatbots for Restaurants: Answer Menus, Hours, and Reservations',
    description:
      'AI chatbots help restaurants answer questions about menus, hours, and reservations.',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-education',
    title: 'AI Chatbots for Education: Automate Student FAQs',
    description:
      'Universities and course platforms use AI chatbots to answer student questions around the clock.',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-financial-services',
    title: 'AI Chatbots for Financial Services and Advisors',
    description:
      'Financial advisors use AI chatbots to answer client questions about services and fees.',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-recruitment',
    title: 'How Recruiters Use AI Chatbots to Screen Candidates Faster',
    description:
      'Recruitment teams use AI chatbots to answer candidate questions and pre-screen applicants.',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-nonprofits',
    title: 'AI Chatbots for Nonprofits: Engage Donors and Volunteers',
    description:
      'Nonprofits use AI chatbots to answer donor questions and recruit volunteers.',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-insurance',
    title: 'AI Chatbots for Insurance: Automate Policy Questions',
    description:
      'Insurance agencies use AI chatbots to answer policy questions and qualify leads.',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-travel-agencies',
    title: 'AI Chatbots for Travel Agencies: Answer Booking Questions 24/7',
    description:
      'Travel agencies use AI chatbots to answer destination questions and capture leads.',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-fitness-studios',
    title: 'AI Chatbots for Gyms and Fitness Studios',
    description:
      'Gyms and fitness studios use AI chatbots to answer membership questions and share schedules.',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-accounting-firms',
    title: 'AI Chatbots for Accounting Firms: Client Self-Service',
    description:
      'Accounting firms use AI chatbots to answer client questions about services and deadlines.',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-saas-onboarding',
    title: 'How SaaS Companies Use Chatbots to Improve Onboarding',
    description:
      'SaaS companies use AI chatbots to guide new users through onboarding.',
    tag: 'Use Case',
  },
  {
    slug: 'chatbot-for-lead-qualification',
    title: 'How to Use a Chatbot for Lead Qualification',
    description:
      'Use AI chatbots to qualify leads automatically by asking the right questions.',
    tag: 'Use Case',
  },
  // ─── Will Cooke (Founder) ───────────────────────────────────────────────────
  {
    slug: 'chatbase-alternatives',
    title: 'Top Chatbase Alternatives Worth Trying in 2026',
    description:
      'Looking for a Chatbase alternative? Compare the top AI chatbot builders on pricing, knowledge base support, and more.',
    tag: 'Comparison',
  },
  {
    slug: 'tidio-alternatives',
    title: '5 Tidio Alternatives for AI-Powered Customer Chat',
    description:
      'Looking for a Tidio alternative? Compare five AI-powered chat platforms on pricing and features.',
    tag: 'Comparison',
  },
  {
    slug: 'intercom-alternatives',
    title: "Intercom Alternatives That Won't Break the Budget",
    description:
      'Intercom is powerful but expensive. Here are affordable alternatives with AI chatbot features.',
    tag: 'Comparison',
  },
  {
    slug: 'drift-alternatives',
    title: '5 Drift Alternatives for Conversational Marketing',
    description:
      "Drift changed the conversational marketing game, but it's not the only option. Compare five alternatives.",
    tag: 'Comparison',
  },
  {
    slug: 'zendesk-chat-alternatives',
    title: '5 Zendesk Chat Alternatives Worth Considering',
    description:
      'Zendesk Chat is reliable but complex. Here are five simpler alternatives with AI chatbot features.',
    tag: 'Comparison',
  },
  {
    slug: 'freshchat-alternatives',
    title: '5 Freshchat Alternatives for Small Business Support',
    description:
      'Freshchat works best within the Freshworks ecosystem. Here are five standalone alternatives.',
    tag: 'Comparison',
  },
  {
    slug: 'ai-chatbot-vs-live-chat',
    title: 'AI Chatbot vs Live Chat: Which Is Right for Your Business?',
    description:
      'Comparing AI chatbots and live chat: cost, availability, scalability, and customer satisfaction.',
    tag: 'Strategy',
  },
  {
    slug: 'how-to-reduce-customer-support-tickets',
    title: 'How to Reduce Customer Support Tickets with AI',
    description:
      'Cut support ticket volume by up to 40% with an AI chatbot that answers questions instantly.',
    tag: 'Strategy',
  },
];

/** Look up a post by slug */
export function getPostBySlug(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
