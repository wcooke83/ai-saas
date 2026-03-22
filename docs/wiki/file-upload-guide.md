---
title: File Uploads in Chat
description: Learn how to enable and configure file uploads so visitors can share images, documents, and other files during conversations
category: chatbot-features
order: 12
---

# File Uploads in Chat

Let visitors share files directly in the chat widget during a conversation.

## Overview

When file uploads are enabled, visitors see a paperclip/attachment button in the chat input area. They can attach images, documents, spreadsheets, or archives alongside their message. This is useful for sharing screenshots of issues, uploading documents for review, or providing reference files.

## Enabling File Uploads

1. Go to your chatbot's **Settings** page
2. Scroll to the **File Uploads** section
3. Toggle it **on**
4. Select which file categories to allow
5. Save your changes

File uploads are disabled by default.

## Allowed File Types

Files are organized into four categories. Enable or disable each category independently.

| Category | Extensions | MIME Types | Default |
|----------|-----------|------------|---------|
| **Images** | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | Enabled |
| **Documents** | `.pdf`, `.doc`, `.docx`, `.txt` | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain` | Enabled |
| **Spreadsheets** | `.csv`, `.xls`, `.xlsx` | `text/csv`, `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | Disabled |
| **Archives** | `.zip` | `application/zip` | Disabled |

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| **enabled** | `false` | Master toggle for file uploads |
| **allowed_types.images** | `true` | Allow image files |
| **allowed_types.documents** | `true` | Allow document files |
| **allowed_types.spreadsheets** | `false` | Allow spreadsheet files |
| **allowed_types.archives** | `false` | Allow archive files |
| **max_file_size_mb** | `10` | Maximum size per file in megabytes |
| **max_files_per_message** | `3` | Maximum number of files attached to a single message |

## How It Works for Visitors

1. The visitor clicks the attachment button in the chat input
2. A file picker opens, filtered to the allowed file types
3. The visitor selects one or more files (up to the `max_files_per_message` limit)
4. Files are validated for type and size before uploading
5. Uploaded files appear as attachments on the message, with the file name, type, and size visible
6. The visitor sends the message with attached files

If a file exceeds the size limit or is not an allowed type, the widget shows an error and the file is rejected.

## Attachments in Conversations

Each uploaded file is stored as an attachment on the message with the following metadata:

- **url** — Download/preview link for the file
- **file_name** — Original file name
- **file_type** — MIME type of the file
- **file_size** — Size in bytes

You can view attachments when reviewing conversations in the dashboard.

## Best Practices

- **Enable only what you need** — If your chatbot handles text-only support, leave file uploads off to keep the interface simple.
- **Keep images enabled for support bots** — Screenshots are the fastest way for visitors to show you what they see.
- **Be mindful of the size limit** — 10 MB is generous for most use cases. Lower it if you want to reduce storage usage.
- **Disable archives unless necessary** — ZIP files carry more risk and are rarely needed in chat contexts.
- **Review uploaded files** — Check the Conversations page to see what visitors are sharing. This can reveal common issues or documentation gaps.
