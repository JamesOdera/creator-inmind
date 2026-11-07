// src/lib/mock-data/inbox.ts
export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
};

export type Conversation = {
  id: string;
  participantId: string; // Links to creator ID (e.g., 'c1', 'c2') or brand ID
  participantName?: string; // Fallback for brands/agencies
  participantInitials?: string; // Fallback
  participantAvatarUrl?: string; // Fallback
  participantRole: "Creator" | "Brand Manager" | "Agency";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  campaignName: string;
  messages: Message[];
};

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participantId: "c1", // Links to Amina Wanjiku in creators store
    participantRole: "Creator",
    lastMessage: "I can have the first draft of the Reel to you by Thursday!",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    campaignName: "Njeve Season Launch",
    messages: [
      {
        id: "m1",
        senderId: "me",
        text: "Hi Amina! Excited to work together on the Njeve campaign.",
        timestamp: "Yesterday, 2:00 PM",
        status: "read",
      },
      {
        id: "m2",
        senderId: "c1",
        text: "Hi! Me too. I have a few questions about the deliverables.",
        timestamp: "Yesterday, 4:15 PM",
        status: "read",
      },
      {
        id: "m3",
        senderId: "me",
        text: "Of course, fire away!",
        timestamp: "Yesterday, 4:20 PM",
        status: "read",
      },
      {
        id: "m4",
        senderId: "c1",
        text: "Do you need the product unboxing to be the first 3 seconds?",
        timestamp: "10:15 AM",
        status: "read",
      },
      {
        id: "m5",
        senderId: "c1",
        text: "I can have the first draft of the Reel to you by Thursday!",
        timestamp: "10:30 AM",
        status: "read",
      },
    ],
  },
  {
    id: "conv2",
    participantId: "c2", // Links to David Ochieng in creators store
    participantRole: "Creator",
    lastMessage: "The analytics from the last video are looking great.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    campaignName: "Tech Startup Spotlight",
    messages: [
      {
        id: "m1",
        senderId: "c2",
        text: "Hey, just wanted to share an update.",
        timestamp: "Yesterday, 9:00 AM",
        status: "read",
      },
      {
        id: "m2",
        senderId: "c2",
        text: "The analytics from the last video are looking great.",
        timestamp: "Yesterday, 9:05 AM",
        status: "read",
      },
    ],
  },
  {
    id: "conv3",
    participantId: "brand1", // Not in creators store, will use fallbacks
    participantName: "Sarah Jenkins",
    participantInitials: "SJ",
    participantAvatarUrl: "https://i.pravatar.cc/150?u=sarah",
    participantRole: "Brand Manager",
    lastMessage: "Approved the budget for the next quarter.",
    lastMessageTime: "Mon",
    unreadCount: 0,
    campaignName: "Summer Fitness Challenge",
    messages: [
      {
        id: "m1",
        senderId: "c3",
        text: "Hi team, quick update on the budget.",
        timestamp: "Mon, 11:00 AM",
        status: "read",
      },
      {
        id: "m2",
        senderId: "c3",
        text: "Approved the budget for the next quarter.",
        timestamp: "Mon, 11:05 AM",
        status: "read",
      },
    ],
  },
];
