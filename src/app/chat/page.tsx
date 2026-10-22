"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  User,
  Sliders,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

const PERSONAS = [
  {
    id: "vedic",
    name: "Acharya Dev",
    title: "Vedic Jyotish Rishi",
    specialty: "Kundli, Dasha & Planetary Transits",
    avatar: "🕉️",
    badge: "Vedic",
  },
  {
    id: "tarot",
    name: "Lady Tara",
    title: "Mystic Tarot Empress",
    specialty: "Love, Karmic Cards & Intuition",
    avatar: "🔮",
    badge: "Tarot",
  },
  {
    id: "numerology",
    name: "Ravi Shastri",
    title: "Vedic Numerologist",
    specialty: "Name Correction, Numbers & Destiny",
    avatar: "🔢",
    badge: "Numerology",
  },
];

const SUGGESTED_PROMPTS = [
  {
    icon: "🪐",
    title: "Career & Promotions 2026",
    prompt: "Analyze my career prospects for 2026 based on Saturn and Jupiter transits.",
  },
  {
    icon: "✨",
    title: "Love & Marriage Timeline",
    prompt: "What does my 7th house indicate regarding marriage timing and partner compatibility?",
  },
  {
    icon: "📜",
    title: "Rahu Mahadasha Remedies",
    prompt: "What are the most powerful Vedic remedies for Rahu Mahadasha and mental peace?",
  },
  {
    icon: "💎",
    title: "Lucky Gemstone Guidance",
    prompt: "Which gemstone is auspicious for financial prosperity and health according to my birth chart?",
  },
];

export default function AstroTalkChatPage() {
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "session-1",
      title: "2026 Saturn Transit & Career",
      date: "Today",
      messages: [],
    },
    {
      id: "session-2",
      title: "Kundli Matching & Gun Milan",
      date: "Yesterday",
      messages: [],
    },
    {
      id: "session-3",
      title: "Rahu Mahadasha Remedies",
      date: "3 days ago",
      messages: [],
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState("session-1");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `### 🙏 Pranaam! Welcome to AstroTalk AI
I am **${selectedPersona.name}**, your personal ${selectedPersona.title}. Powered by the **Zaby Agentic OS Vedic Engine**.

Ask me anything about:
- 📜 **Janam Kundli & Birth Chart Analysis**
- 🪐 **Planetary Transits (Shani, Guru, Rahu/Ketu)**
- 💖 **Love, Marriage & Kundli Matching**
- 💼 **Career, Business & Financial Timing**
- 🕉️ **Vedic Mantras, Gemstones & Remedies**

*How can the cosmos guide you today?*`,
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isStreaming) return;

    setInputMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const assistantPlaceholderId = `assistant-${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantPlaceholderId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          persona: selectedPersona.id,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive astrological guidance");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const rawText = decoder.decode(value, { stream: true });
          const lines = rawText.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr === "[DONE]") {
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                const delta = parsed.data?.delta || parsed.data?.content || parsed.data?.text || "";
                accumulatedContent += delta;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantPlaceholderId
                      ? { ...msg, content: accumulatedContent, isStreaming: true }
                      : msg
                  )
                );
              } catch {
                // non-JSON or chunk
              }
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantPlaceholderId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantPlaceholderId
            ? {
                ...msg,
                content: `⚠️ *The cosmic link encountered an interruption: ${err?.message || "Please try again"}*. Reconnecting to Vedic stream...`,
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: "New Consultation",
      date: "Just now",
      messages: [],
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: `### 🙏 Pranaam!
I am **${selectedPersona.name}**. What astrological guidance or Kundli query do you have on your mind?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen w-full bg-[#0c0c0e] text-neutral-200 overflow-hidden font-sans">
      {/* LEFT SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-72 sm:w-80" : "w-0"
        } transition-all duration-300 flex-shrink-0 bg-[#121216] border-r border-neutral-800/80 flex flex-col z-40 relative`}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full p-3 justify-between">
            {/* Top: Logo & New Chat */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 pt-1">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-neutral-100 group-hover:text-white transition-colors">
                      Astrotalk <span className="text-neutral-400 text-xs font-normal">AI</span>
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition"
                  title="Close Sidebar"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* New Consultation Button */}
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-neutral-200 hover:bg-white text-neutral-900 font-medium text-xs transition active:scale-[0.99]"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5" />
                  New Consultation
                </span>
                <span className="text-[10px] bg-neutral-900/10 text-neutral-700 px-1.5 py-0.5 rounded font-mono">Free</span>
              </button>

              {/* Astrologer Persona Selector */}
              <div className="pt-2">
                <label className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 px-2 block mb-1">
                  Astrologer
                </label>
                <div className="space-y-1">
                  {PERSONAS.map((p) => {
                    const isSelected = selectedPersona.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPersona(p)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg transition flex items-center justify-between ${
                          isSelected
                            ? "bg-neutral-800 border border-neutral-700 text-white"
                            : "hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{p.avatar}</span>
                          <div>
                            <p className="text-xs font-medium leading-none">{p.name}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{p.specialty}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat History List */}
              <div className="pt-2">
                <label className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 px-2 block mb-1">
                  Recent Consultations
                </label>
                <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                  {sessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSessionId(s.id)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition text-left truncate ${
                        activeSessionId === s.id
                          ? "bg-neutral-800 text-neutral-100 border border-neutral-700/80"
                          : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                      <span className="truncate flex-1 text-[11px]">{s.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: User Quota & Zaby Agent Status */}
            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                    Zaby Agentic OS
                  </span>
                  <span className="text-[9px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 font-mono px-1.5 py-0.2 rounded">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Vedic Jyotish Agent • Runtime Token Secured
                </p>
              </div>

              <div className="flex items-center justify-between px-2 pt-0.5 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center justify-center font-medium text-[9px]">
                    U
                  </div>
                  <span className="text-neutral-300 text-[11px]">Dhileep</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium">Standard</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col h-full relative bg-[#0e0e11]">
        {/* Top Header Bar */}
        <header className="h-14 px-4 sm:px-6 border-b border-neutral-800/80 bg-[#121216]/90 backdrop-blur-sm flex items-center justify-between z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition"
                title="Open Sidebar"
              >
                <Sliders className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm">
                {selectedPersona.avatar}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-semibold text-neutral-100">{selectedPersona.name}</h2>
                  <span className="text-[9px] text-neutral-400 bg-neutral-800 border border-neutral-700 px-1 py-0.2 rounded">
                    {selectedPersona.badge}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400">{selectedPersona.specialty}</p>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-neutral-200 px-2.5 py-1 rounded-md hover:bg-neutral-800 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>

            <button
              onClick={clearMessages}
              className="text-xs text-neutral-400 hover:text-neutral-200 p-1.5 rounded-md hover:bg-neutral-800 transition"
              title="Clear Current Chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* MESSAGES FEED */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 space-y-5">
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex-shrink-0 flex items-center justify-center text-xs">
                      {selectedPersona.avatar}
                    </div>
                  )}

                  <div
                    className={`relative max-w-[85%] sm:max-w-[75%] rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-neutral-800 border border-neutral-700/80 text-neutral-100 rounded-tr-none"
                        : "bg-[#141418] border border-neutral-800 text-neutral-200 rounded-tl-none"
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between mb-1 gap-4">
                      <span
                        className={`text-[10px] font-semibold ${
                          isUser ? "text-neutral-300" : "text-neutral-400"
                        }`}
                      >
                        {isUser ? "You" : selectedPersona.name}
                      </span>
                      <span suppressHydrationWarning className="text-[10px] text-neutral-400">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Message Body (Markdown rendered) */}
                    <div className="prose prose-invert prose-xs sm:prose-sm max-w-none space-y-2 whitespace-pre-line text-neutral-200 font-normal">
                      {msg.content}
                      {msg.isStreaming && (
                        <span className="inline-block w-1.5 h-3.5 ml-1 bg-neutral-400 animate-pulse"></span>
                      )}
                    </div>

                    {/* Assistant Message Actions */}
                    {!isUser && !msg.isStreaming && msg.content && (
                      <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-neutral-800 text-neutral-400">
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="hover:text-neutral-200 transition flex items-center gap-1 text-[10px]"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex-shrink-0 flex items-center justify-center text-xs text-neutral-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* BOTTOM INPUT CONTAINER */}
        <div className="p-3 sm:p-4 bg-[#0e0e11] border-t border-neutral-800/60 flex-shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            {/* Topic Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[10px] text-neutral-400 scrollbar-none">
              <span className="text-neutral-400 font-medium pl-0.5 flex items-center gap-1">
                Topics:
              </span>
              {[
                "Kundli Analysis",
                "Career 2026",
                "Marriage Yoga",
                "Shani Sade Sati",
                "Gemstone Remedy",
                "Daily Horoscope",
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleSendMessage(`Tell me about my ${topic} and planetary guidance.`)}
                  className="whitespace-nowrap px-2 py-0.5 rounded-md bg-[#141418] hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition"
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Textarea Input Container */}
            <div className="relative flex items-end bg-[#141418] border border-neutral-800 focus-within:border-neutral-600 rounded-xl p-1.5 transition">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${selectedPersona.name} about your Kundli, Dasha or horoscope...`}
                rows={1}
                className="flex-1 bg-transparent text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 px-2.5 py-1.5 outline-none resize-none max-h-40 min-h-[36px] leading-relaxed"
                disabled={isStreaming}
              />

              <div className="flex items-center gap-1 pb-0.5 pr-0.5">
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isStreaming}
                  className={`p-2 rounded-lg transition flex items-center justify-center ${
                    inputMessage.trim() && !isStreaming
                      ? "bg-neutral-200 text-neutral-900 hover:bg-white cursor-pointer"
                      : "bg-neutral-800/50 text-neutral-600 cursor-not-allowed"
                  }`}
                  title="Send message"
                >
                  {isStreaming ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-400" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Footer Notice */}
            <p className="text-[10px] text-center text-neutral-400">
              Astrotalk AI provides Vedic guidance based on planetary ephemeris.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}