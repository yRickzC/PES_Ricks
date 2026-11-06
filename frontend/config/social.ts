interface SocialLink {
  id: "whatsapp" | "youtube" | "instagram" | "x" | "linkedin";
  label: string;
  href: string | null;
}

const whatsappNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER?.replace(/\D/gu, "");
const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;
const youtubeHref = import.meta.env.PUBLIC_YOUTUBE_URL?.trim() || null;
const instagramHref = import.meta.env.PUBLIC_INSTAGRAM_URL?.trim() || null;

// URLs dos outros perfis entram aqui quando forem informadas.
export const socialLinks: SocialLink[] = [
  { id: "whatsapp", label: "WhatsApp", href: whatsappHref },
  { id: "youtube", label: "YouTube", href: youtubeHref },
  { id: "instagram", label: "Instagram", href: instagramHref },
  { id: "x", label: "X / Twitter", href: null },
  { id: "linkedin", label: "LinkedIn", href: null },
];
