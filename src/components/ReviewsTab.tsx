import React, { useState } from "react";
import { Review } from "../types";
import { Star, MessageSquare, ShieldCheck, EyeOff, Eye, Send, X, ShieldAlert, Reply } from "lucide-react";
import { motion } from "motion/react";

interface ReviewsTabProps {
  reviews: Review[];
  onUpdateReview: (review: Review) => void;
}

export default function ReviewsTab({ reviews, onUpdateReview }: ReviewsTabProps) {
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleToggleStatus = (review: Review) => {
    const updated: Review = {
      ...review,
      status: review.status === "Published" ? "Hidden" : "Published"
    };
    onUpdateReview(updated);
  };

  const handleOpenReply = (review: Review) => {
    setReplyingReviewId(review.id);
    setReplyText(review.reply || "");
  };

  const handleReplySubmit = (e: React.FormEvent, review: Review) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const updated: Review = {
      ...review,
      reply: replyText.trim(),
      replyDate: new Date().toISOString().split("T")[0]
    };

    onUpdateReview(updated);
    setReplyingReviewId(null);
    setReplyText("");
  };

  return (
    <div className="space-y-6" id="reviews-tab-container">
      {/* Tab Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE8E4] shadow-[0_4px_20px_rgb(0,0,0,0.01)]">
        <h2 className="font-display text-lg font-normal text-[#1A1A1A] tracking-wide">Customer Journals & Reviews</h2>
        <p className="text-stone-400 text-xs mt-0.5">Audit verified client feedback and compose official concierge responses.</p>
      </div>

      {/* Reviews List */}
      <div className="space-y-6" id="reviews-list-container">
        {reviews.map((review) => {
          const isHidden = review.status === "Hidden";

          return (
            <motion.div
              layout
              key={review.id}
              className={`bg-white rounded-2xl border border-[#EAE8E4] p-5 md:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.01)] transition-all ${
                isHidden ? "bg-stone-50/50" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#EAE8E4]/60 pb-4 mb-4">
                {/* Profile and Stars Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF9F6] border border-[#EAE8E4] flex items-center justify-center text-[#C5A880] font-semibold text-xs">
                    {review.clientName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-800">{review.clientName}</span>
                      <span className="text-[10px] text-stone-400 font-mono">Verified Client</span>
                    </div>
                    {/* Stars */}
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < review.rating 
                              ? "text-amber-400 fill-current" 
                              : "text-stone-200"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Service Tag & Date info */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider bg-stone-100 px-2.5 py-1 rounded-lg">
                    {review.serviceName}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">{review.date}</span>

                  <div className="flex items-center gap-2">
                    {/* Toggle publish button */}
                    <button
                      onClick={() => handleToggleStatus(review)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        review.status === "Published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100"
                      }`}
                      id={`toggle-review-status-${review.id}`}
                    >
                      {review.status === "Published" ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <div className="space-y-4">
                <p className="text-stone-600 text-xs leading-relaxed italic">
                  "{review.comment}"
                </p>

                {/* Sub-reply widget if exists */}
                {review.reply && replyingReviewId !== review.id && (
                  <div className="bg-[#FAF9F6] border-l-2 border-[#C5A880] p-4 rounded-r-xl rounded-bl-xl space-y-1.5 mt-4 ml-2">
                    <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono">
                      <span className="font-semibold text-stone-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                        Official Concierge Reply
                      </span>
                      <span>{review.replyDate}</span>
                    </div>
                    <p className="text-stone-600 text-xs leading-relaxed">
                      {review.reply}
                    </p>
                    <div className="pt-2 text-right">
                      <button
                        onClick={() => handleOpenReply(review)}
                        className="text-[10px] font-bold text-stone-400 hover:text-[#C5A880] uppercase tracking-wider transition-colors"
                        id={`edit-reply-${review.id}`}
                      >
                        Modify Response
                      </button>
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                {replyingReviewId === review.id ? (
                  <form 
                    onSubmit={(e) => handleReplySubmit(e, review)} 
                    className="bg-[#FAF9F6] p-4 rounded-xl border border-[#EAE8E4] space-y-3 mt-4"
                    id={`reply-form-${review.id}`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Reply className="w-3.5 h-3.5 text-[#C5A880]" />
                        Crafting Concierge Response
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setReplyingReviewId(null)}
                        className="text-stone-400 hover:text-stone-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      required
                      rows={3}
                      placeholder="Thank the guest warmly and confirm their wellness goals are our utmost priority..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 bg-white border border-[#EAE8E4] rounded-xl text-xs focus:outline-none focus:border-[#C5A880] resize-none text-stone-700"
                      id={`reply-textarea-${review.id}`}
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyingReviewId(null)}
                        className="px-3.5 py-1.5 border border-[#EAE8E4] rounded-xl text-[10px] font-bold text-stone-500 hover:bg-white uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3 text-amber-200" />
                        <span>Send Response</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  !review.reply && (
                    <div className="pt-2 text-right">
                      <button
                        onClick={() => handleOpenReply(review)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A880] hover:text-[#b59870] transition-colors bg-stone-50 hover:bg-[#FAF9F6] border border-[#EAE8E4]/60 px-3 py-1.5 rounded-xl"
                        id={`open-reply-button-${review.id}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Respond to Guest</span>
                      </button>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
