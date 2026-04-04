export interface PostmarkInboundPayload {
  From: string;
  FromName: string;
  To: string;
  ToFull: Array<{ Email: string; Name: string; MailboxHash: string }>;
  MailboxHash: string;        // The chatbot UUID
  Subject: string;
  TextBody: string;
  HtmlBody: string;
  StrippedTextReply: string;  // Postmark strips quoted text — best for AI
  MessageID: string;          // Unique ID for this message (no angle brackets)
  ReplyTo: string;
  Headers: Array<{ Name: string; Value: string }>;
  Tag: string;
  Date: string;
}
