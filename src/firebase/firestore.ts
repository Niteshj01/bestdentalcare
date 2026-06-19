import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  getDoc
} from "firebase/firestore";
import { db } from "./config";
import { 
  ServiceItem, 
  DoctorProfile, 
  GalleryItem, 
  ArticleItem, 
  VideoItem, 
  ClinicInfoData, 
  AppointmentItem 
} from "../types";

// Static default seed data to populate Firestore if empty
const DEFAULT_SERVICES: Omit<ServiceItem, 'id'>[] = [
  {
    icon: "healing",
    title: "Root Canal Treatment",
    description: "Precise endodontic therapy designed to eliminate bacterial infection, preserve the natural tooth structure, and eliminate acute dental pain permanently or temporarily.",
    bullets: ["Virtually painless therapy", "Prevents extraction of damaged teeth", "Rebuilds structural tooth health"]
  },
  {
    icon: "grid_view",
    title: "Orthodontic Treatment",
    description: "Expert dental alignment systems customized to correct malocclusions, crowded arches, overbites, and restore beautiful structural facial harmony.",
    bullets: ["Improvised long-term bite function", "Solves alignment & bite problems", "Custom metal or ceramic bracket solutions"]
  },
  {
    icon: "precision_manufacturing",
    title: "Dental Implants",
    description: "Multi-stage biocompatible titanium implant roots coupled with custom-designed porcelain crowns that match your natural teeth with absolute stability.",
    bullets: ["Lifelike dental feel and look", "Preserves adjacent jaw bone structures", "Restores original biting force"]
  },
  {
    icon: "layers",
    title: "Crown & Bridges & Veneers",
    description: "Premium prosthodontic ceramic solutions crafted to rebuild, seal, protect, or artistically design the visible exterior of your teeth.",
    bullets: ["Custom-shaded natural aesthetics", "Reinforces weak or fractured teeth", "Seamless gaps closure and restoration"]
  },
  {
    icon: "brush",
    title: "Tooth Colour fillings",
    description: "Advanced multi-shade resin bonding to restore decayed, cracked, or worn teeth with composite textures completely indistinguishable from real enamel.",
    bullets: ["Mercury-free composite materials", "Preserves more tooth structure", "Polished natural enamel luster"]
  },
  {
    icon: "medical_services",
    title: "Extractions & Impactions",
    description: "Gentle surgical management of compromised static teeth, including highly complex impacted Wisdom Teeth, prioritizing prompt healing.",
    bullets: ["At-ease painless dental procedures", "Minimally invasive extraction tech", "Guided safe post-surgery protocols"]
  },
  {
    icon: "diversity_1",
    title: "Partial & Complete Dentures",
    description: "Artistic, comfortable, and natural-looking removable prosthetic frameworks designed to replace multiple missing teeth and restore biological chewing functions.",
    bullets: ["Ultra-lightweight acrylic bases", "High stability chewing retention", "Custom matching to natural face lines"]
  },
  {
    icon: "magic_button",
    title: "Teeth Whitening",
    description: "High-grade laser and chemical whitening therapies engineered to lift deep cellular intrinsic enamel stains for a fast, glowing smile rejuvenation.",
    bullets: ["Uplifts 5-8 shades in one session", "Soothes sensitive enamel barriers", "Long-term bright white results"]
  },
  {
    icon: "flare",
    title: "Laser Gum Surgery",
    description: "Next-gen gentle laser therapies designed to treat gum infections, eliminate pocket bacteria, and contour gums without scalpel sutures.",
    bullets: ["Rapid healing with zero sutures", "Extremely precise target correction", "Restores healthy margins quickly"]
  },
  {
    icon: "child_care",
    title: "Pediatric Dentistry (Kids)",
    description: "Gentle, comfortable, and positive oral clinical care for growing babies and children, emphasizing lifetime positive dental habits.",
    bullets: ["Compassionate soft communication", "Protective dental sealants and fluoride", "Fun clinical environment for kids"]
  },
  {
    icon: "visibility",
    title: "Digital X-Ray",
    description: "High-definition diagnostic radiography exposing patients to 90% less radiation while producing crystal-clear instant clinical anatomy views.",
    bullets: ["Instant high-resolution imaging", "Extremely low radiation emission", "Pinpoint pre-treatment diagnostics"]
  },
  {
    icon: "clean_hands",
    title: "Scaling & Polishing",
    description: "Comprehensive ultrasonic scale scraping to safely clear calcareous plaque buildup and gently polish away stubborn external stains.",
    bullets: ["Eliminates bad breath and plaque", "Supports strong healthy gum bonds", "Perfect glossy stain-free clean feel"]
  },
  {
    icon: "align_items_stretch",
    title: "Invisible Braces & Aligners",
    description: "Sleek, transparent, medical-grade polyurethane aligners to shift teeth comfortably into perfect form without noticeable wires.",
    bullets: ["Completely removable for eating", "Virtually invisible visual design", "Includes custom interactive 3D mapping"]
  }
];

const DEFAULT_DOCTORS: Omit<DoctorProfile, 'id'>[] = [
  {
    name: "Dr. Gagandeep S Gauba",
    role: "BDS, MDS - Senior Dentist & Dental Implants Specialist",
    bio: "Dr. Gagandeep S Gauba is a highly distinguished dental implants provider and senior clinician with over 14 years of clinical experience. Specializing in advanced painless implantology, dental aesthetics, single-visit root canals, and precision orthodontics, Dr. Gauba is dedicated to transforming smiles using the latest advancements like digital radiovisiography, endomotors, and state-of-the-art restorative techniques.",
    image: "", // We can use the imported one or fallback to a placeholder
    badge: "Lead Implantologist",
    qualifications: ["B.D.S. & M.D.S. Specialist", "Advanced Implantology", "14+ Years Clinical Excellence"]
  }
];

const DEFAULT_CLINIC_INFO: ClinicInfoData = {
  clinicName: "Dr. Sky Dentistry",
  tagline: "Providing team-based, comprehensive, and painless oral care with premium dental implants, single-visit root canals, cosmetic smile designing, and advanced orthodontics.",
  phone1: "+91 77176 42334",
  phone2: "",
  whatsappNumber: "+91 77176 42334",
  email: "info@drskydentistry.com",
  address: "320, Shastri Nagar, Lajpat Nagar, Near Nakodar Chowk, Jalandhar, Punjab 144001",
  googleMapsEmbedLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.066060410058!2d75.578665!3d31.32832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a5f5f5f5f5f5f%3A0x5f5f5f5f5f5f5f5f!2sShastri+Nagar%2C+Jalandhar!5e0!3m2!1sen!2sin!4v1624024254000!5m2!1sen!2sin",
  openingHours: {
    monday: "Open 24 Hours",
    tuesday: "Open 24 Hours",
    wednesday: "Open 24 Hours",
    thursday: "Open 24 Hours",
    friday: "Open 24 Hours",
    saturday: "Open 24 Hours",
    sunday: "Open 24 Hours"
  },
  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com"
  }
};

// ==========================================
// 1. SERVICES
// ==========================================
export const getServices = async (): Promise<ServiceItem[]> => {
  const colRef = collection(db, "services");
  const snapshot = await getDocs(colRef);
  
  if (snapshot.empty) {
    // Seed and return seeded data
    console.log("Seeding services collection...");
    const list: ServiceItem[] = [];
    for (const item of DEFAULT_SERVICES) {
      const docRef = await addDoc(colRef, item);
      list.push({ id: docRef.id, ...item });
    }
    return list;
  }
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceItem));
};

export const addService = async (service: Omit<ServiceItem, 'id'>): Promise<string> => {
  const colRef = collection(db, "services");
  const docRef = await addDoc(colRef, service);
  return docRef.id;
};

export const updateService = async (id: string, service: Partial<ServiceItem>): Promise<void> => {
  const docRef = doc(db, "services", id);
  await updateDoc(docRef, service);
};

export const deleteService = async (id: string): Promise<void> => {
  const docRef = doc(db, "services", id);
  await deleteDoc(docRef);
};

// ==========================================
// 2. DOCTORS
// ==========================================
export const getDoctors = async (defaultImgUrl: string = ""): Promise<DoctorProfile[]> => {
  const colRef = collection(db, "doctors");
  const snapshot = await getDocs(colRef);
  
  if (snapshot.empty) {
    console.log("Seeding doctors collection...");
    const list: DoctorProfile[] = [];
    for (const item of DEFAULT_DOCTORS) {
      const seededItem = { ...item, image: item.image || defaultImgUrl };
      const docRef = await addDoc(colRef, seededItem);
      list.push({ id: docRef.id, ...seededItem });
    }
    return list;
  }
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DoctorProfile));
};

export const addDoctor = async (doctor: Omit<DoctorProfile, 'id'>): Promise<string> => {
  const colRef = collection(db, "doctors");
  const docRef = await addDoc(colRef, doctor);
  return docRef.id;
};

export const updateDoctor = async (id: string, doctor: Partial<DoctorProfile>): Promise<void> => {
  const docRef = doc(db, "doctors", id);
  await updateDoc(docRef, doctor);
};

export const deleteDoctor = async (id: string): Promise<void> => {
  const docRef = doc(db, "doctors", id);
  await deleteDoc(docRef);
};

// ==========================================
// 3. GALLERY
// ==========================================
export const getGallery = async (): Promise<GalleryItem[]> => {
  const colRef = collection(db, "gallery");
  const q = query(colRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
};

export const addGalleryItem = async (url: string): Promise<string> => {
  const colRef = collection(db, "gallery");
  const docRef = await addDoc(colRef, {
    url,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  const docRef = doc(db, "gallery", id);
  await deleteDoc(docRef);
};

// ==========================================
// 4. ARTICLES
// ==========================================
export const getArticles = async (): Promise<ArticleItem[]> => {
  const colRef = collection(db, "articles");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem))
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
};

export const addArticle = async (article: Omit<ArticleItem, 'id'>): Promise<string> => {
  const colRef = collection(db, "articles");
  const docRef = await addDoc(colRef, article);
  return docRef.id;
};

export const updateArticle = async (id: string, article: Partial<ArticleItem>): Promise<void> => {
  const docRef = doc(db, "articles", id);
  await updateDoc(docRef, article);
};

export const deleteArticle = async (id: string): Promise<void> => {
  const docRef = doc(db, "articles", id);
  await deleteDoc(docRef);
};

// ==========================================
// 5. VIDEOS
// ==========================================
export const getVideos = async (): Promise<VideoItem[]> => {
  const colRef = collection(db, "videos");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoItem));
};

export const addVideo = async (video: Omit<VideoItem, 'id'>): Promise<string> => {
  const colRef = collection(db, "videos");
  const docRef = await addDoc(colRef, video);
  return docRef.id;
};

export const deleteVideo = async (id: string): Promise<void> => {
  const docRef = doc(db, "videos", id);
  await deleteDoc(docRef);
};

// ==========================================
// 6. CLINIC INFO
// ==========================================
export const getClinicInfo = async (): Promise<ClinicInfoData> => {
  const docRef = doc(db, "clinic_info", "info");
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    console.log("Seeding clinic_info collection...");
    await setDoc(docRef, DEFAULT_CLINIC_INFO);
    return DEFAULT_CLINIC_INFO;
  }
  
  return docSnap.data() as ClinicInfoData;
};

export const updateClinicInfo = async (info: ClinicInfoData): Promise<void> => {
  const docRef = doc(db, "clinic_info", "info");
  await setDoc(docRef, info, { merge: true });
};

// ==========================================
// 7. APPOINTMENTS
// ==========================================
export const getAppointments = async (): Promise<AppointmentItem[]> => {
  const colRef = collection(db, "appointments");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppointmentItem))
    .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
};

export const addAppointment = async (appointment: Omit<AppointmentItem, 'id' | 'status' | 'createdAt'>): Promise<string> => {
  const colRef = collection(db, "appointments");
  const docRef = await addDoc(colRef, {
    ...appointment,
    status: "New",
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const updateAppointmentStatus = async (id: string, status: AppointmentItem["status"]): Promise<void> => {
  const docRef = doc(db, "appointments", id);
  await updateDoc(docRef, { status });
};

export const deleteAppointment = async (id: string): Promise<void> => {
  const docRef = doc(db, "appointments", id);
  await deleteDoc(docRef);
};
