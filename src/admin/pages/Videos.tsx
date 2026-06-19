import React, { useState, useEffect } from "react";
import { getVideos, addVideo, deleteVideo } from "../../firebase/firestore";
import { VideoItem } from "../../types";
import Modal from "../components/Modal";

interface VideosProps {
  showToast: (message: string, type: "success" | "error") => void;
}

export default function Videos({ showToast }: VideosProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await getVideos();
      setVideos(data);
    } catch (err) {
      console.error("Error loading videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
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

  const handleUrlBlur = () => {
    const yid = getYoutubeId(videoUrl);
    if (yid && !title) {
      setTitle(`Consultation Video (ID: ${yid})`);
    }
  };

  const handleDelete = async (id: string, videoTitle: string) => {
    if (!window.confirm(`Verify: Remove video "${videoTitle}"?`)) {
      return;
    }

    try {
      await deleteVideo(id);
      setVideos(prev => prev.filter(v => v.id !== id));
      showToast("Educational clip detached successfully.", "success");
    } catch (err) {
      showToast("Failed to detach video record.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const yid = getYoutubeId(videoUrl);
    if (!yid) {
      showToast("Please enter a valid YouTube URL.", "error");
      return;
    }

    setSubmitLoading(true);
    const payload = {
      title,
      videoUrl: `https://www.youtube.com/embed/${yid}`,
      description: description || ""
    };

    try {
      await addVideo(payload);
      showToast("New education video successfully registered!", "success");
      setModalOpen(false);
      fetchVideos();
    } catch (err) {
      showToast("Failed to write video record.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-0.5 text-left">
          <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-widest">
            Education Video Clinic
          </h3>
          <p className="font-sans text-[10px] text-gray-450 uppercase tracking-wider font-semibold">
            Attach patient clinical consultations or YouTube smile makeover embeds
          </p>
        </div>
        <button
          onClick={() => {
            setTitle("");
            setVideoUrl("");
            setDescription("");
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#3eb489] hover:bg-[#20946b] text-white px-5 py-3 rounded-2xl font-sans text-[10.5px] uppercase tracking-widest font-bold shadow-md shadow-primary-mint/15 hover:shadow-primary-mint/30 hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px] font-bold">video_call</span>
          <span>Add Educational video</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-50 flex flex-col items-center justify-center gap-2.5">
          <div className="w-8 h-8 border-3 border-primary-mint border-t-transparent rounded-full animate-spin" />
          <span className="font-sans text-xs text-gray-400 font-semibold uppercase tracking-wider">Syncing video database...</span>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center font-sans space-y-3">
          <span className="material-symbols-outlined text-4xl text-gray-300">smart_display</span>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No interactive video links recorded.</p>
          <p className="text-[10px] text-gray-400">Add custom patient walk-throughs above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => {
            const yid = getYoutubeId(vid.videoUrl) || vid.videoUrl;
            const thumbUrl = yid.length === 11 
              ? `https://img.youtube.com/vi/${yid}/mqdefault.jpg`
              : `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80`;

            return (
              <div key={vid.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between text-left group">
                
                {/* Simulated Thumbnail */}
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  <img 
                    src={thumbUrl} 
                    alt={vid.title} 
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating play indicator bar */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary-mint/90 border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined text-md font-bold text-center pl-0.5">play_arrow</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[8.5px] bg-[#eafef7] text-[#1c7855] text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      YouTube Integration
                    </span>
                    <h4 className="font-sans text-xs font-bold text-gray-900 line-clamp-1 leading-snug">{vid.title}</h4>
                    {vid.description && (
                      <p className="font-sans text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{vid.description}</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-end">
                    <button
                      onClick={() => handleDelete(vid.id, vid.title)}
                      className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 hover:bg-rose-600 text-rose-500 hover:text-white transition-all text-[11px] font-sans font-bold uppercase tracking-widest cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm leading-none">delete</span>
                      <span>Detach Video</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Video Registration dialog */}
      <Modal
        isOpen={modalOpen}
        title="Add Educational Video"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs text-gray-700">
          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">YouTube Video URL</label>
            <input
              required
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Video Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tooth Extraction Complete Pre-Op Walkthrough"
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Supplementary Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a clinical synopsis of the cosmetic or implant techniques referenced in the educational video..."
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3.5">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-3 rounded-xl border border-gray-150 hover:bg-gray-50 text-gray-500 font-sans text-[10.5px] uppercase tracking-widest font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="bg-[#3eb489] hover:bg-[#20946b] text-white px-6 py-3 rounded-xl font-sans text-[10.5px] uppercase tracking-widest font-bold shadow-md shadow-primary-mint/15 transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitLoading ? "Publishing link..." : "Register Video"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
