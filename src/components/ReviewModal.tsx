import React, { useState, useEffect, useRef } from "react";
import { Star, X, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import gsap from "gsap";

export default function ReviewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSuccess(false);
      setRating(5);
      setAuthor("");
      setRole("");
      setQuote("");
    };
    window.addEventListener("open-review-modal", handleOpen);
    return () => window.removeEventListener("open-review-modal", handleOpen);
  }, []);

  // Soft GSAP entrance when isOpen changes to true
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
      );
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 });
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 15,
      duration: 0.25,
      onComplete: () => setIsOpen(false),
    });
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 1:
        return "Disappointing";
      case 2:
        return "Could be better";
      case 3:
        return "Pleasant treatment";
      case 4:
        return "Exceptional care";
      case 5:
        return "Aesthetic mastery!";
      default:
        return "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !quote.trim()) return;

    setIsSubmitting(true);

    // Simulated API submission with premium delay
    setTimeout(() => {
      const avatarBgs = [
        "bg-teal-700",
        "bg-emerald-800",
        "bg-amber-800",
        "bg-stone-800",
        "bg-blue-900",
        "bg-indigo-900",
        "bg-cyan-900",
        "bg-rose-950",
      ];
      const randomBg = avatarBgs[Math.floor(Math.random() * avatarBgs.length)];

      const newReview = {
        id: `custom-review-${Date.now()}`,
        quote: quote.trim(),
        author: author.trim(),
        role: role.trim() || "Verified Patient",
        avatarBg: randomBg,
      };

      // Persist in localStorage
      const existing = localStorage.getItem("bd_custom_reviews");
      const currentReviews = existing ? JSON.parse(existing) : [];
      localStorage.setItem(
        "bd_custom_reviews",
        JSON.stringify([newReview, ...currentReviews])
      );

      // Deselect loading states
      setIsSubmitting(false);
      setIsSuccess(true);

      // Trigger standard window sync event
      window.dispatchEvent(new CustomEvent("new-review-submitted"));

      // Trigger Confetti Storm Celebration
      const end = Date.now() + 1.5 * 1000;
      const colors = ["#3EB489", "#C9A84C", "#FFFFFF", "#E8FFEF"];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.75 },
          colors: colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.75 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99991] flex items-center justify-center p-4">
      {/* Dim overlay */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/55 backdrop-blur-md"
      />

      {/* Modal Content container */}
      <div
        ref={modalRef}
        className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.18)] border border-primary-mint/15 z-10 flex flex-col max-h-[92vh]"
      >
        {/* Header decoration band */}
        <div className="h-2 bg-gradient-to-r from-primary-mint via-gold to-primary-mint w-full" />

        {/* Modal Close control */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-surface-mint text-deep-green border border-primary-mint/10 hover:rotate-90 transition-all duration-300 hover:bg-primary-mint hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 md:p-10 overflow-y-auto">
          {!isSuccess ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="font-dm text-xs font-semibold text-primary-mint tracking-[0.15em] uppercase block">
                  CHRONICLE YOUR EXPERIENCE
                </span>
                <h3 className="font-cormorant text-3xl font-light text-charcoal">
                  Leave a Review
                </h3>
                <p className="font-sans text-xs text-sage max-w-sm mx-auto leading-relaxed">
                  Your feedback helps us continue our vision of painless, comprehensive dental treatments and elite oral wellness.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                {/* Star rating selector */}
                <div className="text-center space-y-2 pb-2 border-b border-primary-mint/5">
                  <span className="font-dm text-[10px] text-sage tracking-widest uppercase block">
                    Your Rating
                  </span>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none transition-transform duration-150 hover:scale-120 active:scale-90 p-1 cursor-pointer"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <Star
                          className={`w-8 h-8 transition-all ${
                            (hoverRating || rating) >= star
                              ? "fill-gold text-gold scale-105 filter drop-shadow-[0_2px_4px_rgba(201,168,76,0.2)]"
                              : "text-sage/35"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="font-dm text-xs text-primary-mint font-medium h-4 block animate-fade-in">
                    {getRatingLabel(hoverRating || rating)}
                  </span>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="font-dm text-[10px] text-sage tracking-wider uppercase block mb-1.5 font-semibold">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Cynthia Rogers"
                      className="w-full bg-surface-mint border border-primary-mint/15 rounded-xl px-4 py-2.5 font-sans text-sm text-charcoal focus:outline-none focus:border-primary-mint focus:ring-1 focus:ring-primary-mint transition-colors placeholder:text-sage/40"
                    />
                  </div>

                  <div>
                    <label className="font-dm text-[10px] text-sage tracking-wider uppercase block mb-1.5 font-semibold">
                      Designation / Role
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Local Business Owner, Patient"
                      className="w-full bg-surface-mint border border-primary-mint/15 rounded-xl px-4 py-2.5 font-sans text-sm text-charcoal focus:outline-none focus:border-primary-mint focus:ring-1 focus:ring-primary-mint transition-colors placeholder:text-sage/40"
                    />
                  </div>

                  <div>
                    <label className="font-dm text-[10px] text-sage tracking-wider uppercase block mb-1.5 font-semibold">
                      Your Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      placeholder="How has Dr. Gagandeep transformed your smile today? Experience details..."
                      className="w-full bg-surface-mint border border-primary-mint/15 rounded-xl px-4 py-2.5 font-sans text-sm text-charcoal focus:outline-none focus:border-primary-mint focus:ring-1 focus:ring-primary-mint transition-colors placeholder:text-sage/40 resize-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-mint hover:bg-deep-green text-white font-dm text-xs uppercase tracking-wider font-semibold py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed text-center cursor-pointer mt-2"
                >
                  {isSubmitting ? "Publishing Review..." : "Submit Review"}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6 space-y-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-cormorant text-3xl font-light text-charcoal">
                  Review Published!
                </h3>
                <p className="font-sans text-xs text-sage max-w-sm leading-relaxed">
                  Thank you so much, <span className="font-semibold text-deep-green">{author}</span>. Your rating of <span className="text-gold font-bold">{rating} ★</span> has been published dynamically to our patient records ledger.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="bg-primary-mint hover:bg-deep-green text-white px-8 py-2.5 rounded-full text-xs font-semibold tracking-wider font-dm uppercase transition-all duration-300 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
