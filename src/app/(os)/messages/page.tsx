// src/app/(os)/inbox/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Search,
  MoreVertical,
  Paperclip,
  Check,
  CheckCheck,
  Clock,
} from "lucide-react";
import {
  mockConversations,
  type Conversation,
  type Message,
  type MessageStatus,
} from "@/lib/mock-data/inbox";
import { Avatar } from "@/components/shell/Avatar";
import { useCreatorsStore } from "@/lib/store/creatorsStore";
import { useToast } from "@/components/ui/toast";

// --- Status Icon Component ---
function MessageStatusIcon({
  status,
  isMe,
}: {
  status: MessageStatus;
  isMe: boolean;
}) {
  const sentColor = isMe ? "text-im-violet" : "text-im-muted";
  const sendingColor = isMe ? "text-im-violet/50" : "text-im-muted/50";

  if (status === "sending")
    return <Clock className={`size-3 ${sendingColor}`} />;
  if (status === "sent") return <Check className={`size-3 ${sentColor}`} />;
  if (status === "delivered")
    return <CheckCheck className={`size-3 ${sentColor}`} />;
  if (status === "read") return <CheckCheck className="size-3 text-im-pink" />;
  return null;
}

export default function MessagesPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const allCreators = useCreatorsStore((state) => state.creators);

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  // Helper to dynamically fetch participant info from creators store or fallback
  const getParticipant = (conv: Conversation) => {
    const creator = allCreators.find((c) => c.id === conv.participantId);
    if (creator) {
      return {
        name: creator.name,
        initials: creator.avatarInitials,
        avatarUrl: creator.avatarUrl,
      };
    }
    // Fallback for brands/agencies not in the creators store
    return {
      name: conv.participantName || "Unknown",
      initials: conv.participantInitials || "UN",
      avatarUrl: conv.participantAvatarUrl,
    };
  };

  const filteredConversations = conversations.filter((c) => {
    const participant = getParticipant(c);
    return (
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId) return;

    const tempId = `m${Date.now()}`;
    const newMsg: Message = {
      id: tempId,
      senderId: "me",
      text: newMessage.trim(),
      timestamp: "Just now",
      status: "sending",
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessage: newMsg.text,
            lastMessageTime: "Just now",
          };
        }
        return c;
      }),
    );

    setNewMessage("");

    // Simulate network delivery after 800ms
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === tempId ? { ...m, status: "delivered" } : m,
              ),
            };
          }
          return c;
        }),
      );
    }, 800);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
  };

  return (
    <div className="h-[calc(100dvh-140px)] flex overflow-hidden rounded-3xl im-card">
      {/* Left Pane: Conversation List */}
      <div
        className={`w-full md:w-96 flex flex-col border-r border-black/6 bg-white ${
          activeConvId ? "hidden md:flex" : "flex"
        }`}
      >
        {/* List Header */}
        <div className="p-4 border-b border-black/6">
          <h2 className="text-[18px] font-semibold text-im-ink mb-3">
            Messages
          </h2>
          <label className="flex items-center gap-2 rounded-xl bg-im-surface px-3 py-2">
            <Search className="size-4 text-im-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-im-muted/70"
            />
          </label>
        </div>

        {/* List Items */}
        <div className="flex-1 overflow-y-auto im-scroll">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-[13px] text-im-muted">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const participant = getParticipant(conv);

              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full text-left p-4 border-b border-black/4 transition-colors hover:bg-im-surface/50 ${
                    activeConvId === conv.id ? "bg-im-violet/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar
                        initials={participant.initials}
                        src={participant.avatarUrl}
                        className="size-10 text-xs"
                      />
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-im-pink text-[9px] font-bold text-white ring-2 ring-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[14px] font-semibold text-im-ink truncate">
                          {participant.name}
                        </p>
                        <span className="text-[11px] text-im-muted shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-im-violet font-medium mt-0.5">
                        {conv.campaignName}
                      </p>
                      <p
                        className={`text-[13px] mt-1 truncate ${
                          conv.unreadCount > 0
                            ? "font-medium text-im-ink"
                            : "text-im-muted"
                        }`}
                      >
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Conversation */}
      <div
        className={`flex-1 flex flex-col bg-[#f4f4f7] ${
          activeConvId ? "flex" : "hidden md:flex"
        }`}
      >
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/6 bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConvId(null)}
                  className="md:hidden grid size-9 place-items-center rounded-xl hover:bg-black/5"
                >
                  <ArrowLeft className="size-5 text-im-ink" />
                </button>
                <Avatar
                  initials={getParticipant(activeConversation).initials}
                  src={getParticipant(activeConversation).avatarUrl}
                  className="size-9 text-xs"
                />
                <div>
                  <p className="text-[14px] font-semibold text-im-ink">
                    {getParticipant(activeConversation).name}
                  </p>
                  <p className="text-[11px] text-im-muted">
                    {activeConversation.participantRole} ·{" "}
                    {activeConversation.campaignName}
                  </p>
                </div>
              </div>
              <button className="grid size-9 place-items-center rounded-xl hover:bg-black/5">
                <MoreVertical className="size-5 text-im-muted" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto im-scroll p-4 space-y-4">
              {activeConversation.messages.map((msg) => {
                const isMe = msg.senderId === "me";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 transition-colors ${
                        isMe
                          ? "bg-im-violet/10 text-im-ink rounded-br-md border border-im-violet/20"
                          : "bg-white text-im-ink rounded-bl-md shadow-sm"
                      }`}
                    >
                      <p className="text-[14px] leading-relaxed">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1.5 mt-1">
                        <p
                          className={`text-[10px] ${isMe ? "text-im-violet/70" : "text-im-muted"}`}
                        >
                          {msg.timestamp}
                        </p>
                        {isMe && (
                          <MessageStatusIcon status={msg.status} isMe={true} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-black/6 bg-white"
            >
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  className="grid size-10 shrink-0 place-items-center rounded-xl text-im-muted hover:bg-im-surface transition-colors"
                >
                  <Paperclip className="size-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full rounded-2xl border border-black/10 bg-im-surface px-4 py-3 pr-12 text-[14px] text-im-ink outline-none focus:ring-2 focus:ring-im-violet/20 placeholder:text-im-muted/70"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-im-violet text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="size-4 ml-0.5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="grid size-16 place-items-center rounded-2xl bg-im-surface mb-4">
              <Send className="size-7 text-im-muted" strokeWidth={1.5} />
            </div>
            <h3 className="text-[18px] font-semibold text-im-ink">
              Select a conversation
            </h3>
            <p className="text-[14px] text-im-muted mt-2 max-w-xs">
              Choose a message thread from the left to start collaborating with
              creators and brands.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
