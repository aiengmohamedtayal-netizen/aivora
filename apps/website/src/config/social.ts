import { Github, Instagram, Mail, Linkedin, Twitter } from "lucide-react"

export interface SocialItem {
  platform: string
  href: string
  label: string
  icon: any
}

export const socialConfig: SocialItem[] = [
  {
    platform: "github",
    href: "https://github.com/aiengmohamedtayal-netizen",
    label: "GitHub",
    icon: Github,
  },
  {
    platform: "instagram",
    href: "https://www.instagram.com/aiivoraa",
    label: "Instagram",
    icon: Instagram,
  },
  {
    platform: "email",
    href: "mailto:aivoraaa@outlook.com",
    label: "Email",
    icon: Mail,
  },
  {
    platform: "linkedin",
    href: "https://linkedin.com/company/aivora",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    platform: "twitter",
    href: "https://x.com/aivora",
    label: "Twitter",
    icon: Twitter,
  }
]
