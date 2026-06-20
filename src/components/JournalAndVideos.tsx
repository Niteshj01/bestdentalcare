import { useEffect, useState } from "react";
import { getArticles, getVideos } from "../firebase/firestore";
import { ArticleItem, VideoItem } from "../types";
import { BookOpen, Play, Calendar, ExternalLink, Video, ChevronRight, X, Heart } from "lucide-react";

export default function JournalAndVideos() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"articles" | "videos">("articles");
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedArticles, fetchedVideos] = await Promise.all([
          getArticles(),
          getVideos()
        ]);
        setArticles(fetchedArticles);
        setVideos(fetchedVideos);
      } catch (err) {
        console.error("Error loading frontend journal datasets:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    
    // Set up custom listeners to reload when new items are saved/published
    const handleSync = async () => {
      try {
        const [fetchedArticles, fetchedVideos] = await Promise.all([
          getArticles(),
          getVideos()
        ]);
        setArticles(fetchedArticles);
        setVideos(fetchedVideos);
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("new-article-submitted", handleSync);
    window.addEventListener("new-video-submitted", handleSync);
    return () => {
      window.removeEventListener("new-article-submitted", handleSync);
      window.removeEventListener("new-video-submitted", handleSync);
    };
  }, []);

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
                        onClick={() => setSelectedArticle(item)}
                        className="group bg-[#002517]/40 border border-[#002f1d] hover:border-primary-mint/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1"
                      >
                        {/* Cover Image */}
                        <div className="aspect-[16/10] overflow-hidden bg-emerald-950/50 relative">
                          {item.coverImage ? (
                            <img
                              src={item.coverImage}
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
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#001D11] border border-[#002f1d] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col animate-fade-in text-white/95">
            
            {/* Modal sticky bar */}
            <div className="p-4 border-b border-[#002f1d] flex items-center justify-between bg-[#001D11]">
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

            {/* Scrollable Document Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 scrollbar-thin">
              {/* Cover Banner */}
              {selectedArticle.coverImage && (
                <div className="w-full aspect-[21/9] rounded-xl overflow-hidden bg-emerald-950/30">
                  <img
                    src={selectedArticle.coverImage}
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

              {/* Rich MD Paragraph Formatting */}
              <div className="font-sans text-sm stroke-none text-gray-300 leading-relaxed font-light space-y-4 whitespace-pre-line border-t border-[#002f1d] pt-6">
                {selectedArticle.content}
              </div>

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
