---
title: Knowledge Base Guide
description: Learn how to build and manage your chatbot's knowledge base with URLs, text, and Q&A sources
category: chatbot-features
order: 5
---

# Knowledge Base Guide

Your chatbot's knowledge base determines what it can answer. This guide covers how to add, manage, and optimize your knowledge sources for the best results.

## How It Works

When a visitor asks a question, the chatbot:

1. Converts the question into a vector embedding
2. Searches your knowledge base for the most relevant text chunks
3. Uses those chunks as context to generate an accurate answer

This is called **Retrieval-Augmented Generation (RAG)** — the chatbot retrieves relevant information before generating a response, ensuring answers are grounded in your actual content.

## Source Types

### URL Sources

Best for importing existing web content like documentation, FAQ pages, and blog posts.

- **Single URL** — Imports the content of one specific page
- **Crawl mode** — Follows links on the page to import multiple related pages
  - Set a **max pages** limit to control how many pages are crawled
  - Only follows links within the same domain

**Tips for URL sources:**
- Use your sitemap or docs index page as the starting URL when crawling
- Pages behind authentication cannot be imported — use Text mode instead
- PDF and DOCX files linked on the page will also be processed

### Text Sources

Best for content that isn't published on the web, such as internal docs, product specs, or custom content.

- Paste or type content directly into the text editor
- Supports long-form content — it will be automatically chunked
- Great for adding company policies, product details, or support scripts

### Q&A Sources

Best for precise control over specific question-answer pairs.

- Define exact questions and their ideal answers
- Perfect for frequently asked questions where you want a specific response
- Q&A pairs are given higher relevance during retrieval

## Knowledge Processing

When you add a source, the system:

1. **Extracts** text content from the source (HTML parsing, PDF extraction, etc.)
2. **Chunks** the text into smaller, overlapping segments (~500 tokens each)
3. **Embeds** each chunk using OpenAI's embedding model
4. **Stores** the vectors in the database for similarity search

### Processing Status

| Status | Meaning |
|--------|---------|
| **Pending** | Queued for processing |
| **Processing** | Currently being extracted and embedded |
| **Success** | Ready to use — chunks are searchable |
| **Failed** | An error occurred — check the error message and retry |

## Best Practices

### Content Quality

- **Be specific** — Detailed, well-structured content produces better answers
- **Keep it current** — Re-process URL sources periodically to pick up content changes
- **Avoid duplication** — Adding the same content twice doesn't improve quality and wastes storage
- **Structure matters** — Content with clear headings and sections chunks more effectively

### Coverage

- Start with your most frequently asked questions
- Add product/service pages, pricing, and policies
- Include troubleshooting guides and how-to content
- Add Q&A pairs for questions the chatbot struggles with

### Chunk Count

The number of chunks created depends on content length:

- A typical FAQ page → 5-15 chunks
- A full documentation site → 50-200+ chunks
- The more chunks, the broader the chatbot's knowledge

## Managing Sources

### Re-processing

If your source content has changed (e.g., you updated a webpage), you can re-process it:

1. Find the source in your Knowledge Base list
2. Click the **refresh** icon
3. The system will re-extract, re-chunk, and re-embed the content

### Deleting Sources

Deleting a knowledge source permanently removes all its chunks from the database. The chatbot will immediately stop using that content in responses.

## Troubleshooting

**"The chatbot doesn't know about X"**
- Check that the relevant content is in a knowledge source with **Success** status
- The content may be there but chunked in a way that doesn't match the question — try adding a Q&A pair for that specific question

**"URL source failed to process"**
- The page may require JavaScript to render — try using Text mode and pasting the content manually
- The page may be behind authentication or a paywall
- Check that the URL is accessible from the internet

**"Answers are inaccurate"**
- Review the knowledge sources for outdated or incorrect information
- Add Q&A pairs to override incorrect responses for specific questions
- Adjust the system prompt to tell the chatbot how to handle uncertainty
