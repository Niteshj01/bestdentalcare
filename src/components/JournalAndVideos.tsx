import { useEffect, useState } from "react";
import { ArticleItem, VideoItem } from "../types";
import { BookOpen, Play, Calendar, ExternalLink, Video, ChevronRight, X, Heart, Clock, Activity, CheckCircle2, HelpCircle, ChevronDown, Shield } from "lucide-react";
import { resolveAsset } from "../utils/resolveAsset";

const fallbackArticles: ArticleItem[] = [
  {
    id: "root-canal-care",
    title: "Understanding Modern Painless Root Canal Therapy",
    content: "Root canal treatment has evolved significantly over the last decade. With advanced electronic endomotors, digital radiography, and micro-precision tools, the therapy is completely painless, comfortable, and highly successful. At Dr. Sky Dentistry, we preserve your natural teeth using advanced biological techniques designed to restore absolute strength.",
    coverImage: "/111.jpg",
    publishDate: "JUNE 15, 2026",
    detailedBlueprint: {
      duration: "1-2 Sessions (45-60 mins each)",
      complexity: "Micro-Endodontic Precision",
      objective: "Eliminate bacterial decay, save the natural tooth root structure, and re-establish durable bite strength.",
      introduction: "Root canal therapy (endodontic treatment) is required when the soft inner pulp of a tooth becomes inflamed or infected due to deep decay, trauma, or a cracked surface. At Dr. Sky Dentistry, we utilize state-of-the-art micro-precision tools, active fluid irrigation, and digital radiography. What used to be a long, uncomfortable procedure is now completely painless, swift, and highly comfortable.",
      clinicalSteps: [
        { title: "Step 1: High-Definition 3D Imaging", description: "First, we take a digital snapshot or micro-radiograph of the tooth and its roots to identify the precise shape of the canals and detect any surrounding bone infection." },
        { title: "Step 2: Absolute Comfort Localization", description: "Dr. Sky administers localized advanced biological anesthesia to completely desensitize the tooth structure, assuring absolute patient comfort prior to any treatment." },
        { title: "Step 3: Micro-Cleansing & Shaping", description: "Using flexible NiTi electronic endomotors, we perform micro-cleansing of the infected root canals, rinsing the biological pathway with warm antibacterial fluid to eliminate all pathogens." },
        { title: "Step 4: Biocompatible Hermetic Sealing", description: "The cleared biological passages are filled and hermetically sealed with a natural biocompatible resin compound (Gutta-Percha) that blocks future bacterial infiltration." },
        { title: "Step 5: Structural Reinforcement", description: "To complete the therapy and return natural bite resilience, a premium monolithic porcelain crown or ceramic filling is placed to cover the pristine natural architecture." }
      ],
      careGuidelines: [
        "Avoid hard chew foods on the treated side for the first 48 hours until structural healing is fully complete.",
        "Take mild over-the-counter anti-inflammatories if you experience slight biological tenderness during the first day.",
        "Maintain excellent brushing and flossing routines; the restored tooth behaves exactly like your healthy natural teeth."
      ],
      faq: [
        { question: "Is root canal treatment really painless?", answer: "Yes! Modern anesthesia paired with Dr. Sky's advanced soft-tissue techniques ensures you won't feel anything during the procedure. It feels similar to getting a routine composite filling." },
        { question: "How long does a completed root canal treatment last?", answer: "A root canal treatment has a success rate of over 95%. When reinforced with a high-strength custom crown, it can easily last a lifetime with proper hygiene." }
      ]
    }
  },
  {
    id: "digital-dental-implants",
    title: "The Ultimate Guide to Digital Dental Implants",
    content: "Dental implants provide the most natural-feeling, beautiful option for replacing missing teeth. This surgical guide walks you through digital implant targeting, customized abutment modeling, and biological tooth osseointegration. Experience lifetime smile integrity and natural bite forces.",
    coverImage: "/113.jpg",
    publishDate: "MAY 28, 2026",
    detailedBlueprint: {
      duration: "Completed over 3-6 Months in stages",
      complexity: "Surgical Bio-Integration",
      objective: "Securely anchor a biocompatible titanium fixture directly into the jawbone, supporting a beautiful custom-milled crown.",
      introduction: "When a natural tooth is lost, both the cosmetic crown and the root underneath disappear. This can lead to bone decay and teeth shifting. A digital dental implant replicates the natural tooth's overall structure by placing a grade-4 titanium post directly into the bone. At Dr. Sky Dentistry, implants are placed using digital guide-sleeves customized precisely to your CBCT 3D bone scan, guaranteeing perfect placement.",
      clinicalSteps: [
        { title: "Step 1: CBCT 3D Bone Scopes", description: "We conduct high-resolution computerized tomography (CBCT) scans to map your underlying bone density, sinuses, and nerves in 3D." },
        { title: "Step 2: Virtual Surgical Planning", description: "Dr. Sky plans the exact angle, depth, and diameter of the titanium post within a virtual 3D rendering, creating a custom surgical guide template." },
        { title: "Step 3: Biocompatible Placement", description: "The surgical guide is positioned in the mouth to place the implant within fractions of a millimeter. The procedure represents minimal discomfort and is faster than standard implants." },
        { title: "Step 4: Osseointegration Period", description: "Over a span of 3 to 4 months, the surrounding jawbone tissue fuses organically with the titanium implant surface in a process known as osseointegration." },
        { title: "Step 5: Hand-Crafted Crown Restoration", description: "An aesthetic custom abutment is connected, and a premium Zirconia or porcelain crown is permanently locked into position, creating flawless visual harmony." }
      ],
      careGuidelines: [
        "Stick to a soft diet for the first week post-placement to prevent unneeded stress on the early-stage implant.",
        "Rinse gently with warm salt water or a prescribed antiseptic mouthwash instead of aggressive brushing of the surgical spot.",
        "Avoid smoking and tobacco, as nicotine restricts healthy blood circulation and can inhibit proper osseointegration."
      ],
      faq: [
        { question: "Who is a candidate for dental implants?", answer: "Any adult with good systemic medical health and sufficient bone volume is an ideal candidate. Even if bone depth is low, bone grafting can be done to prepare for an implant." },
        { question: "How do I care for my dental implant?", answer: "Dental implants are brushed and flossed exactly like natural teeth! You do not need any special tools, just regular cleanings and checkups with Dr. Sky." }
      ]
    }
  },
  {
    id: "clear-aligners-revolution",
    title: "Why Clear Aligners are Restructuring Modern Orthodontics",
    content: "Forget visible metal wires. Clear orthodontics and micro-precision aligners allow patient teeth straightening under invisible, comfortable parameters. Dr. Sky's advanced aligner plans use custom bio-tracking aligners tailored exactly to your unique orthodontic scan.",
    coverImage: "/112.jpg",
    publishDate: "APRIL 10, 2026",
    detailedBlueprint: {
      duration: "6-15 Months depending on misalignment",
      complexity: "Computerized Orthodontic Movement",
      objective: "Systematically reposition misaligned, crowded, or spaced teeth using a consecutive sequence of invisible polyurethane trays.",
      introduction: "Clear aligners represent a revolutionary leap in modern orthodontics. Using state-of-the-art clear thermoplastic materials and advanced predictive software, we can shift teeth into their optimal aesthetic and functional orientation without unsightly metal brackets or wire adjustments. It is incredibly comfortable, hygienic, and fits seamlessly into any busy lifestyle.",
      clinicalSteps: [
        { title: "Step 1: Intraoral 3D Scan", description: "No messy physical molds are used. We use a high-speed intraoral scanner to capture a high-fidelity 3D digital model of your dental arches." },
        { title: "Step 2: Orthodontic Path Simulation", description: "Using predictive simulation software, Dr. Sky plans the precise movement path of each individual tooth, showing you a virtual 3D video of your future smile." },
        { title: "Step 3: Micro-Print Aligner Fabrication", description: "A sequential set of active, medical-grade polyurethane aligners is laser-cut and hand-polished specifically to match each precise milestone of your sequence." },
        { title: "Step 4: Consistent Wear Routine", description: "You wear each clear aligner tray for 20 to 22 hours daily, popping them out only to eat, brush, and floss. You will swap to a new set every 7 to 10 days." },
        { title: "Step 5: Aesthetic Smile Realization", description: "After the target series is completed, a thin, discrete retainer is placed on the inside surfaces to lock your beautiful outcome securely in place." }
      ],
      careGuidelines: [
        "Always clean and brush your natural teeth before re-inserting your aligners to prevent sugar and plaque from being trapped against the enamel.",
        "Only drink cold water while wearing your aligners; hot beverages can warp the active thermoplastic material.",
        "Clean your aligners with mild, unscented soap and lukewarm water, avoiding colored toothpaste that can scratch or cloud them."
      ],
      faq: [
        { question: "Is clear orthodontic treatment painful?", answer: "No, but you will feel a mild, snug sensation of pressure for the first day or two after shifting to a fresh aligner tray. This indicates that your teeth are moving correctly." },
        { question: "Can aligners fix adult crowding and bite issues?", answer: "Absolutely! Over 80% of adult mild-to-moderate alignment, overbite, deep bite, and spacing issues can be treated successfully using clear aligners." }
      ]
    }
  }
];

const fallbackVideos: VideoItem[] = [
  {
    id: "video-1",
    title: "Virtually Explore Dr. Sky Dentistry",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Take an interactive look around our luxury dental clinic, from painless treatment suites to professional clinical specialists."
  }
];

export default function JournalAndVideos() {
  const [articles, setArticles] = useState<ArticleItem[]>(fallbackArticles);
  const [videos, setVideos] = useState<VideoItem[]>(fallbackVideos);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"articles" | "videos">("articles");
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const workerUrl = (import.meta as any).env?.VITE_WORKER_URL || "";
        const isValidUrl = workerUrl && (workerUrl.startsWith("http://") || workerUrl.startsWith("https://") || workerUrl.startsWith("/"));
        if (!isValidUrl) {
          setLoading(false);
          return;
        }

        const [resArticles, resVideos] = await Promise.all([
          fetch(`${workerUrl}/api/articles`),
          fetch(`${workerUrl}/api/videos`)
        ]);

        if (resArticles.ok) {
          const dataArticles = await resArticles.json();
          if (Array.isArray(dataArticles) && dataArticles.length > 0) {
            const mappedArticles: ArticleItem[] = dataArticles.map((art: any) => ({
              id: String(art.id),
              title: art.title,
              content: art.content,
              coverImage: art.cover_image,
              publishDate: art.publish_date,
              detailedBlueprint: {
                duration: "1 Session (30-45 mins)",
                complexity: "Educational Consultative Guidance",
                objective: `Inform patient protocols concerning ${art.title}.`,
                introduction: art.content,
                clinicalSteps: [
                  { title: "Step 1: Clinical Assessment", description: "Reviewing oral logs and establishing pristine diagnostic baselines." },
                  { title: "Step 2: Interactive Consultation", description: "Dr. Sky walks through targeted biological parameters customized to your health structure." }
                ],
                careGuidelines: [
                  "Maintain excellent daily brushing and flossing routines.",
                  "Schedule general maintenance checkups every 6 months."
                ],
                faq: [
                  { question: "Who should read this guide?", answer: "Any patient looking to optimize their personal care and overall oral health." }
                ]
              }
            }));
            setArticles(mappedArticles);
          }
        }

        if (resVideos.ok) {
          const dataVideos = await resVideos.json();
          if (Array.isArray(dataVideos) && dataVideos.length > 0) {
            const mappedVideos: VideoItem[] = dataVideos.map((vid: any) => ({
              id: String(vid.id),
              title: vid.title,
              videoUrl: vid.youtube_url,
              description: vid.description || "Video demonstration"
            }));
            setVideos(mappedVideos);
          }
        }
      } catch (err) {
        console.warn("Clinical articles/videos offline or unreachable, using local fallback content.");
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const handleOpenArticle = (item: ArticleItem) => {
    setSelectedArticle(item);
    setOpenFaqIndex(null);
  };

  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      (window as any).lenis?.stop();
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      (window as any).lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      (window as any).lenis?.start();
    };
  }, [selectedArticle]);

  const getYoutubeId = (url: string): string | null => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    } catch (e) {
      return null;
    }
  };

  return (
    <section id="media-center" className="py-24 bg-[#001D11] text-white px-6 md:px-12 relative overflow-hidden border-t border-[#002f1d]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(62,180,137,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#002f1d] pb-8">
          <div className="space-y-3">
            <span className="font-dm text-xs md:text-sm font-semibold text-primary-mint tracking-[0.2em] uppercase block">
              Patient Resource Hub
            </span>
            <h2 className="font-cormorant text-4xl md:text-5xl font-bold tracking-tight text-white max-w-xl">
              Aesthetic Journal & Clinical Video Library
            </h2>
          </div>

          {/* Luxury Rounded Tab Controllers */}
          <div className="flex bg-[#002f1d]/50 p-1 rounded-full border border-[#002f1d] shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("articles")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                activeTab === "articles"
                  ? "bg-primary-mint text-white shadow-lg shadow-primary-mint/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dental Journal</span>
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                activeTab === "videos"
                  ? "bg-primary-mint text-white shadow-lg shadow-primary-mint/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Care Videos</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-primary-mint border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400 font-mono tracking-wider">Syncing aesthetic library. Please wait...</span>
          </div>
        ) : (
          <div>
            {/* ARTICLES TAB PANEL */}
            {activeTab === "articles" && (
              <div>
                {articles.length === 0 ? (
                  <div className="text-center py-24 bg-[#002517]/30 border border-[#002f1d] rounded-2xl flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto px-6">
                    <div className="w-12 h-12 rounded-full bg-[#dfba5c]/10 flex items-center justify-center text-[#dfba5c]">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-cormorant text-2xl font-bold text-white">No articles published yet</h4>
                      <p className="text-xs text-gray-400 font-sans max-w-md mx-auto leading-relaxed">
                        Our clinical experts are crafting premium educational guides and articles. Please check back soon or visit the administrator command core to publish one.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleOpenArticle(item)}
                        className="group bg-[#002517]/40 border border-[#002f1d] hover:border-primary-mint/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1"
                      >
                        {/* Cover Image */}
                        <div className="aspect-[16/10] overflow-hidden bg-emerald-950/50 relative">
                          {item.coverImage ? (
                            <img
                              src={resolveAsset(item.coverImage)}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-950 to-[#002517] text-[#dfba5c]">
                              <BookOpen className="w-10 h-10 stroke-[1.25]" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 bg-primary-mint/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest leading-none">
                            Dental Guide
                          </div>
                        </div>

                        {/* Text Details info */}
                        <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                              <Calendar className="w-3 h-3 text-[#dfba5c]" />
                              <span>{item.publishDate || "LATEST RELEASE"}</span>
                            </div>
                            <h3 className="font-cormorant text-2xl font-bold text-white group-hover:text-primary-mint transition-colors line-clamp-2 leading-snug">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-400 font-sans line-clamp-3 leading-relaxed">
                              {item.content.replace(/[#*`_]/g, '')}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#002f1d]/65 flex items-center justify-between text-xs text-[#dfba5c] font-bold uppercase tracking-wider font-sans group-hover:text-primary-mint transition-all">
                            <span>Read Blueprint</span>
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIDEOS TAB PANEL */}
            {activeTab === "videos" && (
              <div>
                {videos.length === 0 ? (
                  <div className="text-center py-24 bg-[#002517]/30 border border-[#002f1d] rounded-2xl flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto px-6">
                    <div className="w-12 h-12 rounded-full bg-[#dfba5c]/10 flex items-center justify-center text-[#dfba5c]">
                      <Video className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-cormorant text-2xl font-bold text-white">No video consultations uploaded</h4>
                      <p className="text-xs text-gray-400 font-sans max-w-md mx-auto leading-relaxed">
                        Clinical procedure breakdowns and cosmetic dentistry overviews are being prepared. Registered administrators can post YouTube-integrated modules directly.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((item) => {
                      const ytId = getYoutubeId(item.videoUrl);
                      return (
                        <div
                          key={item.id}
                          className="group bg-[#002517]/40 border border-[#002f1d] hover:border-primary-mint/30 rounded-2xl overflow-hidden transition-all"
                        >
                          {/* Youtube Player Container Frame */}
                          <div className="aspect-video w-full bg-black relative">
                            {ytId ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                                title={item.title}
                                className="w-full h-full border-0 absolute inset-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <a
                                href={item.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-full flex flex-col items-center justify-center gap-2 text-primary-mint hover:bg-black/80 transition-all font-mono text-[10px] uppercase font-bold tracking-widest"
                              >
                                <Play className="w-12 h-12 stroke-[1] text-[#dfba5c] animate-pulse" />
                                <span>Watch on External Portal</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          <div className="p-6 space-y-2">
                            <span className="font-mono text-[9px] text-[#dfba5c] uppercase font-bold tracking-widest border border-[#dfba5c]/35 px-2 py-0.5 rounded-full inline-block">
                              Interactive consultation
                            </span>
                            <h3 className="font-cormorant text-xl font-bold text-white leading-normal">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-xs text-gray-400 font-sans leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ARTICLE FULL READ LIGHTBOX MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md overflow-y-auto p-4 md:py-12 flex justify-center items-start">
          <div className="bg-[#001D11] border border-[#002f1d] rounded-2xl w-full max-w-3xl shadow-2xl relative flex flex-col animate-fade-in text-white/95 my-auto">
            
            {/* Modal sticky bar */}
            <div className="p-4 border-b border-[#002f1d] flex items-center justify-between bg-[#001D11] rounded-t-2xl sticky top-0 z-10">
              <div className="flex items-center gap-2 text-primary-mint uppercase font-mono text-[10px] font-bold tracking-widest">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Dental Care Masterclass</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-[#002f1d] border border-emerald-950 hover:bg-[#003d27] flex items-center justify-center text-gray-300 transition-colors cursor-pointer"
                aria-label="Close article reading screen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Content */}
            <div 
              data-lenis-prevent
              className="p-6 md:p-8 space-y-6 animate-gpu"
            >
              {/* Cover Banner */}
              {selectedArticle.coverImage && (
                <div className="w-full aspect-[21/9] rounded-xl overflow-hidden bg-emerald-950/30">
                  <img
                    src={resolveAsset(selectedArticle.coverImage)}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400 uppercase">
                  <span>Published:</span>
                  <strong className="text-[#dfba5c]">{selectedArticle.publishDate || "LATEST"}</strong>
                </div>

                <h2 className="font-cormorant text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>

              {/* Spec Sheet Grid if Detailed Blueprint is Available */}
              {selectedArticle.detailedBlueprint && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#002517]/60 border border-[#002f1d] p-4 rounded-xl">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#dfba5c]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Duration</span>
                    </div>
                    <p className="text-sm font-sans text-white font-medium">{selectedArticle.detailedBlueprint.duration}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#dfba5c]">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Complexity</span>
                    </div>
                    <p className="text-sm font-sans text-white font-medium">{selectedArticle.detailedBlueprint.complexity}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#dfba5c]">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Key Objective</span>
                    </div>
                    <p className="text-xs font-sans text-gray-300 leading-normal">{selectedArticle.detailedBlueprint.objective}</p>
                  </div>
                </div>
              )}

              {/* Clinical Introduction / Overview */}
              <div className="font-sans text-sm stroke-none text-gray-300 leading-relaxed font-light space-y-4 whitespace-pre-line border-t border-[#002f1d] pt-6">
                <p>
                  {selectedArticle.detailedBlueprint?.introduction || selectedArticle.content}
                </p>
              </div>

              {/* Step-by-Step Treatment Protocol Roadmap */}
              {selectedArticle.detailedBlueprint?.clinicalSteps && (
                <div className="space-y-4 pt-4">
                  <h3 className="font-cormorant text-2xl font-bold text-white border-b border-[#002f1d] pb-2">
                    Treatment Protocol Overview & Steps
                  </h3>
                  <div className="space-y-4">
                    {selectedArticle.detailedBlueprint.clinicalSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-xl bg-[#002517]/20 border border-[#002f1d]/60 hover:border-primary-mint/30 transition-all">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-mint/10 border border-primary-mint/35 flex items-center justify-center font-mono text-xs font-bold text-primary-mint">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-white font-sans">{step.title}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-sans">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Biological Post-Treatment Guidelines */}
              {selectedArticle.detailedBlueprint?.careGuidelines && (
                <div className="space-y-4 pt-4">
                  <div className="p-5 rounded-xl border border-primary-mint/20 bg-gradient-to-br from-[#002517]/50 to-[#001D11] space-y-3">
                    <h4 className="font-cormorant text-xl font-bold text-[#dfba5c] flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary-mint" />
                      Biological Post-Treatment Protocol
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedArticle.detailedBlueprint.careGuidelines.map((guideline, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 font-sans leading-relaxed">
                          <span className="text-primary-mint mt-1">✦</span>
                          <span>{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Collapsible FAQ Accordion for patients */}
              {selectedArticle.detailedBlueprint?.faq && (
                <div className="space-y-4 pt-4 pb-2">
                  <h3 className="font-cormorant text-2xl font-bold text-white border-b border-[#002f1d] pb-2">
                    Patient Frequently Asked Questions
                  </h3>
                  <div className="space-y-2">
                    {selectedArticle.detailedBlueprint.faq.map((item, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div
                          key={idx}
                          className="border border-[#002f1d] bg-[#002517]/20 rounded-xl overflow-hidden transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between p-4 text-left font-sans text-xs font-semibold text-white tracking-wide hover:text-primary-mint transition-colors cursor-pointer"
                          >
                            <span>{item.question}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                                isOpen ? "transform rotate-180 text-primary-mint" : ""
                              }`}
                            />
                          </button>
                          <div
                            className={`transition-all duration-300 ease-in-out ${
                              isOpen ? "max-h-[300px] border-t border-[#002f1d] p-4 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                            }`}
                          >
                            <p className="text-xs text-gray-400 font-sans leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-[#002f1d] flex items-center justify-between text-[11px] font-sans text-gray-400">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-primary-mint">
                  <Heart className="w-3.5 h-3.5 fill-primary-mint stroke-none" />
                  <span>Dr. Sky Smile Alliance</span>
                </div>
                <span>© {new Date().getFullYear()} Dr. Sky Dentistry</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
