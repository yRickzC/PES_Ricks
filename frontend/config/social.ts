interface SocialLink {
  id: "youtube" | "instagram" | "x" | "linkedin";
  label: string;
  href: string | null;
}

// Adicione as URLs reais dos perfis quando forem informadas.
export const socialLinks: SocialLink[] = [
  { id: "youtube", label: "YouTube", href: null },
  { id: "instagram", label: "Instagram", href: null },
  { id: "x", label: "X / Twitter", href: null },
  { id: "linkedin", label: "LinkedIn", href: null },
];
