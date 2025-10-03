export function generateAvatarFromEmail(
  email: string,
  size: number = 40
): string {
  // Use Gravatar as the primary source for email-based avatars
  const hash = btoa(email.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, "");
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon&r=pg`;
}

export function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email[0].toUpperCase();
}

export function getAvatarUrl(email: string, size: number = 40): string {
  return generateAvatarFromEmail(email, size);
}
