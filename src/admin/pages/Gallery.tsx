import React, { useState, useEffect, useRef } from "react";
import { getGallery, addGalleryItem, deleteGalleryItem } from "../../firebase/firestore";
import { uploadFile } from "../../firebase/storage";
import { GalleryItem } from "../../types";

interface GalleryProps {
  showToast: (message: string, type: "success" | "error") => void;
}

export default function Gallery({ showToast }: GalleryProps) {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await getGallery();
      setImages(data);
    } catch (err) {
      console.error("Error loading gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(0);
    showToast(`Uploading ${files.length} photo(s) into database...`, "success");

    let count = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Single file upload wrapper
        const imageUrl = await uploadFile(file, "gallery", (fileProgress) => {
          const overallProgress = ((count / files.length) * 100) + (fileProgress / files.length);
          setProgress(Math.round(overallProgress));
        });

        await addGalleryItem(imageUrl);
        count++;
      }

      showToast(`Successfully uploaded ${count} photo(s) to clinical gallery.`, "success");
      fetchImages();
    } catch (err) {
      showToast("An error occurred during file upload.", "error");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Verify: Remove selected photo from clinical files?")) {
      return;
    }

    try {
      await deleteGalleryItem(id);
      setImages(prev => prev.filter(img => img.id !== id));
      showToast("Photo deleted from clinical gallery.", "success");
    } catch (err) {
      showToast("Failed to delete photo.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-0.5 text-left">
          <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-widest">
            Gallery Portfolio
          </h3>
          <p className="font-sans text-[10px] text-gray-450 uppercase tracking-wider font-semibold">
            Upload clinic photos, results, or smile makeover transformations
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#3eb489] hover:bg-[#1fa171] text-white px-5 py-3 rounded-2xl font-sans text-[10.5px] uppercase tracking-widest font-bold shadow-md shadow-primary-mint/15 hover:shadow-primary-mint/30 hover:translate-y-[-1px] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="material-symbols-outlined text-[15px] font-bold">upload_file</span>
            <span>Upload Images</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {uploading && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3 font-sans">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-700 uppercase tracking-wider">Storage syncing operations...</span>
            <span className="font-bold text-primary-mint">{progress}% Completed</span>
          </div>
          <div className="w-full bg-gray-150 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-primary-mint h-full transition-all duration-300 shadow-[0_0_8px_rgba(62,180,137,0.5)]" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-50 flex flex-col items-center justify-center gap-2.5">
          <div className="w-8 h-8 border-3 border-primary-mint border-t-transparent rounded-full animate-spin" />
          <span className="font-sans text-xs text-gray-400 font-semibold">Loading media directories...</span>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center font-sans space-y-3">
          <span className="material-symbols-outlined text-4xl text-gray-300">collections</span>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Your clinical list is empty.</p>
          <p className="text-[10px] text-gray-400">Click the green button above to populate images.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {images.map((img) => (
            <div key={img.id} className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden aspect-square shadow-sm flex items-center justify-center">
              <img 
                src={img.url} 
                alt="Clinic Galleried Smile" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-md"
                  title="Remove asset"
                >
                  <span className="material-symbols-outlined text-md font-bold">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
