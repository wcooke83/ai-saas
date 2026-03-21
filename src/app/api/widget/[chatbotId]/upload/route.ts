/**
 * File Upload API Endpoint
 * POST /api/widget/:chatbotId/upload - Upload a file attachment for chat
 *
 * Validates file type and size against chatbot's file_upload_config.
 * Stores files in Supabase Storage bucket 'chat-attachments'.
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { errorResponse, APIError } from '@/lib/api/utils';
import { DEFAULT_FILE_UPLOAD_CONFIG, FILE_TYPE_MAP } from '@/lib/chatbots/types';
import type { FileUploadConfig, FileUploadAllowedTypes } from '@/lib/chatbots/types';

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const supabase = createAdminClient() as any;

    // Get chatbot and its file upload config
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id, file_upload_config, is_published, status')
      .eq('id', chatbotId)
      .single();

    if (chatbotError || !chatbot) {
      throw APIError.notFound('Chatbot not found');
    }

    if (!chatbot.is_published || chatbot.status !== 'active') {
      throw APIError.forbidden('Chatbot is not available');
    }

    const uploadConfig: FileUploadConfig = chatbot.file_upload_config || DEFAULT_FILE_UPLOAD_CONFIG;

    if (!uploadConfig.enabled) {
      throw APIError.forbidden('File uploads are not enabled for this chatbot');
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const sessionId = formData.get('session_id') as string | null;

    if (!file) {
      throw APIError.badRequest('No file provided');
    }

    if (!sessionId) {
      throw APIError.badRequest('session_id is required');
    }

    // Validate file size
    const maxBytes = uploadConfig.max_file_size_mb * 1024 * 1024;
    if (file.size > maxBytes) {
      throw APIError.badRequest(
        `File too large. Maximum size is ${uploadConfig.max_file_size_mb}MB`
      );
    }

    // Build list of allowed MIME types and extensions from config
    const allowedMimes: string[] = [];
    const allowedExtensions: string[] = [];
    const allowedTypes = uploadConfig.allowed_types;
    for (const [category, config] of Object.entries(FILE_TYPE_MAP)) {
      if (allowedTypes[category as keyof FileUploadAllowedTypes]) {
        allowedMimes.push(...config.mimes);
        allowedExtensions.push(...config.extensions);
      }
    }

    // Validate file MIME type
    if (!allowedMimes.includes(file.type)) {
      throw APIError.badRequest(
        `File type "${file.type}" is not allowed. Allowed types: ${allowedMimes.join(', ')}`
      );
    }

    // Validate file extension matches allowed types (prevent MIME spoofing)
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      throw APIError.badRequest(
        `File extension "${fileExt}" is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
      );
    }

    // Enforce max_files_per_message by counting existing uploads in this session
    const sessionPath = `${chatbotId}/${sessionId}`;
    const { data: existingFiles } = await supabase.storage
      .from('chat-attachments')
      .list(sessionPath, { limit: 100 });
    const currentFileCount = existingFiles?.length ?? 0;
    if (currentFileCount >= uploadConfig.max_files_per_message) {
      throw APIError.badRequest(
        `Maximum ${uploadConfig.max_files_per_message} files allowed per session`
      );
    }

    // Generate a unique file path
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${chatbotId}/${sessionId}/${timestamp}_${sanitizedName}`;

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-attachments')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[Upload] Storage error:', uploadError);
      throw APIError.internal('Failed to upload file');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;
    if (!publicUrl) {
      throw APIError.internal('Failed to get file URL');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          url: publicUrl,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

// CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
