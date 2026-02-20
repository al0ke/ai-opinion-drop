"use client";

import { useState, useEffect } from "react";
import { Bot, Brain, MessageSquare, Send, Users, Sparkles, Zap, Heart, AlertTriangle, Trash2, Wifi, Star, Rocket, Crown, Gem, Smile, Wand2, GraduationCap, Lightbulb } from "lucide-react";
import { db, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, Timestamp } from "@/lib/firebase";

interface Opinion {
  id: string;
  name: string;
  partner: string;
  stance: "beneficial" | "detrimental" | "neutral";
  opinion: string;
  timestamp: Date;
}

// Animated Robot Component
function AnimatedRobot() {
  const [blink, setBlink] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div 
      className="relative cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/40 to-purple-500/40 rounded-3xl blur-xl transition-all duration-500 ${hover ? 'scale-110 opacity-100' : 'scale-100 opacity-60'}`} />
      
      {/* Robot container with float animation */}
      <div className={`relative w-32 h-32 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-3xl flex items-center justify-center border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 ${hover ? 'scale-110 shadow-[0_0_50px_rgba(6,182,212,0.6)]' : 'animate-bounce-slow'}`}>
        
        {/* Robot face */}
        <div className="relative">
          {/* Eyes container */}
          <div className="flex gap-3 mb-2">
            {/* Left eye */}
            <div className={`w-5 h-5 bg-cyan-400 rounded-full transition-all duration-100 ${blink ? 'scale-y-10' : ''} ${hover ? 'scale-125 bg-cyan-300' : ''}`}>
              <div className="w-2 h-2 bg-white rounded-full ml-1 mt-1" />
            </div>
            {/* Right eye */}
            <div className={`w-5 h-5 bg-cyan-400 rounded-full transition-all duration-100 ${blink ? 'scale-y-10' : ''} ${hover ? 'scale-125 bg-cyan-300' : ''}`}>
              <div className="w-2 h-2 bg-white rounded-full ml-1 mt-1" />
            </div>
          </div>
          
          {/* Mouth */}
          <div className={`w-8 h-3 bg-cyan-400/50 rounded-full mx-auto transition-all duration-300 ${hover ? 'w-10 h-4 bg-cyan-300 rounded-full' : ''}`} />
        </div>

        {/* Antenna */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="w-1 h-4 bg-cyan-400/50 mx-auto" />
          <div className={`w-3 h-3 bg-cyan-400 rounded-full animate-pulse ${hover ? 'bg-pink-400' : ''}`} />
        </div>
      </div>

      {/* Sparkles around robot */}
      <Sparkles className={`w-6 h-6 text-yellow-400 absolute -top-2 -right-2 transition-all duration-300 ${hover ? 'scale-150 rotate-12' : 'animate-pulse'}`} />
      <Star className={`w-4 h-4 text-purple-400 absolute -bottom-1 -left-2 transition-all duration-500 ${hover ? 'scale-150' : 'animate-spin-slow'}`} />
    </div>
  );
}

// Moving Stars Background Component
function MovingStars() {
  const [stars, setStars] = useState<{id: number; x: number; y: number; size: number; speed: number}[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      speed: 0.2 + Math.random() * 0.5
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStars(prev => prev.map(star => ({
        ...star,
        y: star.y - star.speed,
        ...(star.y < -10 ? { y: 110, x: Math.random() * 100 } : {})
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute transition-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
        >
          <Star className="w-full h-full text-yellow-400/30 animate-pulse" />
        </div>
      ))}
    </div>
  );
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
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time Firestore subscription
  useEffect(() => {
    const q = query(collection(db, "opinions"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const opinionsData: Opinion[] = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          partner: doc.data().partner,
          stance: doc.data().stance,
          opinion: doc.data().opinion,
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        setOpinions(opinionsData);
        setIsLoading(false);
        setIsConnected(true);
      },
      (error) => {
        console.error("Firestore error:", error);
        setIsConnected(false);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "opinions"), {
        name: formData.name,
        partner: formData.partner,
        stance: formData.stance,
        opinion: formData.opinion,
        timestamp: Timestamp.now()
      });

      setFormData({ name: "", partner: "", stance: "beneficial", opinion: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding opinion:", error);
      alert("Failed to submit. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "opinions", id));
    } catch (error) {
      console.error("Error deleting opinion:", error);
    }
  };

  const beneficialCount = opinions.filter(o => o.stance === "beneficial").length;
  const detrimentalCount = opinions.filter(o => o.stance === "detrimental").length;
  const neutralCount = opinions.filter(o => o.stance === "neutral").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-x-hidden">
        {/* Animated Background with Moving Stars */}
      <MovingStars />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-40 left-20 opacity-30">
          <Star className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="absolute top-60 right-32 opacity-30">
          <Star className="w-4 h-4 text-purple-400" />
        </div>
        <div className="absolute bottom-40 left-40 opacity-20">
          <Bot className="w-8 h-8 text-pink-400" />
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header - Elegant with glowing robot */}
        <header className="text-center mb-12">
          {/* Big animated robot mascot */}
          <AnimatedRobot />

          {/* Title with subtle animations */}
          <div className="inline-flex items-center gap-4 mb-4 flex-wrap justify-center">
            <Wand2 className="w-8 h-8 text-purple-400 hidden md:block" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI: Friend or Foe?
            </h1>
            <Lightbulb className="w-8 h-8 text-yellow-400 hidden md:block" />
          </div>

          {/* Animated subtitle */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <p className="text-lg text-cyan-200/80 max-w-2xl">
              EDUC-1300 Learning Frameworks Activity
            </p>
          </div>

          <p className="text-md text-purple-200/70 mb-4">
            Share Your Thoughts on Artificial Intelligence 🤖💭
          </p>
          
          {/* Live status hidden as requested */}
          {/* <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mt-2 ${isConnected ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            <Wifi className="w-4 h-4" />
            {isConnected ? '🔴 Live Sync Active' : '⚠️ Connection Issue'}
            {isConnected && <Rocket className="w-4 h-4 ml-1" />}
          </div> */}
        </header>

        {/* Activity Instructions - Elegant with glow hover effects */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/20 rounded-xl">
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-cyan-300">Step 1: Pick a Partner</h2>
              <Smile className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-slate-300">
              Find a classmate to discuss with. Teams of 2 work best for deep conversation! <span className="ml-2">👥</span>
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <MessageSquare className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-purple-300">Step 2: Discuss</h2>
              <Brain className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-slate-300">
              Talk about: <span className="text-white font-semibold">"Do you think AI is beneficial or detrimental to society?"</span>
              <span className="ml-2">💭</span>
            </p>
          </div>
        </div>

        {/* Stats Dashboard - Elegant with glow effects */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center hover:border-green-400/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300">
            <div className="inline-block p-2 bg-green-500/20 rounded-full mb-2">
              <Heart className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{isLoading ? '...' : beneficialCount}</div>
            <div className="text-xs text-green-300/70">Beneficial</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center hover:border-red-400/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300">
            <div className="inline-block p-2 bg-red-500/20 rounded-full mb-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">{isLoading ? '...' : detrimentalCount}</div>
            <div className="text-xs text-red-300/70">Detrimental</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-300">
            <div className="inline-block p-2 bg-yellow-500/20 rounded-full mb-2">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">{isLoading ? '...' : neutralCount}</div>
            <div className="text-xs text-yellow-300/70">Neutral/Mixed</div>
          </div>
        </div>

        {/* Submission Form - Elegant with glow effects */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 md:p-8 mb-8 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 justify-center">
            <div className="p-2 bg-cyan-500/20 rounded-xl">
              <Send className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Drop Your Opinion
            </span>
            <Sparkles className="w-6 h-6 text-yellow-400" />
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
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
                ✨ Opinion submitted! 
                <Sparkles className="w-4 h-4" />
              </p>
              <p className="text-green-300/70 text-sm mt-1">Live on all devices! 🚀</p>
            </div>
          )}
        </div>

        {/* Submitted Opinions - Live Feed - Elegant */}
        {opinions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-3 justify-center mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-xl">
                <MessageSquare className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Live Class Opinions
              </span>
              <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-400 text-lg">
                {opinions.length}
              </span>
              <Bot className="w-6 h-6 text-purple-400" />
            </h3>
            <div className="grid gap-4">
              {opinions.map((opinion, index) => (
                <div
                  key={opinion.id}
                  className={`bg-slate-900/50 backdrop-blur-sm border rounded-xl p-4 animate-in fade-in slide-in-from-top-2 hover:scale-[1.02] transition-transform ${
                    opinion.stance === "beneficial"
                      ? "border-green-500/30"
                      : opinion.stance === "detrimental"
                      ? "border-red-500/30"
                      : "border-yellow-500/30"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        opinion.stance === "beneficial" ? "bg-green-500/20" :
                        opinion.stance === "detrimental" ? "bg-red-500/20" : "bg-yellow-500/20"
                      }`}>
                        <span className="text-xs">{index + 1}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-white">{opinion.name}</span>
                        <span className="text-slate-400 text-sm"> + {opinion.partner}</span>
                      </div>
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
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors hover:scale-110"
                        title="Delete this opinion"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 pl-10">{opinion.opinion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer - Smaller Ali branding */}
        <footer className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl border border-cyan-500/20 mb-3">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Created by Ali
            </span>
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-xs">×</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-400 text-xs">×</span>
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
          
          <p className="text-slate-500 text-xs mb-2">
            EDUC-1300 Learning Frameworks
          </p>
          
          <div className="text-xs text-slate-600">
            <p>✨ Made with love for EDUC-1300 ✨</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
