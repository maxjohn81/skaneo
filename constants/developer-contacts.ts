export type DeveloperContact = {
  id: string;
  label: string;
  value: string;
  url: string;
  icon: "logo-facebook" | "mail-outline" | "logo-linkedin";
  color: string;
};

export const DEVELOPER_CONTACTS: DeveloperContact[] = [
  {
    id: "facebook",
    label: "Facebook",
    value: "Facebook",
    url: "https://www.facebook.com/share/16JKdw24Rqz/",
    icon: "logo-facebook",
    color: "#1877F2",
  },
  {
    id: "email",
    label: "Email",
    value: "rivoandriharisoa@gmail.com",
    url: "mailto:rivoandriharisoa@gmail.com",
    icon: "mail-outline",
    color: "#B8860B",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "LinkedIn",
    url: "https://www.linkedin.com/in/andriharisoa-rivo",
    icon: "logo-linkedin",
    color: "#0A66C2",
  },
];
