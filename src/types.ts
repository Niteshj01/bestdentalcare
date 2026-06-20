export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  image?: string;
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

export interface GalleryItem {
  id: string;
  url: string;
  createdAt: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  coverImage: string;
  content: string;
  publishDate: string;
}

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  description?: string;
}

export interface ClinicInfoData {
  clinicName: string;
  tagline: string;
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  email: string;
  address: string;
  googleMapsEmbedLink: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

export interface AppointmentItem {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  status: "New" | "Contacted" | "Confirmed" | "Done";
  notes?: string;
  createdAt?: string;
}
