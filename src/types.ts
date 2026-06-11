export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  bullets: string[];
}

export interface DoctorProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  badge: string;
  qualifications: string[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatarBg: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface InstagramPost {
  id: string;
  image: string;
  alt: string;
}
