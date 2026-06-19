import React, { useState, useEffect, useRef } from "react";
import { getArticles, addArticle, updateArticle, deleteArticle } from "../../firebase/firestore";
import { uploadFile } from "../../firebase/storage";
import { ArticleItem } from "../../types";
import Modal from "../components/Modal";

interface ArticlesProps {
  showToast: (message: string, type: "success" | "error") => void;
}

export default function Articles({ showToast }: ArticlesProps) {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenComposer = () => {
    setEditingArticle(null);
    setTitle("");
    setImageUrl("");
    setContent("");
    setPublishDate(new Date().toISOString().split("T")[0]);
    setUploadProgress(null);
    setComposerOpen(true);
  };

  const handleOpenEdit = (article: ArticleItem) => {
    setEditingArticle(article);
    setTitle(article.title);
    setImageUrl(article.coverImage || "");
    setContent(article.content);
    setPublishDate(article.publishDate || new Date().toISOString().split("T")[0]);
    setUploadProgress(null);
    setComposerOpen(true);
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(1);
    try {
      const url = await uploadFile(file, "articles", (progress) => {
        setUploadProgress(progress);
      });
      setImageUrl(url);
      showToast("Cover photo uploaded successfully.", "success");
    } catch (err) {
      showToast("Failed to upload cover photo.", "error");
    } finally {
      setUploadProgress(null);
    }
  };

  const handleDelete = async (id: string, artTitle: string) => {
    if (!window.confirm(`Verify release: Delete selected article "${artTitle}"?`)) {
      return;
    }

    try {
      await deleteArticle(id);
      setArticles(prev => prev.filter(art => art.id !== id));
      showToast(`Article "${artTitle}" removed successfully.`, "success");
    } catch (err) {
      showToast("Failed to delete article.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    const payload = {
      title,
      coverImage: imageUrl || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80",
      content,
      publishDate: publishDate || new Date().toISOString().split("T")[0]
    };

    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, payload);
        showToast("Article amendments saved successfully!", "success");
      } else {
        await addArticle(payload);
        showToast("New health article published successfully!", "success");
      }
      setComposerOpen(false);
      fetchArticles();
    } catch (err) {
      showToast("Failed to publish journal article.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Quick rich tools formatting for textarea
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const formatted = prefix + (selected || "text") + suffix;
    const nextVal = text.substring(0, start) + formatted + text.substring(end);
    setContent(nextVal);

    // Focus and restore selections
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || "text").length);
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-0.5 text-left">
          <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-widest">
            Aesthetic Journals & Blogs
          </h3>
          <p className="font-sans text-[10px] text-gray-450 uppercase tracking-wider font-semibold">
            Publish educational articles and dental tips to the patient portal
          </p>
        </div>
        <button
          onClick={handleOpenComposer}
          className="flex items-center gap-2 bg-[#3eb489] hover:bg-[#1fa171] text-white px-5 py-3 rounded-2xl font-sans text-[10.5px] uppercase tracking-widest font-bold shadow-md shadow-primary-mint/15 hover:shadow-primary-mint/30 hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px] font-bold">add_box</span>
          <span>Compose Article</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-50 flex flex-col items-center justify-center gap-2.5">
          <div className="w-8 h-8 border-3 border-primary-mint border-t-transparent rounded-full animate-spin" />
          <span className="font-sans text-xs text-gray-400 font-semibold uppercase tracking-wider">Syncing journals database...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center font-sans space-y-3">
          <span className="material-symbols-outlined text-4xl text-gray-300">feed</span>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No published articles found.</p>
          <p className="text-[10px] text-gray-400">Write helpful insights for clinical patients above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <div key={art.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row text-left hover:shadow-md transition-shadow">
              
              {/* Cover Thumbnail */}
              <div className="w-full sm:w-44 h-44 sm:h-auto relative shrink-0 aspect-video sm:aspect-auto">
                <img 
                  src={art.coverImage} 
                  alt={art.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5 text-left">
                  <span className="text-[9.5px] text-primary-mint uppercase font-bold tracking-widest">
                    Published: {art.publishDate}
                  </span>
                  <h4 className="font-sans text-xs md:text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                    {art.title}
                  </h4>
                  <p className="font-sans text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                    {art.content.replace(/<[^>]*>/g, "").substring(0, 110)}...
                  </p>
                </div>

                {/* Operations bar */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => handleOpenEdit(art)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-600 hover:text-primary-mint text-[10px] font-sans font-bold uppercase tracking-widest transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs leading-none">edit</span>
                    <span>Edit Draft</span>
                  </button>
                  <button
                    onClick={() => handleDelete(art.id, art.title)}
                    className="w-8 h-8 rounded-lg border border-rose-100 bg-rose-50/20 hover:bg-rose-600 text-rose-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    title="Remove Article"
                  >
                    <span className="material-symbols-outlined text-xs">delete</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Composition full/half screen modal */}
      <Modal
        isOpen={composerOpen}
        title={editingArticle ? "Edit Article" : "Compose Article"}
        onClose={() => setComposerOpen(false)}
        maxWidthClass="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs text-gray-700">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Article Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Aligners vs Classic Braces"
                className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Publish Date</label>
              <input
                required
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-150 bg-white rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Cover Image location</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Unsplash image URL, or click upload button..."
                className="flex-1 px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 text-xs text-gray-800 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 rounded-xl border border-gray-150 hover:bg-gray-50 text-gray-600 flex items-center justify-center cursor-pointer transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-sm leading-none">cloud_upload</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadCover}
                accept="image/*"
                className="hidden"
              />
            </div>
            {uploadProgress !== null && (
              <div className="w-full bg-gray-50 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-primary-mint h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Content Composer</label>
            
            {/* Quick rich toolbars formatting panel */}
            <div className="flex items-center gap-1.5 bg-gray-50/50 p-2.5 rounded-t-xl border-x border-t border-gray-150">
              <button
                type="button"
                onClick={() => insertFormatting("<h4>", "</h4>")}
                className="px-2.5 py-1 text-[9.5px] uppercase tracking-wider font-extrabold text-gray-600 hover:text-gray-900 border border-gray-200 bg-white rounded-md cursor-pointer transition-colors shadow-sm"
              >
                Header 4
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("<strong>", "</strong>")}
                className="px-2.5 py-1 text-[9.5px] uppercase tracking-wider font-extrabold text-gray-600 hover:text-gray-900 border border-gray-200 bg-white rounded-md cursor-pointer transition-colors shadow-sm"
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("<p>", "</p>")}
                className="px-2.5 py-1 text-[9.5px] uppercase tracking-wider font-extrabold text-gray-600 hover:text-gray-900 border border-gray-200 bg-white rounded-md cursor-pointer transition-colors shadow-sm"
              >
                Paragraph
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("• ")}
                className="px-2.5 py-1 text-[9.5px] uppercase tracking-wider font-extrabold text-gray-600 hover:text-gray-900 border border-gray-200 bg-white rounded-md cursor-pointer transition-colors shadow-sm"
              >
                Bullet list
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("<br />")}
                className="px-2.5 py-1 text-[9.5px] uppercase tracking-wider font-extrabold text-gray-600 hover:text-gray-900 border border-gray-200 bg-white rounded-md cursor-pointer transition-colors shadow-sm"
              >
                line Break
              </button>
            </div>

            <textarea
              required
              ref={contentRef}
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start drafting dental, implant, or orthodontic medical advice here..."
              className="w-full px-4 py-3 border-x border-b border-gray-150 rounded-b-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium leading-relaxed font-mono"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3.5">
            <button
              type="button"
              onClick={() => setComposerOpen(false)}
              className="px-5 py-3 rounded-xl border border-gray-150 hover:bg-gray-50 text-gray-500 font-sans text-[10.5px] uppercase tracking-widest font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading || uploadProgress !== null}
              className="bg-[#3eb489] hover:bg-[#20946b] text-white px-6 py-3 rounded-xl font-sans text-[10.5px] uppercase tracking-widest font-bold shadow-md shadow-primary-mint/15 transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitLoading ? "Publishing article..." : editingArticle ? "Save Amendments" : "Publish Article"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
