-- Update widget_config column default to include all current fields
-- (form colors, secondary button colors, etc.)
-- Existing rows are NOT backfilled — the TypeScript merge pattern
-- { ...DEFAULT_WIDGET_CONFIG, ...(db_config || {}) } handles missing fields at runtime.

ALTER TABLE chatbots
  ALTER COLUMN widget_config
  SET DEFAULT '{
    "position": "bottom-right",
    "offsetX": 20,
    "offsetY": 20,
    "width": 380,
    "height": 600,
    "buttonSize": 60,
    "primaryColor": "#0ea5e9",
    "secondaryColor": "#f0f9ff",
    "backgroundColor": "#ffffff",
    "textColor": "#0f172a",
    "userBubbleColor": "#0ea5e9",
    "userBubbleTextColor": "#ffffff",
    "botBubbleColor": "#f1f5f9",
    "botBubbleTextColor": "#0f172a",
    "headerTextColor": "#ffffff",
    "inputBackgroundColor": "#ffffff",
    "inputTextColor": "#0f172a",
    "inputPlaceholderColor": "#94a3b8",
    "sendButtonColor": "#0ea5e9",
    "sendButtonIconColor": "#ffffff",
    "formBackgroundColor": "#ffffff",
    "formTitleColor": "#0f172a",
    "formDescriptionColor": "#6b7280",
    "formBorderColor": "#e5e7eb",
    "formLabelColor": "#0f172a",
    "formSubmitButtonTextColor": "#ffffff",
    "formPlaceholderColor": "#94a3b8",
    "formInputBackgroundColor": "#ffffff",
    "formInputTextColor": "#0f172a",
    "secondaryButtonColor": "transparent",
    "secondaryButtonTextColor": "#374151",
    "secondaryButtonBorderColor": "#d1d5db",
    "fontFamily": "Inter, system-ui, sans-serif",
    "fontSize": 14,
    "containerBorderRadius": 16,
    "inputBorderRadius": 24,
    "buttonBorderRadius": 50,
    "showBranding": true,
    "headerText": "Chat with us",
    "autoOpen": false,
    "autoOpenDelay": 3000,
    "soundEnabled": false,
    "customCss": ""
  }'::jsonb;
