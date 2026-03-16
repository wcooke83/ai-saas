/**
 * Chatbot Widget Translations
 * Provides multilingual support for widget UI strings
 */

// ============================================
// SUPPORTED LANGUAGES
// ============================================

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文（简体）' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
];

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['code'];

// ============================================
// WIDGET TRANSLATION STRINGS
// ============================================

export interface WidgetTranslations {
  headerTitle: string;
  online: string;
  typePlaceholder: string;
  sendAriaLabel: string;
  closeAriaLabel: string;
  openAriaLabel: string;
  errorMessage: string;
  checkInQuestion: string;
  checkInYes: string;
  checkInNo: string;
  followUp: string;
  surveyPrompt: string;
  surveyYes: string;
  surveyNo: string;
  thanksDismiss: string;
  submitting: string;
  skip: string;
  backToChat: string;
  poweredBy: string;
  selectDefault: string;
  loading: string;
  loadError: string;
  surveyPlaceholder: string;
  validationRequired: string;
  validationEmail: string;
  validationPhone: string;
  // Pre-Chat Form defaults
  preChatTitle: string;
  preChatDescription: string;
  preChatSubmit: string;
  // Post-Chat Survey defaults
  postChatTitle: string;
  postChatDescription: string;
  postChatSubmit: string;
  postChatThankYou: string;
  // Chat history
  previousConversation: string;
  newConversation: string;
  loadingHistory: string;
  // Settings defaults (for language change confirm dialog)
  welcomeMessage: string;
  fieldNameLabel: string;
  fieldNamePlaceholder: string;
  fieldEmailLabel: string;
  fieldEmailPlaceholder: string;
  postChatRatingLabel: string;
  postChatFeedbackLabel: string;
  // File upload
  attachFile: string;
  uploadingFile: string;
  fileTooLarge: string;
  fileTypeNotAllowed: string;
  uploadFailed: string;
  downloadFile: string;
  // Transcript
  emailTranscript: string;
  emailTranscriptSent: string;
  emailTranscriptFailed: string;
  enterYourEmail: string;
  sendTranscript: string;
  sendingTranscript: string;
  transcriptPrompt: string;
}

// ============================================
// TRANSLATIONS
// ============================================

export const WIDGET_TRANSLATIONS: Record<string, WidgetTranslations> = {
  en: {
    headerTitle: 'Chat with us',
    online: 'Online',
    typePlaceholder: 'Type your message...',
    sendAriaLabel: 'Send message',
    closeAriaLabel: 'Close chat',
    openAriaLabel: 'Open chat',
    errorMessage: 'Sorry, I encountered an error. Please try again.',
    checkInQuestion: 'Did that answer your question?',
    checkInYes: "Yes, I'm all set",
    checkInNo: 'I have another question',
    followUp: "Ok, what's your next question?",
    surveyPrompt: 'Would you mind sharing quick feedback to help us improve?',
    surveyYes: 'Give feedback',
    surveyNo: 'Maybe later',
    thanksDismiss: 'Thanks! Let me know if you need anything else.',
    submitting: 'Submitting...',
    skip: 'Skip',
    backToChat: 'Back to Chat',
    poweredBy: 'Powered by',
    selectDefault: 'Select...',
    loading: 'Loading...',
    loadError: 'Unable to load chatbot',
    surveyPlaceholder: 'Type your response...',
    validationRequired: '{field} is required',
    validationEmail: 'Please enter a valid email address',
    validationPhone: 'Please enter a valid phone number',
    // Pre-Chat Form defaults
    preChatTitle: 'Before we start',
    preChatDescription: 'Please provide your details so we can assist you better.',
    preChatSubmit: 'Start Chat',
    // Post-Chat Survey defaults
    postChatTitle: 'How did we do?',
    postChatDescription: "We'd love your feedback to improve our service.",
    postChatSubmit: 'Submit Feedback',
    postChatThankYou: 'Thank you for your feedback!',
    // Chat history
    previousConversation: 'Previous conversation',
    newConversation: 'New conversation',
    loadingHistory: 'Loading previous messages...',
    // Settings defaults
    welcomeMessage: 'Hi! How can I help you today?',
    fieldNameLabel: 'Name',
    fieldNamePlaceholder: 'Your name',
    fieldEmailLabel: 'Email',
    fieldEmailPlaceholder: 'your@email.com',
    postChatRatingLabel: 'How would you rate your experience?',
    postChatFeedbackLabel: 'Any additional feedback?',
    // File upload
    attachFile: 'Attach file',
    uploadingFile: 'Uploading...',
    fileTooLarge: 'File is too large. Maximum size: {size}MB',
    fileTypeNotAllowed: 'This file type is not allowed',
    uploadFailed: 'Upload failed. Please try again.',
    downloadFile: 'Download',
    // Transcript
    emailTranscript: 'Email transcript',
    emailTranscriptSent: 'Transcript sent!',
    emailTranscriptFailed: 'Failed to send transcript. Please try again.',
    enterYourEmail: 'Enter your email',
    sendTranscript: 'Send',
    sendingTranscript: 'Sending...',
    transcriptPrompt: 'Would you like to email yourself a copy of this conversation?',
  },
  es: {
    headerTitle: 'Chatea con nosotros',
    online: 'En línea',
    typePlaceholder: 'Escribe tu mensaje...',
    sendAriaLabel: 'Enviar mensaje',
    closeAriaLabel: 'Cerrar chat',
    openAriaLabel: 'Abrir chat',
    errorMessage: 'Lo siento, ocurrió un error. Por favor, inténtalo de nuevo.',
    checkInQuestion: '¿Eso respondió tu pregunta?',
    checkInYes: 'Sí, todo listo',
    checkInNo: 'Tengo otra pregunta',
    followUp: '¿Cuál es tu siguiente pregunta?',
    surveyPrompt: '¿Te importaría compartir una breve opinión para ayudarnos a mejorar?',
    surveyYes: 'Dar opinión',
    surveyNo: 'Quizás después',
    thanksDismiss: '¡Gracias! Avísame si necesitas algo más.',
    submitting: 'Enviando...',
    skip: 'Omitir',
    backToChat: 'Volver al chat',
    poweredBy: 'Desarrollado por',
    selectDefault: 'Seleccionar...',
    loading: 'Cargando...',
    loadError: 'No se pudo cargar el chatbot',
    surveyPlaceholder: 'Escribe tu respuesta...',
    validationRequired: '{field} es obligatorio',
    validationEmail: 'Por favor, introduce un correo electrónico válido',
    validationPhone: 'Por favor, introduce un número de teléfono válido',
    // Pre-Chat Form defaults
    preChatTitle: 'Antes de empezar',
    preChatDescription: 'Por favor, proporciona tus datos para poder ayudarte mejor.',
    preChatSubmit: 'Iniciar chat',
    // Post-Chat Survey defaults
    postChatTitle: '¿Cómo lo hicimos?',
    postChatDescription: 'Nos encantaría recibir tu opinión para mejorar nuestro servicio.',
    postChatSubmit: 'Enviar opinión',
    postChatThankYou: '¡Gracias por tu opinión!',
    // Chat history
    previousConversation: 'Conversación anterior',
    newConversation: 'Nueva conversación',
    loadingHistory: 'Cargando mensajes anteriores...',
    // Settings defaults
    welcomeMessage: '¡Hola! ¿Cómo puedo ayudarte hoy?',
    fieldNameLabel: 'Nombre',
    fieldNamePlaceholder: 'Tu nombre',
    fieldEmailLabel: 'Correo electrónico',
    fieldEmailPlaceholder: 'tu@correo.com',
    postChatRatingLabel: '¿Cómo calificarías tu experiencia?',
    postChatFeedbackLabel: '¿Algún comentario adicional?',
    // File upload
    attachFile: 'Adjuntar archivo',
    uploadingFile: 'Subiendo...',
    fileTooLarge: 'El archivo es demasiado grande. Tamaño máximo: {size}MB',
    fileTypeNotAllowed: 'Este tipo de archivo no está permitido',
    uploadFailed: 'Error al subir el archivo. Inténtalo de nuevo.',
    downloadFile: 'Descargar',
    // Transcript
    emailTranscript: 'Enviar transcripción por email',
    emailTranscriptSent: '¡Transcripción enviada!',
    emailTranscriptFailed: 'Error al enviar la transcripción. Inténtalo de nuevo.',
    enterYourEmail: 'Introduce tu email',
    sendTranscript: 'Enviar',
    sendingTranscript: 'Enviando...',
    transcriptPrompt: '¿Te gustaría recibir una copia de esta conversación por email?',
  },
  fr: {
    headerTitle: 'Discutez avec nous',
    online: 'En ligne',
    typePlaceholder: 'Tapez votre message...',
    sendAriaLabel: 'Envoyer le message',
    closeAriaLabel: 'Fermer le chat',
    openAriaLabel: 'Ouvrir le chat',
    errorMessage: 'Désolé, une erreur est survenue. Veuillez réessayer.',
    checkInQuestion: 'Est-ce que cela a répondu à votre question ?',
    checkInYes: 'Oui, c\'est bon',
    checkInNo: 'J\'ai une autre question',
    followUp: 'Quelle est votre prochaine question ?',
    surveyPrompt: 'Accepteriez-vous de partager un avis rapide pour nous aider à nous améliorer ?',
    surveyYes: 'Donner un avis',
    surveyNo: 'Peut-être plus tard',
    thanksDismiss: 'Merci ! N\'hésitez pas si vous avez besoin d\'autre chose.',
    submitting: 'Envoi en cours...',
    skip: 'Passer',
    backToChat: 'Retour au chat',
    poweredBy: 'Propulsé par',
    selectDefault: 'Sélectionner...',
    loading: 'Chargement...',
    loadError: 'Impossible de charger le chatbot',
    surveyPlaceholder: 'Tapez votre réponse...',
    validationRequired: '{field} est requis',
    validationEmail: 'Veuillez entrer une adresse e-mail valide',
    validationPhone: 'Veuillez entrer un numéro de téléphone valide',
    // Pre-Chat Form defaults
    preChatTitle: 'Avant de commencer',
    preChatDescription: 'Veuillez fournir vos coordonnées pour que nous puissions mieux vous aider.',
    preChatSubmit: 'Démarrer le chat',
    // Post-Chat Survey defaults
    postChatTitle: 'Comment avons-nous fait ?',
    postChatDescription: 'Nous aimerions recevoir vos commentaires pour améliorer notre service.',
    postChatSubmit: 'Envoyer les commentaires',
    postChatThankYou: 'Merci pour vos commentaires !',
    // Chat history
    previousConversation: 'Conversation précédente',
    newConversation: 'Nouvelle conversation',
    loadingHistory: 'Chargement des messages précédents...',
    // Settings defaults
    welcomeMessage: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    fieldNameLabel: 'Nom',
    fieldNamePlaceholder: 'Votre nom',
    fieldEmailLabel: 'E-mail',
    fieldEmailPlaceholder: 'votre@email.com',
    postChatRatingLabel: 'Comment évalueriez-vous votre expérience ?',
    postChatFeedbackLabel: 'Des commentaires supplémentaires ?',
    // File upload
    attachFile: 'Joindre un fichier',
    uploadingFile: 'Téléchargement...',
    fileTooLarge: 'Le fichier est trop volumineux. Taille maximale : {size}Mo',
    fileTypeNotAllowed: 'Ce type de fichier n\'est pas autorisé',
    uploadFailed: 'Échec du téléchargement. Veuillez réessayer.',
    downloadFile: 'Télécharger',
    // Transcript
    emailTranscript: 'Envoyer la transcription par e-mail',
    emailTranscriptSent: 'Transcription envoyée !',
    emailTranscriptFailed: 'Échec de l\'envoi. Veuillez réessayer.',
    enterYourEmail: 'Entrez votre e-mail',
    sendTranscript: 'Envoyer',
    sendingTranscript: 'Envoi...',
    transcriptPrompt: 'Souhaitez-vous recevoir une copie de cette conversation par e-mail ?',
  },
  de: {
    headerTitle: 'Chatte mit uns',
    online: 'Online',
    typePlaceholder: 'Nachricht eingeben...',
    sendAriaLabel: 'Nachricht senden',
    closeAriaLabel: 'Chat schließen',
    openAriaLabel: 'Chat öffnen',
    errorMessage: 'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    checkInQuestion: 'Hat das Ihre Frage beantwortet?',
    checkInYes: 'Ja, alles klar',
    checkInNo: 'Ich habe noch eine Frage',
    followUp: 'Was ist Ihre nächste Frage?',
    surveyPrompt: 'Möchten Sie uns kurz Feedback geben, damit wir uns verbessern können?',
    surveyYes: 'Feedback geben',
    surveyNo: 'Vielleicht später',
    thanksDismiss: 'Danke! Melden Sie sich, wenn Sie noch etwas brauchen.',
    submitting: 'Wird gesendet...',
    skip: 'Überspringen',
    backToChat: 'Zurück zum Chat',
    poweredBy: 'Bereitgestellt von',
    selectDefault: 'Auswählen...',
    loading: 'Laden...',
    loadError: 'Chatbot konnte nicht geladen werden',
    surveyPlaceholder: 'Antwort eingeben...',
    validationRequired: '{field} ist erforderlich',
    validationEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    validationPhone: 'Bitte geben Sie eine gültige Telefonnummer ein',
    // Pre-Chat Form defaults
    preChatTitle: 'Bevor wir beginnen',
    preChatDescription: 'Bitte geben Sie Ihre Daten an, damit wir Sie besser unterstützen können.',
    preChatSubmit: 'Chat starten',
    // Post-Chat Survey defaults
    postChatTitle: 'Wie haben wir uns geschlagen?',
    postChatDescription: 'Wir würden uns über Ihr Feedback freuen, um unseren Service zu verbessern.',
    postChatSubmit: 'Feedback senden',
    postChatThankYou: 'Vielen Dank für Ihr Feedback!',
    // Chat history
    previousConversation: 'Vorheriges Gespräch',
    newConversation: 'Neues Gespräch',
    loadingHistory: 'Vorherige Nachrichten werden geladen...',
    // Settings defaults
    welcomeMessage: 'Hallo! Wie kann ich Ihnen heute helfen?',
    fieldNameLabel: 'Name',
    fieldNamePlaceholder: 'Ihr Name',
    fieldEmailLabel: 'E-Mail',
    fieldEmailPlaceholder: 'ihre@email.com',
    postChatRatingLabel: 'Wie würden Sie Ihre Erfahrung bewerten?',
    postChatFeedbackLabel: 'Haben Sie weiteres Feedback?',
    // File upload
    attachFile: 'Datei anhängen',
    uploadingFile: 'Hochladen...',
    fileTooLarge: 'Datei ist zu groß. Maximale Größe: {size}MB',
    fileTypeNotAllowed: 'Dieser Dateityp ist nicht erlaubt',
    uploadFailed: 'Upload fehlgeschlagen. Bitte versuchen Sie es erneut.',
    downloadFile: 'Herunterladen',
    // Transcript
    emailTranscript: 'Transkript per E-Mail senden',
    emailTranscriptSent: 'Transkript gesendet!',
    emailTranscriptFailed: 'Senden fehlgeschlagen. Bitte versuchen Sie es erneut.',
    enterYourEmail: 'E-Mail-Adresse eingeben',
    sendTranscript: 'Senden',
    sendingTranscript: 'Wird gesendet...',
    transcriptPrompt: 'Möchten Sie sich eine Kopie dieses Gesprächs per E-Mail zusenden lassen?',
  },
  pt: {
    headerTitle: 'Converse conosco',
    online: 'Online',
    typePlaceholder: 'Digite sua mensagem...',
    sendAriaLabel: 'Enviar mensagem',
    closeAriaLabel: 'Fechar chat',
    openAriaLabel: 'Abrir chat',
    errorMessage: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
    checkInQuestion: 'Isso respondeu sua pergunta?',
    checkInYes: 'Sim, tudo certo',
    checkInNo: 'Tenho outra pergunta',
    followUp: 'Qual é sua próxima pergunta?',
    surveyPrompt: 'Você se importaria de compartilhar um feedback rápido para nos ajudar a melhorar?',
    surveyYes: 'Dar feedback',
    surveyNo: 'Talvez depois',
    thanksDismiss: 'Obrigado! Me avise se precisar de mais alguma coisa.',
    submitting: 'Enviando...',
    skip: 'Pular',
    backToChat: 'Voltar ao chat',
    poweredBy: 'Desenvolvido por',
    selectDefault: 'Selecionar...',
    loading: 'Carregando...',
    loadError: 'Não foi possível carregar o chatbot',
    surveyPlaceholder: 'Digite sua resposta...',
    validationRequired: '{field} é obrigatório',
    validationEmail: 'Por favor, insira um e-mail válido',
    validationPhone: 'Por favor, insira um número de telefone válido',
    // Pre-Chat Form defaults
    preChatTitle: 'Antes de começar',
    preChatDescription: 'Por favor, forneça seus dados para que possamos ajudá-lo melhor.',
    preChatSubmit: 'Iniciar chat',
    // Post-Chat Survey defaults
    postChatTitle: 'Como nos saímos?',
    postChatDescription: 'Adoraríamos receber seu feedback para melhorar nosso serviço.',
    postChatSubmit: 'Enviar feedback',
    postChatThankYou: 'Obrigado pelo seu feedback!',
    // Chat history
    previousConversation: 'Conversa anterior',
    newConversation: 'Nova conversa',
    loadingHistory: 'Carregando mensagens anteriores...',
    // Settings defaults
    welcomeMessage: 'Olá! Como posso ajudá-lo hoje?',
    fieldNameLabel: 'Nome',
    fieldNamePlaceholder: 'Seu nome',
    fieldEmailLabel: 'E-mail',
    fieldEmailPlaceholder: 'seu@email.com',
    postChatRatingLabel: 'Como você avaliaria sua experiência?',
    postChatFeedbackLabel: 'Algum feedback adicional?',
    // File upload
    attachFile: 'Anexar arquivo',
    uploadingFile: 'Enviando...',
    fileTooLarge: 'O arquivo é muito grande. Tamanho máximo: {size}MB',
    fileTypeNotAllowed: 'Este tipo de arquivo não é permitido',
    uploadFailed: 'Falha no envio. Tente novamente.',
    downloadFile: 'Baixar',
    // Transcript
    emailTranscript: 'Enviar transcrição por e-mail',
    emailTranscriptSent: 'Transcrição enviada!',
    emailTranscriptFailed: 'Falha ao enviar. Tente novamente.',
    enterYourEmail: 'Digite seu e-mail',
    sendTranscript: 'Enviar',
    sendingTranscript: 'Enviando...',
    transcriptPrompt: 'Gostaria de receber uma cópia desta conversa por e-mail?',
  },
  it: {
    headerTitle: 'Chatta con noi',
    online: 'Online',
    typePlaceholder: 'Scrivi il tuo messaggio...',
    sendAriaLabel: 'Invia messaggio',
    closeAriaLabel: 'Chiudi chat',
    openAriaLabel: 'Apri chat',
    errorMessage: 'Mi dispiace, si è verificato un errore. Riprova.',
    checkInQuestion: 'Questo ha risposto alla tua domanda?',
    checkInYes: 'Sì, tutto chiaro',
    checkInNo: 'Ho un\'altra domanda',
    followUp: 'Qual è la tua prossima domanda?',
    surveyPrompt: 'Ti andrebbe di condividere un rapido feedback per aiutarci a migliorare?',
    surveyYes: 'Lascia un feedback',
    surveyNo: 'Forse dopo',
    thanksDismiss: 'Grazie! Fammi sapere se hai bisogno di altro.',
    submitting: 'Invio in corso...',
    skip: 'Salta',
    backToChat: 'Torna alla chat',
    poweredBy: 'Offerto da',
    selectDefault: 'Seleziona...',
    loading: 'Caricamento...',
    loadError: 'Impossibile caricare il chatbot',
    surveyPlaceholder: 'Scrivi la tua risposta...',
    validationRequired: '{field} è obbligatorio',
    validationEmail: 'Inserisci un indirizzo e-mail valido',
    validationPhone: 'Inserisci un numero di telefono valido',
    // Pre-Chat Form defaults
    preChatTitle: 'Prima di iniziare',
    preChatDescription: 'Fornisci i tuoi dati per poterti assistere meglio.',
    preChatSubmit: 'Avvia chat',
    // Post-Chat Survey defaults
    postChatTitle: 'Come abbiamo fatto?',
    postChatDescription: 'Ci piacerebbe ricevere il tuo feedback per migliorare il nostro servizio.',
    postChatSubmit: 'Invia feedback',
    postChatThankYou: 'Grazie per il tuo feedback!',
    // Chat history
    previousConversation: 'Conversazione precedente',
    newConversation: 'Nuova conversazione',
    loadingHistory: 'Caricamento messaggi precedenti...',
    // Settings defaults
    welcomeMessage: 'Ciao! Come posso aiutarti oggi?',
    fieldNameLabel: 'Nome',
    fieldNamePlaceholder: 'Il tuo nome',
    fieldEmailLabel: 'E-mail',
    fieldEmailPlaceholder: 'tua@email.com',
    postChatRatingLabel: 'Come valuteresti la tua esperienza?',
    postChatFeedbackLabel: 'Qualche altro feedback?',
    // File upload
    attachFile: 'Allega file',
    uploadingFile: 'Caricamento...',
    fileTooLarge: 'Il file è troppo grande. Dimensione massima: {size}MB',
    fileTypeNotAllowed: 'Questo tipo di file non è consentito',
    uploadFailed: 'Caricamento fallito. Riprova.',
    downloadFile: 'Scarica',
    // Transcript
    emailTranscript: 'Invia trascrizione via e-mail',
    emailTranscriptSent: 'Trascrizione inviata!',
    emailTranscriptFailed: 'Invio fallito. Riprova.',
    enterYourEmail: 'Inserisci la tua e-mail',
    sendTranscript: 'Invia',
    sendingTranscript: 'Invio...',
    transcriptPrompt: 'Vuoi ricevere una copia di questa conversazione via e-mail?',
  },
  nl: {
    headerTitle: 'Chat met ons',
    online: 'Online',
    typePlaceholder: 'Typ je bericht...',
    sendAriaLabel: 'Bericht versturen',
    closeAriaLabel: 'Chat sluiten',
    openAriaLabel: 'Chat openen',
    errorMessage: 'Sorry, er is een fout opgetreden. Probeer het opnieuw.',
    checkInQuestion: 'Is je vraag hiermee beantwoord?',
    checkInYes: 'Ja, helemaal',
    checkInNo: 'Ik heb nog een vraag',
    followUp: 'Wat is je volgende vraag?',
    surveyPrompt: 'Zou je kort feedback willen geven om ons te helpen verbeteren?',
    surveyYes: 'Feedback geven',
    surveyNo: 'Misschien later',
    thanksDismiss: 'Bedankt! Laat het me weten als je nog iets nodig hebt.',
    submitting: 'Verzenden...',
    skip: 'Overslaan',
    backToChat: 'Terug naar chat',
    poweredBy: 'Aangedreven door',
    selectDefault: 'Selecteer...',
    loading: 'Laden...',
    loadError: 'Kan chatbot niet laden',
    surveyPlaceholder: 'Typ je antwoord...',
    validationRequired: '{field} is verplicht',
    validationEmail: 'Voer een geldig e-mailadres in',
    validationPhone: 'Voer een geldig telefoonnummer in',
    // Pre-Chat Form defaults
    preChatTitle: 'Voordat we beginnen',
    preChatDescription: 'Geef uw gegevens op zodat we u beter kunnen helpen.',
    preChatSubmit: 'Chat starten',
    // Post-Chat Survey defaults
    postChatTitle: 'Hoe hebben we het gedaan?',
    postChatDescription: 'We zouden graag uw feedback ontvangen om onze service te verbeteren.',
    postChatSubmit: 'Feedback versturen',
    postChatThankYou: 'Bedankt voor uw feedback!',
    // Chat history
    previousConversation: 'Vorig gesprek',
    newConversation: 'Nieuw gesprek',
    loadingHistory: 'Vorige berichten laden...',
    // Settings defaults
    welcomeMessage: 'Hallo! Hoe kan ik u vandaag helpen?',
    fieldNameLabel: 'Naam',
    fieldNamePlaceholder: 'Uw naam',
    fieldEmailLabel: 'E-mail',
    fieldEmailPlaceholder: 'uw@email.com',
    postChatRatingLabel: 'Hoe zou u uw ervaring beoordelen?',
    postChatFeedbackLabel: 'Heeft u nog aanvullende feedback?',
    // File upload
    attachFile: 'Bestand bijvoegen',
    uploadingFile: 'Uploaden...',
    fileTooLarge: 'Bestand is te groot. Maximale grootte: {size}MB',
    fileTypeNotAllowed: 'Dit bestandstype is niet toegestaan',
    uploadFailed: 'Upload mislukt. Probeer het opnieuw.',
    downloadFile: 'Downloaden',
    // Transcript
    emailTranscript: 'Transcript e-mailen',
    emailTranscriptSent: 'Transcript verstuurd!',
    emailTranscriptFailed: 'Verzenden mislukt. Probeer het opnieuw.',
    enterYourEmail: 'Voer uw e-mailadres in',
    sendTranscript: 'Verstuur',
    sendingTranscript: 'Verzenden...',
    transcriptPrompt: 'Wilt u een kopie van dit gesprek per e-mail ontvangen?',
  },
  ru: {
    headerTitle: 'Напишите нам',
    online: 'В сети',
    typePlaceholder: 'Введите сообщение...',
    sendAriaLabel: 'Отправить сообщение',
    closeAriaLabel: 'Закрыть чат',
    openAriaLabel: 'Открыть чат',
    errorMessage: 'Извините, произошла ошибка. Пожалуйста, попробуйте снова.',
    checkInQuestion: 'Это ответило на ваш вопрос?',
    checkInYes: 'Да, всё понятно',
    checkInNo: 'У меня ещё есть вопрос',
    followUp: 'Какой у вас следующий вопрос?',
    surveyPrompt: 'Не могли бы вы поделиться быстрым отзывом, чтобы помочь нам стать лучше?',
    surveyYes: 'Оставить отзыв',
    surveyNo: 'Может быть позже',
    thanksDismiss: 'Спасибо! Обращайтесь, если понадобится помощь.',
    submitting: 'Отправка...',
    skip: 'Пропустить',
    backToChat: 'Вернуться в чат',
    poweredBy: 'Работает на',
    selectDefault: 'Выбрать...',
    loading: 'Загрузка...',
    loadError: 'Не удалось загрузить чат-бот',
    surveyPlaceholder: 'Введите ваш ответ...',
    validationRequired: 'Поле {field} обязательно',
    validationEmail: 'Пожалуйста, введите корректный адрес электронной почты',
    validationPhone: 'Пожалуйста, введите корректный номер телефона',
    // Pre-Chat Form defaults
    preChatTitle: 'Перед началом',
    preChatDescription: 'Пожалуйста, укажите свои данные, чтобы мы могли лучше вам помочь.',
    preChatSubmit: 'Начать чат',
    // Post-Chat Survey defaults
    postChatTitle: 'Как мы справились?',
    postChatDescription: 'Мы будем рады получить ваш отзыв, чтобы улучшить наш сервис.',
    postChatSubmit: 'Отправить отзыв',
    postChatThankYou: 'Спасибо за ваш отзыв!',
    // Chat history
    previousConversation: 'Предыдущий разговор',
    newConversation: 'Новый разговор',
    loadingHistory: 'Загрузка предыдущих сообщений...',
    // Settings defaults
    welcomeMessage: 'Здравствуйте! Чем я могу вам помочь сегодня?',
    fieldNameLabel: 'Имя',
    fieldNamePlaceholder: 'Ваше имя',
    fieldEmailLabel: 'Электронная почта',
    fieldEmailPlaceholder: 'ваш@email.com',
    postChatRatingLabel: 'Как бы вы оценили ваш опыт?',
    postChatFeedbackLabel: 'Есть дополнительные замечания?',
    // File upload
    attachFile: 'Прикрепить файл',
    uploadingFile: 'Загрузка...',
    fileTooLarge: 'Файл слишком большой. Максимальный размер: {size}МБ',
    fileTypeNotAllowed: 'Этот тип файла не разрешён',
    uploadFailed: 'Ошибка загрузки. Попробуйте снова.',
    downloadFile: 'Скачать',
    // Transcript
    emailTranscript: 'Отправить расшифровку на почту',
    emailTranscriptSent: 'Расшифровка отправлена!',
    emailTranscriptFailed: 'Не удалось отправить. Попробуйте снова.',
    enterYourEmail: 'Введите ваш e-mail',
    sendTranscript: 'Отправить',
    sendingTranscript: 'Отправка...',
    transcriptPrompt: 'Хотите получить копию этого разговора на электронную почту?',
  },
  zh: {
    headerTitle: '与我们聊天',
    online: '在线',
    typePlaceholder: '输入您的消息...',
    sendAriaLabel: '发送消息',
    closeAriaLabel: '关闭聊天',
    openAriaLabel: '打开聊天',
    errorMessage: '抱歉，出现了错误。请重试。',
    checkInQuestion: '这回答了您的问题吗？',
    checkInYes: '是的，已解决',
    checkInNo: '我还有其他问题',
    followUp: '您的下一个问题是什么？',
    surveyPrompt: '您愿意分享一下反馈来帮助我们改进吗？',
    surveyYes: '提供反馈',
    surveyNo: '以后再说',
    thanksDismiss: '谢谢！如果还需要帮助，请随时告诉我。',
    submitting: '提交中...',
    skip: '跳过',
    backToChat: '返回聊天',
    poweredBy: '技术支持',
    selectDefault: '请选择...',
    loading: '加载中...',
    loadError: '无法加载聊天机器人',
    surveyPlaceholder: '输入您的回复...',
    validationRequired: '{field}为必填项',
    validationEmail: '请输入有效的电子邮件地址',
    validationPhone: '请输入有效的电话号码',
    // Pre-Chat Form defaults
    preChatTitle: '开始之前',
    preChatDescription: '请提供您的详细信息，以便我们更好地为您提供帮助。',
    preChatSubmit: '开始聊天',
    // Post-Chat Survey defaults
    postChatTitle: '我们做得如何？',
    postChatDescription: '我们非常希望得到您的反馈，以改进我们的服务。',
    postChatSubmit: '提交反馈',
    postChatThankYou: '感谢您的反馈！',
    // Chat history
    previousConversation: '之前的对话',
    newConversation: '新对话',
    loadingHistory: '正在加载之前的消息...',
    // Settings defaults
    welcomeMessage: '您好！今天我能为您提供什么帮助？',
    fieldNameLabel: '姓名',
    fieldNamePlaceholder: '您的姓名',
    fieldEmailLabel: '电子邮件',
    fieldEmailPlaceholder: 'your@email.com',
    postChatRatingLabel: '您如何评价您的体验？',
    postChatFeedbackLabel: '还有其他反馈吗？',
    // File upload
    attachFile: '附加文件',
    uploadingFile: '上传中...',
    fileTooLarge: '文件太大。最大大小：{size}MB',
    fileTypeNotAllowed: '不允许此文件类型',
    uploadFailed: '上传失败。请重试。',
    downloadFile: '下载',
    // Transcript
    emailTranscript: '通过邮件发送聊天记录',
    emailTranscriptSent: '聊天记录已发送！',
    emailTranscriptFailed: '发送失败，请重试。',
    enterYourEmail: '输入您的邮箱',
    sendTranscript: '发送',
    sendingTranscript: '发送中...',
    transcriptPrompt: '您想通过邮件接收这次对话的副本吗？',
  },
  ja: {
    headerTitle: 'チャットする',
    online: 'オンライン',
    typePlaceholder: 'メッセージを入力...',
    sendAriaLabel: 'メッセージを送信',
    closeAriaLabel: 'チャットを閉じる',
    openAriaLabel: 'チャットを開く',
    errorMessage: '申し訳ありません、エラーが発生しました。もう一度お試しください。',
    checkInQuestion: 'ご質問の回答になりましたか？',
    checkInYes: 'はい、解決しました',
    checkInNo: '別の質問があります',
    followUp: '次のご質問は何ですか？',
    surveyPrompt: '改善のためにフィードバックをいただけますか？',
    surveyYes: 'フィードバックする',
    surveyNo: 'また後で',
    thanksDismiss: 'ありがとうございます！他にお手伝いできることがあればお知らせください。',
    submitting: '送信中...',
    skip: 'スキップ',
    backToChat: 'チャットに戻る',
    poweredBy: '提供',
    selectDefault: '選択...',
    loading: '読み込み中...',
    loadError: 'チャットボットを読み込めませんでした',
    surveyPlaceholder: '回答を入力...',
    validationRequired: '{field}は必須です',
    validationEmail: '有効なメールアドレスを入力してください',
    validationPhone: '有効な電話番号を入力してください',
    // Pre-Chat Form defaults
    preChatTitle: '開始前に',
    preChatDescription: '詳細情報をご提供いただき、より良いサポートをご提供できるようにします。',
    preChatSubmit: 'チャットを開始',
    // Post-Chat Survey defaults
    postChatTitle: '評価をお願いします',
    postChatDescription: 'サービス改善のため、フィードバックをお寄せください。',
    postChatSubmit: 'フィードバックを送信',
    postChatThankYou: 'フィードバックありがとうございます！',
    // Chat history
    previousConversation: '以前の会話',
    newConversation: '新しい会話',
    loadingHistory: '以前のメッセージを読み込み中...',
    // Settings defaults
    welcomeMessage: 'こんにちは！本日はどのようにお手伝いできますか？',
    fieldNameLabel: 'お名前',
    fieldNamePlaceholder: 'お名前を入力',
    fieldEmailLabel: 'メールアドレス',
    fieldEmailPlaceholder: 'your@email.com',
    postChatRatingLabel: 'ご体験をどのように評価されますか？',
    postChatFeedbackLabel: 'その他のフィードバックはありますか？',
    // File upload
    attachFile: 'ファイルを添付',
    uploadingFile: 'アップロード中...',
    fileTooLarge: 'ファイルが大きすぎます。最大サイズ：{size}MB',
    fileTypeNotAllowed: 'このファイル形式は許可されていません',
    uploadFailed: 'アップロードに失敗しました。もう一度お試しください。',
    downloadFile: 'ダウンロード',
    // Transcript
    emailTranscript: '会話履歴をメールで送信',
    emailTranscriptSent: '送信しました！',
    emailTranscriptFailed: '送信に失敗しました。もう一度お試しください。',
    enterYourEmail: 'メールアドレスを入力',
    sendTranscript: '送信',
    sendingTranscript: '送信中...',
    transcriptPrompt: 'この会話のコピーをメールで受け取りますか？',
  },
  ko: {
    headerTitle: '채팅하기',
    online: '온라인',
    typePlaceholder: '메시지를 입력하세요...',
    sendAriaLabel: '메시지 보내기',
    closeAriaLabel: '채팅 닫기',
    openAriaLabel: '채팅 열기',
    errorMessage: '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.',
    checkInQuestion: '질문에 대한 답변이 되었나요?',
    checkInYes: '네, 해결되었습니다',
    checkInNo: '다른 질문이 있습니다',
    followUp: '다음 질문은 무엇인가요?',
    surveyPrompt: '개선을 위해 간단한 피드백을 공유해 주시겠어요?',
    surveyYes: '피드백 남기기',
    surveyNo: '나중에 할게요',
    thanksDismiss: '감사합니다! 더 필요한 것이 있으면 알려주세요.',
    submitting: '제출 중...',
    skip: '건너뛰기',
    backToChat: '채팅으로 돌아가기',
    poweredBy: '제공',
    selectDefault: '선택...',
    loading: '로딩 중...',
    loadError: '챗봇을 불러올 수 없습니다',
    surveyPlaceholder: '답변을 입력하세요...',
    validationRequired: '{field}은(는) 필수입니다',
    validationEmail: '유효한 이메일 주소를 입력해 주세요',
    validationPhone: '유효한 전화번호를 입력해 주세요',
    // Pre-Chat Form defaults
    preChatTitle: '시작하기 전에',
    preChatDescription: '더 나은 지원을 위해 세부 정보를 제공해 주세요.',
    preChatSubmit: '채팅 시작',
    // Post-Chat Survey defaults
    postChatTitle: '서비스 평가',
    postChatDescription: '서비스 개선을 위한 피드백을 보내주세요.',
    postChatSubmit: '피드백 보내기',
    postChatThankYou: '피드백을 보내주셔서 감사합니다!',
    // Chat history
    previousConversation: '이전 대화',
    newConversation: '새 대화',
    loadingHistory: '이전 메시지 로딩 중...',
    // Settings defaults
    welcomeMessage: '안녕하세요! 오늘 어떻게 도와드릴까요?',
    fieldNameLabel: '이름',
    fieldNamePlaceholder: '이름을 입력하세요',
    fieldEmailLabel: '이메일',
    fieldEmailPlaceholder: 'your@email.com',
    postChatRatingLabel: '경험을 어떻게 평가하시겠습니까?',
    postChatFeedbackLabel: '추가 피드백이 있으신가요?',
    // File upload
    attachFile: '파일 첨부',
    uploadingFile: '업로드 중...',
    fileTooLarge: '파일이 너무 큽니다. 최대 크기: {size}MB',
    fileTypeNotAllowed: '이 파일 형식은 허용되지 않습니다',
    uploadFailed: '업로드에 실패했습니다. 다시 시도해 주세요.',
    downloadFile: '다운로드',
    // Transcript
    emailTranscript: '대화 내역 이메일 전송',
    emailTranscriptSent: '전송되었습니다!',
    emailTranscriptFailed: '전송에 실패했습니다. 다시 시도해 주세요.',
    enterYourEmail: '이메일을 입력하세요',
    sendTranscript: '보내기',
    sendingTranscript: '전송 중...',
    transcriptPrompt: '이 대화의 사본을 이메일로 받으시겠습니까?',
  },
  ar: {
    headerTitle: 'تحدث معنا',
    online: 'متصل',
    typePlaceholder: 'اكتب رسالتك...',
    sendAriaLabel: 'إرسال رسالة',
    closeAriaLabel: 'إغلاق الدردشة',
    openAriaLabel: 'فتح الدردشة',
    errorMessage: 'عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى.',
    checkInQuestion: 'هل أجاب ذلك على سؤالك؟',
    checkInYes: 'نعم، تم الحل',
    checkInNo: 'لدي سؤال آخر',
    followUp: 'ما هو سؤالك التالي؟',
    surveyPrompt: 'هل تمانع في مشاركة ملاحظاتك السريعة لمساعدتنا على التحسين؟',
    surveyYes: 'تقديم ملاحظات',
    surveyNo: 'ربما لاحقًا',
    thanksDismiss: 'شكرًا! أخبرني إذا كنت بحاجة إلى أي شيء آخر.',
    submitting: 'جارٍ الإرسال...',
    skip: 'تخطي',
    backToChat: 'العودة إلى الدردشة',
    poweredBy: 'مدعوم من',
    selectDefault: 'اختر...',
    loading: 'جارٍ التحميل...',
    loadError: 'تعذر تحميل روبوت الدردشة',
    surveyPlaceholder: 'اكتب ردك...',
    validationRequired: '{field} مطلوب',
    validationEmail: 'يرجى إدخال عنوان بريد إلكتروني صالح',
    validationPhone: 'يرجى إدخال رقم هاتف صالح',
    // Pre-Chat Form defaults
    preChatTitle: 'قبل أن نبدأ',
    preChatDescription: 'يرجى تقديم تفاصيلك حتى نتمكن من مساعدتك بشكل أفضل.',
    preChatSubmit: 'بدء الدردشة',
    // Post-Chat Survey defaults
    postChatTitle: 'كيف كان أداؤنا؟',
    postChatDescription: 'نود الحصول على ملاحظاتك لتحسين خدمتنا.',
    postChatSubmit: 'إرسال الملاحظات',
    postChatThankYou: 'شكرًا لك على ملاحظاتك!',
    // Chat history
    previousConversation: 'المحادثة السابقة',
    newConversation: 'محادثة جديدة',
    loadingHistory: 'جارٍ تحميل الرسائل السابقة...',
    // Settings defaults
    welcomeMessage: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
    fieldNameLabel: 'الاسم',
    fieldNamePlaceholder: 'اسمك',
    fieldEmailLabel: 'البريد الإلكتروني',
    fieldEmailPlaceholder: 'your@email.com',
    postChatRatingLabel: 'كيف تقيّم تجربتك؟',
    postChatFeedbackLabel: 'هل لديك أي ملاحظات إضافية؟',
    // File upload
    attachFile: 'إرفاق ملف',
    uploadingFile: 'جارٍ الرفع...',
    fileTooLarge: 'الملف كبير جدًا. الحد الأقصى: {size}ميغابايت',
    fileTypeNotAllowed: 'هذا النوع من الملفات غير مسموح به',
    uploadFailed: 'فشل الرفع. يرجى المحاولة مرة أخرى.',
    downloadFile: 'تحميل',
    // Transcript
    emailTranscript: 'إرسال النسخة عبر البريد',
    emailTranscriptSent: 'تم إرسال النسخة!',
    emailTranscriptFailed: 'فشل الإرسال. يرجى المحاولة مرة أخرى.',
    enterYourEmail: 'أدخل بريدك الإلكتروني',
    sendTranscript: 'إرسال',
    sendingTranscript: 'جارٍ الإرسال...',
    transcriptPrompt: 'هل ترغب في تلقي نسخة من هذه المحادثة عبر البريد الإلكتروني؟',
  },
  hi: {
    headerTitle: 'हमसे चैट करें',
    online: 'ऑनलाइन',
    typePlaceholder: 'अपना संदेश टाइप करें...',
    sendAriaLabel: 'संदेश भेजें',
    closeAriaLabel: 'चैट बंद करें',
    openAriaLabel: 'चैट खोलें',
    errorMessage: 'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    checkInQuestion: 'क्या इससे आपके प्रश्न का उत्तर मिला?',
    checkInYes: 'हाँ, सब ठीक है',
    checkInNo: 'मेरा एक और प्रश्न है',
    followUp: 'आपका अगला प्रश्न क्या है?',
    surveyPrompt: 'क्या आप हमें बेहतर बनाने में मदद के लिए त्वरित प्रतिक्रिया साझा करेंगे?',
    surveyYes: 'प्रतिक्रिया दें',
    surveyNo: 'शायद बाद में',
    thanksDismiss: 'धन्यवाद! अगर आपको कुछ और चाहिए तो बताएं।',
    submitting: 'भेजा जा रहा है...',
    skip: 'छोड़ें',
    backToChat: 'चैट पर वापस जाएं',
    poweredBy: 'द्वारा संचालित',
    selectDefault: 'चुनें...',
    loading: 'लोड हो रहा है...',
    loadError: 'चैटबॉट लोड नहीं हो सका',
    surveyPlaceholder: 'अपना उत्तर टाइप करें...',
    validationRequired: '{field} आवश्यक है',
    validationEmail: 'कृपया एक मान्य ईमेल पता दर्ज करें',
    validationPhone: 'कृपया एक मान्य फ़ोन नंबर दर्ज करें',
    // Pre-Chat Form defaults
    preChatTitle: 'शुरू करने से पहले',
    preChatDescription: 'कृपया अपना विवरण प्रदान करें ताकि हम आपकी बेहतर सहायता कर सकें।',
    preChatSubmit: 'चैट शुरू करें',
    // Post-Chat Survey defaults
    postChatTitle: 'हमारा प्रदर्शन कैसा रहा?',
    postChatDescription: 'हमारी सेवा में सुधार के लिए हमें आपकी प्रतिक्रिया चाहिए।',
    postChatSubmit: 'प्रतिक्रिया भेजें',
    postChatThankYou: 'आपकी प्रतिक्रिया के लिए धन्यवाद!',
    // Chat history
    previousConversation: 'पिछली बातचीत',
    newConversation: 'नई बातचीत',
    loadingHistory: 'पिछले संदेश लोड हो रहे हैं...',
    // Settings defaults
    welcomeMessage: 'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूँ?',
    fieldNameLabel: 'नाम',
    fieldNamePlaceholder: 'आपका नाम',
    fieldEmailLabel: 'ईमेल',
    fieldEmailPlaceholder: 'your@email.com',
    postChatRatingLabel: 'आप अपने अनुभव को कैसे रेट करेंगे?',
    postChatFeedbackLabel: 'कोई अतिरिक्त प्रतिक्रिया?',
    // File upload
    attachFile: 'फ़ाइल संलग्न करें',
    uploadingFile: 'अपलोड हो रहा है...',
    fileTooLarge: 'फ़ाइल बहुत बड़ी है। अधिकतम आकार: {size}MB',
    fileTypeNotAllowed: 'यह फ़ाइल प्रकार अनुमतित नहीं है',
    uploadFailed: 'अपलोड विफल। कृपया पुनः प्रयास करें।',
    downloadFile: 'डाउनलोड',
    // Transcript
    emailTranscript: 'चैट इतिहास ईमेल करें',
    emailTranscriptSent: 'भेज दिया गया!',
    emailTranscriptFailed: 'भेजने में विफल। कृपया पुनः प्रयास करें।',
    enterYourEmail: 'अपना ईमेल दर्ज करें',
    sendTranscript: 'भेजें',
    sendingTranscript: 'भेजा जा रहा है...',
    transcriptPrompt: 'क्या आप इस बातचीत की प्रति ईमेल पर प्राप्त करना चाहेंगे?',
  },
  tr: {
    headerTitle: 'Bizimle sohbet edin',
    online: 'Çevrimiçi',
    typePlaceholder: 'Mesajınızı yazın...',
    sendAriaLabel: 'Mesaj gönder',
    closeAriaLabel: 'Sohbeti kapat',
    openAriaLabel: 'Sohbeti aç',
    errorMessage: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
    checkInQuestion: 'Bu sorunuzu cevapladı mı?',
    checkInYes: 'Evet, sorunum çözüldü',
    checkInNo: 'Başka bir sorum var',
    followUp: 'Bir sonraki sorunuz nedir?',
    surveyPrompt: 'İyileştirmemize yardımcı olmak için kısa bir geri bildirim paylaşır mısınız?',
    surveyYes: 'Geri bildirim ver',
    surveyNo: 'Belki daha sonra',
    thanksDismiss: 'Teşekkürler! Başka bir şeye ihtiyacınız olursa bana bildirin.',
    submitting: 'Gönderiliyor...',
    skip: 'Atla',
    backToChat: 'Sohbete dön',
    poweredBy: 'Tarafından desteklenmektedir',
    selectDefault: 'Seçin...',
    loading: 'Yükleniyor...',
    loadError: 'Chatbot yüklenemedi',
    surveyPlaceholder: 'Yanıtınızı yazın...',
    validationRequired: '{field} gereklidir',
    validationEmail: 'Lütfen geçerli bir e-posta adresi girin',
    validationPhone: 'Lütfen geçerli bir telefon numarası girin',
    // Pre-Chat Form defaults
    preChatTitle: 'Başlamadan önce',
    preChatDescription: 'Size daha iyi yardımcı olabilmemiz için lütfen bilgilerinizi girin.',
    preChatSubmit: 'Sohbeti Başlat',
    // Post-Chat Survey defaults
    postChatTitle: 'Nasıl yaptık?',
    postChatDescription: 'Hizmetimizi geliştirmek için geri bildiriminizi almak isteriz.',
    postChatSubmit: 'Geri Bildirim Gönder',
    postChatThankYou: 'Geri bildiriminiz için teşekkürler!',
    // Chat history
    previousConversation: 'Önceki sohbet',
    newConversation: 'Yeni sohbet',
    loadingHistory: 'Önceki mesajlar yükleniyor...',
    // Settings defaults
    welcomeMessage: 'Merhaba! Bugün size nasıl yardımcı olabilirim?',
    fieldNameLabel: 'Ad',
    fieldNamePlaceholder: 'Adınız',
    fieldEmailLabel: 'E-posta',
    fieldEmailPlaceholder: 'your@email.com',
    postChatRatingLabel: 'Deneyiminizi nasıl değerlendirirsiniz?',
    postChatFeedbackLabel: 'Ek geri bildiriminiz var mı?',
    // File upload
    attachFile: 'Dosya ekle',
    uploadingFile: 'Yükleniyor...',
    fileTooLarge: 'Dosya çok büyük. Maksimum boyut: {size}MB',
    fileTypeNotAllowed: 'Bu dosya türüne izin verilmiyor',
    uploadFailed: 'Yükleme başarısız. Lütfen tekrar deneyin.',
    downloadFile: 'İndir',
    // Transcript
    emailTranscript: 'Transkripti e-posta ile gönder',
    emailTranscriptSent: 'Transkript gönderildi!',
    emailTranscriptFailed: 'Gönderilemedi. Lütfen tekrar deneyin.',
    enterYourEmail: 'E-posta adresinizi girin',
    sendTranscript: 'Gönder',
    sendingTranscript: 'Gönderiliyor...',
    transcriptPrompt: 'Bu sohbetin bir kopyasını e-posta ile almak ister misiniz?',
  },
  pl: {
    headerTitle: 'Czatuj z nami',
    online: 'Online',
    typePlaceholder: 'Wpisz wiadomość...',
    sendAriaLabel: 'Wyślij wiadomość',
    closeAriaLabel: 'Zamknij czat',
    openAriaLabel: 'Otwórz czat',
    errorMessage: 'Przepraszam, wystąpił błąd. Spróbuj ponownie.',
    checkInQuestion: 'Czy to odpowiedziało na Twoje pytanie?',
    checkInYes: 'Tak, wszystko jasne',
    checkInNo: 'Mam jeszcze pytanie',
    followUp: 'Jakie jest Twoje następne pytanie?',
    surveyPrompt: 'Czy mógłbyś podzielić się krótką opinią, aby pomóc nam się poprawić?',
    surveyYes: 'Podziel się opinią',
    surveyNo: 'Może później',
    thanksDismiss: 'Dziękuję! Daj znać, jeśli potrzebujesz czegoś jeszcze.',
    submitting: 'Wysyłanie...',
    skip: 'Pomiń',
    backToChat: 'Wróć do czatu',
    poweredBy: 'Obsługiwane przez',
    selectDefault: 'Wybierz...',
    loading: 'Ładowanie...',
    loadError: 'Nie udało się załadować chatbota',
    surveyPlaceholder: 'Wpisz swoją odpowiedź...',
    validationRequired: 'Pole {field} jest wymagane',
    validationEmail: 'Proszę podać prawidłowy adres e-mail',
    validationPhone: 'Proszę podać prawidłowy numer telefonu',
    // Pre-Chat Form defaults
    preChatTitle: 'Zanim zaczniemy',
    preChatDescription: 'Podaj swoje dane, abyśmy mogli Ci lepiej pomóc.',
    preChatSubmit: 'Rozpocznij czat',
    // Post-Chat Survey defaults
    postChatTitle: 'Jak nam poszło?',
    postChatDescription: 'Chcielibyśmy poznać Twoją opinię, aby usprawnić naszą usługę.',
    postChatSubmit: 'Wyślij opinię',
    postChatThankYou: 'Dziękujemy za opinię!',
    // Chat history
    previousConversation: 'Poprzednia rozmowa',
    newConversation: 'Nowa rozmowa',
    loadingHistory: 'Ładowanie poprzednich wiadomości...',
    // Settings defaults
    welcomeMessage: 'Cześć! Jak mogę Ci dzisiaj pomóc?',
    fieldNameLabel: 'Imię',
    fieldNamePlaceholder: 'Twoje imię',
    fieldEmailLabel: 'E-mail',
    fieldEmailPlaceholder: 'twoj@email.com',
    postChatRatingLabel: 'Jak oceniasz swoje doświadczenie?',
    postChatFeedbackLabel: 'Jakieś dodatkowe uwagi?',
    // File upload
    attachFile: 'Dołącz plik',
    uploadingFile: 'Przesyłanie...',
    fileTooLarge: 'Plik jest za duży. Maksymalny rozmiar: {size}MB',
    fileTypeNotAllowed: 'Ten typ pliku nie jest dozwolony',
    uploadFailed: 'Przesyłanie nie powiodło się. Spróbuj ponownie.',
    downloadFile: 'Pobierz',
    // Transcript
    emailTranscript: 'Wyślij transkrypcję e-mailem',
    emailTranscriptSent: 'Transkrypcja wysłana!',
    emailTranscriptFailed: 'Wysłanie nie powiodło się. Spróbuj ponownie.',
    enterYourEmail: 'Podaj swój e-mail',
    sendTranscript: 'Wyślij',
    sendingTranscript: 'Wysyłanie...',
    transcriptPrompt: 'Czy chciałbyś otrzymać kopię tej rozmowy na e-mail?',
  },
  sv: {
    headerTitle: 'Chatta med oss',
    online: 'Online',
    typePlaceholder: 'Skriv ditt meddelande...',
    sendAriaLabel: 'Skicka meddelande',
    closeAriaLabel: 'Stäng chatt',
    openAriaLabel: 'Öppna chatt',
    errorMessage: 'Tyvärr uppstod ett fel. Försök igen.',
    checkInQuestion: 'Besvarade det din fråga?',
    checkInYes: 'Ja, allt klart',
    checkInNo: 'Jag har en till fråga',
    followUp: 'Vad är din nästa fråga?',
    surveyPrompt: 'Skulle du vilja dela snabb feedback för att hjälpa oss förbättra?',
    surveyYes: 'Ge feedback',
    surveyNo: 'Kanske senare',
    thanksDismiss: 'Tack! Hör av dig om du behöver något mer.',
    submitting: 'Skickar...',
    skip: 'Hoppa över',
    backToChat: 'Tillbaka till chatt',
    poweredBy: 'Drivs av',
    selectDefault: 'Välj...',
    loading: 'Laddar...',
    loadError: 'Kunde inte ladda chatbot',
    surveyPlaceholder: 'Skriv ditt svar...',
    validationRequired: '{field} är obligatoriskt',
    validationEmail: 'Ange en giltig e-postadress',
    validationPhone: 'Ange ett giltigt telefonnummer',
    // Pre-Chat Form defaults
    preChatTitle: 'Innan vi börjar',
    preChatDescription: 'Ange dina uppgifter så att vi kan hjälpa dig bättre.',
    preChatSubmit: 'Starta chatt',
    // Post-Chat Survey defaults
    postChatTitle: 'Hur gjorde vi?',
    postChatDescription: 'Vi skulle gärna vilja ha din feedback för att förbättra vår tjänst.',
    postChatSubmit: 'Skicka feedback',
    postChatThankYou: 'Tack för din feedback!',
    // Chat history
    previousConversation: 'Tidigare konversation',
    newConversation: 'Ny konversation',
    loadingHistory: 'Laddar tidigare meddelanden...',
    // Settings defaults
    welcomeMessage: 'Hej! Hur kan jag hjälpa dig idag?',
    fieldNameLabel: 'Namn',
    fieldNamePlaceholder: 'Ditt namn',
    fieldEmailLabel: 'E-post',
    fieldEmailPlaceholder: 'din@email.com',
    postChatRatingLabel: 'Hur skulle du betygsätta din upplevelse?',
    postChatFeedbackLabel: 'Har du ytterligare feedback?',
    // File upload
    attachFile: 'Bifoga fil',
    uploadingFile: 'Laddar upp...',
    fileTooLarge: 'Filen är för stor. Maximal storlek: {size}MB',
    fileTypeNotAllowed: 'Denna filtyp är inte tillåten',
    uploadFailed: 'Uppladdning misslyckades. Försök igen.',
    downloadFile: 'Ladda ner',
    // Transcript
    emailTranscript: 'E-posta transkription',
    emailTranscriptSent: 'Transkription skickad!',
    emailTranscriptFailed: 'Kunde inte skicka. Försök igen.',
    enterYourEmail: 'Ange din e-post',
    sendTranscript: 'Skicka',
    sendingTranscript: 'Skickar...',
    transcriptPrompt: 'Vill du få en kopia av denna konversation via e-post?',
  },
  no: {
    headerTitle: 'Chat med oss',
    online: 'Pålogget',
    typePlaceholder: 'Skriv din melding...',
    sendAriaLabel: 'Send melding',
    closeAriaLabel: 'Lukk chat',
    openAriaLabel: 'Åpne chat',
    errorMessage: 'Beklager, det oppstod en feil. Vennligst prøv igjen.',
    checkInQuestion: 'Svarte det på spørsmålet ditt?',
    checkInYes: 'Ja, alt er klart',
    checkInNo: 'Jeg har et annet spørsmål',
    followUp: 'Hva er ditt neste spørsmål?',
    surveyPrompt: 'Kunne du delt en rask tilbakemelding for å hjelpe oss å bli bedre?',
    surveyYes: 'Gi tilbakemelding',
    surveyNo: 'Kanskje senere',
    thanksDismiss: 'Takk! Gi meg beskjed hvis du trenger noe mer.',
    submitting: 'Sender...',
    skip: 'Hopp over',
    backToChat: 'Tilbake til chat',
    poweredBy: 'Drevet av',
    selectDefault: 'Velg...',
    loading: 'Laster...',
    loadError: 'Kunne ikke laste chatbot',
    surveyPlaceholder: 'Skriv ditt svar...',
    validationRequired: '{field} er påkrevd',
    validationEmail: 'Vennligst skriv inn en gyldig e-postadresse',
    validationPhone: 'Vennligst skriv inn et gyldig telefonnummer',
    // Pre-Chat Form defaults
    preChatTitle: 'Før vi starter',
    preChatDescription: 'Vennligst oppgi dine detaljer slik at vi kan hjelpe deg bedre.',
    preChatSubmit: 'Start chat',
    // Post-Chat Survey defaults
    postChatTitle: 'Hvordan gikk det?',
    postChatDescription: 'Vi vil gjerne ha tilbakemeldingen din for å forbedre tjenesten vår.',
    postChatSubmit: 'Send tilbakemelding',
    postChatThankYou: 'Takk for tilbakemeldingen!',
    // Chat history
    previousConversation: 'Tidligere samtale',
    newConversation: 'Ny samtale',
    loadingHistory: 'Laster tidligere meldinger...',
    // Settings defaults
    welcomeMessage: 'Hei! Hvordan kan jeg hjelpe deg i dag?',
    fieldNameLabel: 'Navn',
    fieldNamePlaceholder: 'Ditt navn',
    fieldEmailLabel: 'E-post',
    fieldEmailPlaceholder: 'din@epost.com',
    postChatRatingLabel: 'Hvordan vil du vurdere opplevelsen din?',
    postChatFeedbackLabel: 'Har du ytterligere tilbakemeldinger?',
    // File upload
    attachFile: 'Legg ved fil',
    uploadingFile: 'Laster opp...',
    fileTooLarge: 'Filen er for stor. Maksimal størrelse: {size}MB',
    fileTypeNotAllowed: 'Denne filtypen er ikke tillatt',
    uploadFailed: 'Opplasting mislyktes. Prøv igjen.',
    downloadFile: 'Last ned',
    // Transcript
    emailTranscript: 'Send transkripsjon på e-post',
    emailTranscriptSent: 'Transkripsjon sendt!',
    emailTranscriptFailed: 'Kunne ikke sende. Prøv igjen.',
    enterYourEmail: 'Skriv inn din e-post',
    sendTranscript: 'Send',
    sendingTranscript: 'Sender...',
    transcriptPrompt: 'Ønsker du å motta en kopi av denne samtalen på e-post?',
  },
  da: {
    headerTitle: 'Chat med os',
    online: 'Online',
    typePlaceholder: 'Skriv din besked...',
    sendAriaLabel: 'Send besked',
    closeAriaLabel: 'Luk chat',
    openAriaLabel: 'Åbn chat',
    errorMessage: 'Beklager, der opstod en fejl. Prøv venligst igen.',
    checkInQuestion: 'Besvarede det dit spørgsmål?',
    checkInYes: 'Ja, det er klart',
    checkInNo: 'Jeg har et andet spørgsmål',
    followUp: 'Hvad er dit næste spørgsmål?',
    surveyPrompt: 'Vil du dele en hurtig feedback for at hjælpe os med at forbedre os?',
    surveyYes: 'Giv feedback',
    surveyNo: 'Måske senere',
    thanksDismiss: 'Tak! Sig til, hvis du har brug for noget mere.',
    submitting: 'Sender...',
    skip: 'Spring over',
    backToChat: 'Tilbage til chat',
    poweredBy: 'Drevet af',
    selectDefault: 'Vælg...',
    loading: 'Indlæser...',
    loadError: 'Kunne ikke indlæse chatbot',
    surveyPlaceholder: 'Skriv dit svar...',
    validationRequired: '{field} er påkrævet',
    validationEmail: 'Indtast venligst en gyldig e-mailadresse',
    validationPhone: 'Indtast venligst et gyldigt telefonnummer',
    // Pre-Chat Form defaults
    preChatTitle: 'Før vi starter',
    preChatDescription: 'Angiv venligst dine oplysninger, så vi kan hjælpe dig bedre.',
    preChatSubmit: 'Start chat',
    // Post-Chat Survey defaults
    postChatTitle: 'Hvordan gik det?',
    postChatDescription: 'Vi vil gerne have din feedback for at forbedre vores service.',
    postChatSubmit: 'Send feedback',
    postChatThankYou: 'Tak for din feedback!',
    // Chat history
    previousConversation: 'Tidligere samtale',
    newConversation: 'Ny samtale',
    loadingHistory: 'Indlæser tidligere beskeder...',
    // Settings defaults
    welcomeMessage: 'Hej! Hvordan kan jeg hjælpe dig i dag?',
    fieldNameLabel: 'Navn',
    fieldNamePlaceholder: 'Dit navn',
    fieldEmailLabel: 'E-mail',
    fieldEmailPlaceholder: 'din@email.com',
    postChatRatingLabel: 'Hvordan vil du vurdere din oplevelse?',
    postChatFeedbackLabel: 'Har du yderligere feedback?',
    // File upload
    attachFile: 'Vedhæft fil',
    uploadingFile: 'Uploader...',
    fileTooLarge: 'Filen er for stor. Maksimal størrelse: {size}MB',
    fileTypeNotAllowed: 'Denne filtype er ikke tilladt',
    uploadFailed: 'Upload mislykkedes. Prøv igen.',
    downloadFile: 'Download',
    // Transcript
    emailTranscript: 'E-mail transskription',
    emailTranscriptSent: 'Transskription sendt!',
    emailTranscriptFailed: 'Kunne ikke sende. Prøv igen.',
    enterYourEmail: 'Indtast din e-mail',
    sendTranscript: 'Send',
    sendingTranscript: 'Sender...',
    transcriptPrompt: 'Vil du modtage en kopi af denne samtale på e-mail?',
  },
  fi: {
    headerTitle: 'Keskustele kanssamme',
    online: 'Paikalla',
    typePlaceholder: 'Kirjoita viestisi...',
    sendAriaLabel: 'Lähetä viesti',
    closeAriaLabel: 'Sulje keskustelu',
    openAriaLabel: 'Avaa keskustelu',
    errorMessage: 'Anteeksi, tapahtui virhe. Yritä uudelleen.',
    checkInQuestion: 'Vastasiko tämä kysymykseesi?',
    checkInYes: 'Kyllä, selvä',
    checkInNo: 'Minulla on toinen kysymys',
    followUp: 'Mikä on seuraava kysymyksesi?',
    surveyPrompt: 'Haluaisitko jakaa nopean palautteen auttaaksesi meitä parantamaan?',
    surveyYes: 'Anna palautetta',
    surveyNo: 'Ehkä myöhemmin',
    thanksDismiss: 'Kiitos! Kerro, jos tarvitset vielä jotain.',
    submitting: 'Lähetetään...',
    skip: 'Ohita',
    backToChat: 'Takaisin keskusteluun',
    poweredBy: 'Palvelun tarjoaa',
    selectDefault: 'Valitse...',
    loading: 'Ladataan...',
    loadError: 'Chatbottia ei voitu ladata',
    surveyPlaceholder: 'Kirjoita vastauksesi...',
    validationRequired: '{field} on pakollinen',
    validationEmail: 'Syötä kelvollinen sähköpostiosoite',
    validationPhone: 'Syötä kelvollinen puhelinnumero',
    // Pre-Chat Form defaults
    preChatTitle: 'Ennen kuin aloitamme',
    preChatDescription: 'Anna tietosi, jotta voimme auttaa sinua paremmin.',
    preChatSubmit: 'Aloita keskustelu',
    // Post-Chat Survey defaults
    postChatTitle: 'Miten suoriuduimme?',
    postChatDescription: 'Haluaisimme palautettasi palvelumme parantamiseksi.',
    postChatSubmit: 'Lähetä palaute',
    postChatThankYou: 'Kiitos palautteestasi!',
    // Chat history
    previousConversation: 'Edellinen keskustelu',
    newConversation: 'Uusi keskustelu',
    loadingHistory: 'Ladataan aiempia viestejä...',
    // Settings defaults
    welcomeMessage: 'Hei! Miten voin auttaa sinua tänään?',
    fieldNameLabel: 'Nimi',
    fieldNamePlaceholder: 'Nimesi',
    fieldEmailLabel: 'Sähköposti',
    fieldEmailPlaceholder: 'sinun@email.com',
    postChatRatingLabel: 'Miten arvioisit kokemustasi?',
    postChatFeedbackLabel: 'Onko sinulla lisäpalautetta?',
    // File upload
    attachFile: 'Liitä tiedosto',
    uploadingFile: 'Ladataan...',
    fileTooLarge: 'Tiedosto on liian suuri. Enimmäiskoko: {size}MB',
    fileTypeNotAllowed: 'Tämä tiedostotyyppi ei ole sallittu',
    uploadFailed: 'Lataus epäonnistui. Yritä uudelleen.',
    downloadFile: 'Lataa',
    // Transcript
    emailTranscript: 'Lähetä keskustelu sähköpostilla',
    emailTranscriptSent: 'Lähetetty!',
    emailTranscriptFailed: 'Lähetys epäonnistui. Yritä uudelleen.',
    enterYourEmail: 'Syötä sähköpostiosoitteesi',
    sendTranscript: 'Lähetä',
    sendingTranscript: 'Lähetetään...',
    transcriptPrompt: 'Haluatko saada kopion tästä keskustelusta sähköpostilla?',
  },
  th: {
    headerTitle: 'แชทกับเรา',
    online: 'ออนไลน์',
    typePlaceholder: 'พิมพ์ข้อความของคุณ...',
    sendAriaLabel: 'ส่งข้อความ',
    closeAriaLabel: 'ปิดแชท',
    openAriaLabel: 'เปิดแชท',
    errorMessage: 'ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
    checkInQuestion: 'คำตอบนี้ตอบคำถามของคุณหรือไม่?',
    checkInYes: 'ใช่ เรียบร้อยแล้ว',
    checkInNo: 'ฉันมีคำถามอื่น',
    followUp: 'คำถามถัดไปของคุณคืออะไร?',
    surveyPrompt: 'คุณช่วยแบ่งปันความคิดเห็นสั้นๆ เพื่อช่วยเราปรับปรุงได้ไหม?',
    surveyYes: 'ให้ความคิดเห็น',
    surveyNo: 'ไว้ทีหลัง',
    thanksDismiss: 'ขอบคุณ! แจ้งให้ทราบหากต้องการความช่วยเหลือเพิ่มเติม',
    submitting: 'กำลังส่ง...',
    skip: 'ข้าม',
    backToChat: 'กลับไปที่แชท',
    poweredBy: 'ขับเคลื่อนโดย',
    selectDefault: 'เลือก...',
    loading: 'กำลังโหลด...',
    loadError: 'ไม่สามารถโหลดแชทบอทได้',
    surveyPlaceholder: 'พิมพ์คำตอบของคุณ...',
    validationRequired: '{field} จำเป็นต้องกรอก',
    validationEmail: 'กรุณากรอกอีเมลที่ถูกต้อง',
    validationPhone: 'กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง',
    // Pre-Chat Form defaults
    preChatTitle: 'ก่อนที่เราจะเริ่ม',
    preChatDescription: 'กรุณาระบุข้อมูลของคุณเพื่อให้เราสามารถช่วยเหลือคุณได้ดียิ่งขึ้น',
    preChatSubmit: 'เริ่มแชท',
    // Post-Chat Survey defaults
    postChatTitle: 'เราทำได้ดีแค่ไหน?',
    postChatDescription: 'เราอยากได้รับความคิดเห็นของคุณเพื่อปรับปรุงบริการของเรา',
    postChatSubmit: 'ส่งความคิดเห็น',
    postChatThankYou: 'ขอบคุณสำหรับความคิดเห็นของคุณ!',
    // Chat history
    previousConversation: 'การสนทนาก่อนหน้า',
    newConversation: 'การสนทนาใหม่',
    loadingHistory: 'กำลังโหลดข้อความก่อนหน้า...',
    // Settings defaults
    welcomeMessage: 'สวัสดี! วันนี้ฉันสามารถช่วยอะไรคุณได้บ้าง?',
    fieldNameLabel: 'ชื่อ',
    fieldNamePlaceholder: 'ชื่อของคุณ',
    fieldEmailLabel: 'อีเมล',
    fieldEmailPlaceholder: 'your@email.com',
    postChatRatingLabel: 'คุณจะให้คะแนนประสบการณ์ของคุณอย่างไร?',
    postChatFeedbackLabel: 'มีข้อเสนอแนะเพิ่มเติมไหม?',
    // File upload
    attachFile: 'แนบไฟล์',
    uploadingFile: 'กำลังอัปโหลด...',
    fileTooLarge: 'ไฟล์ใหญ่เกินไป ขนาดสูงสุด: {size}MB',
    fileTypeNotAllowed: 'ไม่อนุญาตไฟล์ประเภทนี้',
    uploadFailed: 'อัปโหลดล้มเหลว กรุณาลองใหม่อีกครั้ง',
    downloadFile: 'ดาวน์โหลด',
    // Transcript
    emailTranscript: 'ส่งประวัติการสนทนาทางอีเมล',
    emailTranscriptSent: 'ส่งแล้ว!',
    emailTranscriptFailed: 'ส่งไม่สำเร็จ กรุณาลองใหม่',
    enterYourEmail: 'กรอกอีเมลของคุณ',
    sendTranscript: 'ส่ง',
    sendingTranscript: 'กำลังส่ง...',
    transcriptPrompt: 'คุณต้องการรับสำเนาการสนทนานี้ทางอีเมลหรือไม่?',
  },
};

// ============================================
// HELPERS
// ============================================

/**
 * Get translations for a given language code, falling back to English
 */
export function getTranslations(languageCode: string): WidgetTranslations {
  return WIDGET_TRANSLATIONS[languageCode] || WIDGET_TRANSLATIONS['en'];
}

/**
 * Get translated default text values for all settings inputs in a given language.
 * Used by the language change confirm dialog to instantly apply defaults without AI calls.
 */
export function getDefaultTextsForLanguage(languageCode: string): {
  welcomeMessage: string;
  placeholderText: string;
  preChatConfig: {
    title: string;
    description: string;
    submitButtonText: string;
    fields: { id: string; label: string; placeholder: string }[];
  };
  postChatConfig: {
    title: string;
    description: string;
    submitButtonText: string;
    thankYouMessage: string;
    questions: { id: string; label: string }[];
  };
} {
  const t = getTranslations(languageCode);
  return {
    welcomeMessage: t.welcomeMessage,
    placeholderText: t.typePlaceholder,
    preChatConfig: {
      title: t.preChatTitle,
      description: t.preChatDescription,
      submitButtonText: t.preChatSubmit,
      fields: [
        { id: 'name', label: t.fieldNameLabel, placeholder: t.fieldNamePlaceholder },
        { id: 'email', label: t.fieldEmailLabel, placeholder: t.fieldEmailPlaceholder },
      ],
    },
    postChatConfig: {
      title: t.postChatTitle,
      description: t.postChatDescription,
      submitButtonText: t.postChatSubmit,
      thankYouMessage: t.postChatThankYou,
      questions: [
        { id: 'rating', label: t.postChatRatingLabel },
        { id: 'feedback', label: t.postChatFeedbackLabel },
      ],
    },
  };
}

/**
 * Translate a default value if it matches the English default.
 * Preserves user customizations by returning the current value if different from default.
 * 
 * @param currentValue - The current configured value
 * @param englishDefault - The known English default string from types.ts
 * @param translation - The translated string for the target language
 * @returns The translated value if current equals default, otherwise current value
 */
export function translateDefault(currentValue: string, englishDefault: string, translation: string): string {
  // If the current value matches the English default, return the translation
  // Otherwise, preserve the user's custom value
  return currentValue === englishDefault ? translation : currentValue;
}

/**
 * Get a language option by its code
 */
export function getLanguageByCode(code: string): LanguageOption | undefined {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
}

/**
 * Get the full language name for use in AI system prompts
 */
export function getLanguageName(code: string): string {
  const lang = getLanguageByCode(code);
  return lang?.name || 'English';
}

/**
 * Detect if a user message is requesting a language change
 * Returns the detected language code if a switch is requested, null otherwise
 */
export function detectLanguageSwitch(message: string): string | null {
  const lowerMessage = message.toLowerCase().trim();
  
  // Common language switch patterns
  const patterns = [
    // English patterns
    { regex: /(?:can you |could you |please )?(?:speak|talk|switch|change|respond|reply|answer|communicate)(?: to| in| with)? (?:me in )?(\w+)/i, group: 1 },
    { regex: /(?:i want |i'd like |i prefer )(?:to speak |to talk |to chat )?(?:in |with )?(\w+)/i, group: 1 },
    { regex: /(?:use |speak |talk )(\w+)(?: please| now)?$/i, group: 1 },
    
    // Direct language name detection (case insensitive)
    { regex: /^(\w+)(?: language)?(?: please)?$/i, group: 1 },
  ];
  
  // Language name mappings (including common variations)
  const languageMap: Record<string, string> = {
    // English
    'english': 'en',
    'inglés': 'en',
    'anglais': 'en',
    'englisch': 'en',
    'inglese': 'en',
    'engels': 'en',
    'английский': 'en',
    '英语': 'en',
    '英語': 'en',
    '영어': 'en',
    
    // Spanish
    'spanish': 'es',
    'español': 'es',
    'espagnol': 'es',
    'spanisch': 'es',
    'spagnolo': 'es',
    'spaans': 'es',
    'испанский': 'es',
    '西班牙语': 'es',
    'スペイン語': 'es',
    
    // French
    'french': 'fr',
    'français': 'fr',
    'francés': 'fr',
    'französisch': 'fr',
    'francese': 'fr',
    'frans': 'fr',
    'французский': 'fr',
    '法语': 'fr',
    'フランス語': 'fr',
    
    // German
    'german': 'de',
    'deutsch': 'de',
    'alemán': 'de',
    'allemand': 'de',
    'tedesco': 'de',
    'duits': 'de',
    'немецкий': 'de',
    '德语': 'de',
    'ドイツ語': 'de',
    
    // Portuguese
    'portuguese': 'pt',
    'português': 'pt',
    'portugués': 'pt',
    'portugiesisch': 'pt',
    'portoghese': 'pt',
    'portugees': 'pt',
    'португальский': 'pt',
    '葡萄牙语': 'pt',
    'ポルトガル語': 'pt',
    
    // Italian
    'italian': 'it',
    'italiano': 'it',
    'italien': 'it',
    'italienisch': 'it',
    'italiaans': 'it',
    'итальянский': 'it',
    '意大利语': 'it',
    'イタリア語': 'it',
    
    // Dutch
    'dutch': 'nl',
    'nederlands': 'nl',
    'holandés': 'nl',
    'néerlandais': 'nl',
    'niederländisch': 'nl',
    'olandese': 'nl',
    'голландский': 'nl',
    '荷兰语': 'nl',
    'オランダ語': 'nl',
    
    // Russian
    'russian': 'ru',
    'русский': 'ru',
    'ruso': 'ru',
    'russe': 'ru',
    'russisch': 'ru',
    'russo': 'ru',
    'russisch': 'ru',
    '俄语': 'ru',
    'ロシア語': 'ru',
    
    // Chinese
    'chinese': 'zh',
    '中文': 'zh',
    'chino': 'zh',
    'chinois': 'zh',
    'chinesisch': 'zh',
    'cinese': 'zh',
    'chinees': 'zh',
    'китайский': 'zh',
    '中国語': 'zh',
    
    // Japanese
    'japanese': 'ja',
    '日本語': 'ja',
    'japonés': 'ja',
    'japonais': 'ja',
    'japanisch': 'ja',
    'giapponese': 'ja',
    'japans': 'ja',
    'японский': 'ja',
    '日语': 'ja',
    
    // Korean
    'korean': 'ko',
    '한국어': 'ko',
    'coreano': 'ko',
    'coréen': 'ko',
    'koreanisch': 'ko',
    'coreano': 'ko',
    'koreaans': 'ko',
    'корейский': 'ko',
    '韩语': 'ko',
    '朝鮮語': 'ko',
    
    // Arabic
    'arabic': 'ar',
    'العربية': 'ar',
    'árabe': 'ar',
    'arabe': 'ar',
    'arabisch': 'ar',
    'arabo': 'ar',
    'arabisch': 'ar',
    'арабский': 'ar',
    '阿拉伯语': 'ar',
    'アラビア語': 'ar',
    
    // Hindi
    'hindi': 'hi',
    'हिन्दी': 'hi',
    'хинди': 'hi',
    '印地语': 'hi',
    'ヒンディー語': 'hi',
    
    // Turkish
    'turkish': 'tr',
    'türkçe': 'tr',
    'turco': 'tr',
    'turc': 'tr',
    'türkisch': 'tr',
    'turco': 'tr',
    'turks': 'tr',
    'турецкий': 'tr',
    '土耳其语': 'tr',
    'トルコ語': 'tr',
    
    // Polish
    'polish': 'pl',
    'polski': 'pl',
    'polaco': 'pl',
    'polonais': 'pl',
    'polnisch': 'pl',
    'polacco': 'pl',
    'pools': 'pl',
    'польский': 'pl',
    '波兰语': 'pl',
    'ポーランド語': 'pl',
    
    // Swedish
    'swedish': 'sv',
    'svenska': 'sv',
    'sueco': 'sv',
    'suédois': 'sv',
    'schwedisch': 'sv',
    'svedese': 'sv',
    'zweeds': 'sv',
    'шведский': 'sv',
    '瑞典语': 'sv',
    'スウェーデン語': 'sv',
    
    // Norwegian
    'norwegian': 'no',
    'norsk': 'no',
    'noruego': 'no',
    'norvégien': 'no',
    'norwegisch': 'no',
    'norvegese': 'no',
    'noors': 'no',
    'норвежский': 'no',
    '挪威语': 'no',
    'ノルウェー語': 'no',
    
    // Danish
    'danish': 'da',
    'dansk': 'da',
    'danés': 'da',
    'danois': 'da',
    'dänisch': 'da',
    'danese': 'da',
    'deens': 'da',
    'датский': 'da',
    '丹麦语': 'da',
    'デンマーク語': 'da',
    
    // Finnish
    'finnish': 'fi',
    'suomi': 'fi',
    'finlandés': 'fi',
    'finnois': 'fi',
    'finnisch': 'fi',
    'finlandese': 'fi',
    'fins': 'fi',
    'финский': 'fi',
    '芬兰语': 'fi',
    'フィンランド語': 'fi',
    
    // Thai
    'thai': 'th',
    'ไทย': 'th',
    'tailandés': 'th',
    'thaï': 'th',
    'thailändisch': 'th',
    'thailandese': 'th',
    'thais': 'th',
    'тайский': 'th',
    '泰语': 'th',
    'タイ語': 'th',
  };
  
  // Try pattern matching first
  for (const pattern of patterns) {
    const match = lowerMessage.match(pattern.regex);
    if (match && match[pattern.group]) {
      const detectedLang = match[pattern.group].toLowerCase();
      const langCode = languageMap[detectedLang];
      if (langCode) {
        return langCode;
      }
    }
  }
  
  // Try direct language name lookup
  const langCode = languageMap[lowerMessage];
  if (langCode) {
    return langCode;
  }
  
  return null;
}
