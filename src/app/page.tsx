"use client";

import { useState, useEffect } from "react";
import { Bot, Brain, MessageSquare, Send, Users, Sparkles, Zap, Heart, AlertTriangle, Trash2 } from "lucide-react";

interface Opinion {
  id: string;
  name: string;
  partner: string;
  stance: "beneficial" | "detrimental" | "neutral";
  opinion: string;
  timestamp: Date;
}

export default function AIOpinionDrop() {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    partner: "",
    stance: "beneficial" as "beneficial" | "detrimental" | "neutral",
    opinion: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load opinions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ai-opinions");
    if (saved) {
      setOpinions(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever opinions change
  useEffect(() => {
    localStorage.setItem("ai-opinions", JSON.stringify(opinions));
  }, [opinions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newOpinion: Opinion = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date()
    };

    setOpinions([newOpinion, ...opinions]);
    setFormData({ name: "", partner: "", stance: "beneficial", opinion: "" });
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    setOpinions(opinions.filter(o => o.id !== id));
  };

  const beneficialCount = opinions.filter(o => o.stance === "beneficial").length;
  const detrimentalCount = opinions.filter(o => o.stance === "detrimental").length;
  const neutralCount = opinions.filter(o => o.stance === "neutral").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <Bot className="w-12 h-12 text-cyan-400 animate-bounce" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI: Friend or Foe?
            </h1>
            <Brain className="w-12 h-12 text-purple-400 animate-pulse" />
          </div>
          <p className="text-lg text-cyan-200/80 max-w-2xl mx-auto">
            EDUC-1300 Learning Frameworks Activity • Share Your Thoughts on Artificial Intelligence
          </p>
        </header>

        {/* Activity Instructions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-cyan-400" />
              <h2 className="text-xl font-bold text-cyan-300">Step 1: Pick a Partner</h2>
            </div>
            <p className="text-slate-300">
              Find a classmate to discuss with. Teams of 2 work best for deep conversation!
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-8 h-8 text-purple-400" />
              <h2 className="text-xl font-bold text-purple-300">Step 2: Discuss</h2>
            </div>
            <p className="text-slate-300">
              Talk about: <span className="text-white font-semibold">"Do you think AI is beneficial or detrimental to society?"</span>
            </p>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
            <Heart className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">{beneficialCount}</div>
            <div className="text-xs text-green-300/70">Beneficial</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-400">{detrimentalCount}</div>
            <div className="text-xs text-red-300/70">Detrimental</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">{neutralCount}</div>
            <div className="text-xs text-yellow-300/70">Neutral/Mixed</div>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Send className="w-6 h-6 text-cyan-400" />
            Drop Your Opinion
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  placeholder="Enter your name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">Partner&apos;s Name</label>
                <input
                  type="text"
                  required
                  value={formData.partner}
                  onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  placeholder="Who did you discuss with?"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Your Stance</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, stance: "beneficial" })}
                  className={`py-3 px-4 rounded-lg border transition-all ${
                    formData.stance === "beneficial"
                      ? "bg-green-500/20 border-green-400 text-green-400"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-green-400/50"
                  }`}
                >
                  <Heart className="w-5 h-5 mx-auto mb-1" />
                  Beneficial
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, stance: "detrimental" })}
                  className={`py-3 px-4 rounded-lg border transition-all ${
                    formData.stance === "detrimental"
                      ? "bg-red-500/20 border-red-400 text-red-400"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-red-400/50"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
                  Detrimental
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, stance: "neutral" })}
                  className={`py-3 px-4 rounded-lg border transition-all ${
                    formData.stance === "neutral"
                      ? "bg-yellow-500/20 border-yellow-400 text-yellow-400"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-yellow-400/50"
                  }`}
                >
                  <Zap className="w-5 h-5 mx-auto mb-1" />
                  Neutral
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Share Your Thoughts</label>
              <textarea
                required
                value={formData.opinion}
                onChange={(e) => setFormData({ ...formData, opinion: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all h-32 resize-none"
                placeholder="What did you and your partner discuss? Share your perspective on AI..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Opinion
                </>
              )}
            </button>
          </form>

          {showSuccess && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
              <p className="text-green-400 font-semibold">✨ Opinion submitted successfully!</p>
            </div>
          )}
        </div>

        {/* Submitted Opinions */}
        {opinions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              Class Opinions ({opinions.length})
            </h3>
            <div className="grid gap-4">
              {opinions.map((opinion) => (
                <div
                  key={opinion.id}
                  className={`bg-slate-900/50 backdrop-blur-sm border rounded-xl p-4 ${
                    opinion.stance === "beneficial"
                      ? "border-green-500/30"
                      : opinion.stance === "detrimental"
                      ? "border-red-500/30"
                      : "border-yellow-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-semibold text-white">{opinion.name}</span>
                      <span className="text-slate-400 text-sm"> + {opinion.partner}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          opinion.stance === "beneficial"
                            ? "bg-green-500/20 text-green-400"
                            : opinion.stance === "detrimental"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {opinion.stance.charAt(0).toUpperCase() + opinion.stance.slice(1)}
                      </span>
                      <button
                        onClick={() => handleDelete(opinion.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete this opinion"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300">{opinion.opinion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>Created by b0lt 🤖 for EDUC-1300</p>
          <p className="mt-1">Share this page with your classmates!</p>
        </footer>
      </div>
    </div>
  );
}
