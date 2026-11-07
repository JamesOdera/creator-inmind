// src/lib/mock-data/campaigns.ts

export type CampaignStatus = "Draft" | "Active" | "Paused" | "Completed";
export type CampaignDuration = "short" | "medium" | "long" | "ongoing";

export type Campaign = {
  id: string;
  name: string;
  brand: string;
  logoUrl: string;
  budget: number;
  currency: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  creatorsCount: number;
  deliverablesCount: number;
  description: string;
  // New fields from the multi-step wizard
  duration: CampaignDuration;
  keywords: string[];
  hashtags: string[];
  mentions: string[];
  allowNegotiation: boolean;
  noBudget: boolean;
  brandDescription: string;
  campaignGoals: string;
  requiresApproval: boolean;
};

export const mockCampaigns: Campaign[] = [
  {
    id: "cmp1",
    name: "Njeve Season Launch",
    brand: "Dairybest",
    logoUrl: "https://placehold.co/100x100/0066CC/FFFFFF?text=DB",
    budget: 450000,
    currency: "KES",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    creatorsCount: 4,
    deliverablesCount: 12,
    description:
      "Promoting the new Njeve tea line with authentic morning routine content.",
    duration: "medium",
    keywords: ["tea", "morning", "breakfast", "njeve"],
    hashtags: ["#NjeveSeason", "#Dairybest", "#MorningRitual"],
    mentions: ["@dairybest_ke"],
    allowNegotiation: true,
    noBudget: false,
    brandDescription:
      "Leading dairy products manufacturer in East Africa, known for quality and freshness.",
    campaignGoals:
      "Increase brand awareness and drive product trial among young professionals aged 22-35.",
    requiresApproval: true,
  },
  {
    id: "cmp2",
    name: "Morning Ritual",
    brand: "Java House",
    logoUrl: "https://placehold.co/100x100/8B4513/FFFFFF?text=JH",
    budget: 320000,
    currency: "KES",
    status: "Active",
    startDate: "2024-02-01",
    endDate: "2024-04-01",
    creatorsCount: 3,
    deliverablesCount: 9,
    description:
      "Highlighting the new CBD flat white and cozy workspace vibes.",
    duration: "medium",
    keywords: ["coffee", "workspace", "cbd", "flatwhite"],
    hashtags: ["#JavaHouse", "#MorningRitual", "#CoffeeLovers"],
    mentions: ["@javahouseafrica"],
    allowNegotiation: false,
    noBudget: false,
    brandDescription:
      "Africa's favorite coffee house, serving premium coffee and meals since 1999.",
    campaignGoals:
      "Drive foot traffic to CBD locations during morning hours and promote the new flat white.",
    requiresApproval: true,
  },
  {
    id: "cmp3",
    name: "Tech Startup Spotlight",
    brand: "Nailab",
    logoUrl: "https://placehold.co/100x100/FF6B35/FFFFFF?text=NL",
    budget: 150000,
    currency: "KES",
    status: "Draft",
    startDate: "2024-05-01",
    endDate: "2024-06-30",
    creatorsCount: 0,
    deliverablesCount: 0,
    description:
      "Showcasing emerging African tech startups and founder stories.",
    duration: "short",
    keywords: ["tech", "startup", "innovation", "founder"],
    hashtags: ["#Nailab", "#AfricanTech", "#StartupSpotlight"],
    mentions: ["@nailabkenya"],
    allowNegotiation: true,
    noBudget: false,
    brandDescription:
      "East Africa's premier tech innovation hub and startup accelerator.",
    campaignGoals:
      "Highlight 5 emerging startups and drive applications for the next accelerator cohort.",
    requiresApproval: false,
  },
  {
    id: "cmp4",
    name: "Summer Fitness Challenge",
    brand: "Nutrifit",
    logoUrl: "https://placehold.co/100x100/10B981/FFFFFF?text=NF",
    budget: 280000,
    currency: "KES",
    status: "Completed",
    startDate: "2023-11-01",
    endDate: "2023-12-31",
    creatorsCount: 5,
    deliverablesCount: 20,
    description: "30-day home workout challenge using Nutrifit equipment.",
    duration: "short",
    keywords: ["fitness", "workout", "homegym", "challenge"],
    hashtags: ["#NutrifitChallenge", "#30DayFitness", "#HomeWorkout"],
    mentions: ["@nutrifit_ke"],
    allowNegotiation: true,
    noBudget: false,
    brandDescription:
      "Premium home fitness equipment brand making wellness accessible to everyone.",
    campaignGoals:
      "Generate user-generated content of the 30-day challenge and increase Q4 equipment sales by 20%.",
    requiresApproval: true,
  },
  {
    id: "cmp5",
    name: "Afro-Modern Fashion Week",
    brand: "Lagos Style Hub",
    logoUrl: "https://placehold.co/100x100/EC4899/FFFFFF?text=LS",
    budget: 850000,
    currency: "NGN",
    status: "Paused",
    startDate: "2024-03-10",
    endDate: "2024-03-20",
    creatorsCount: 8,
    deliverablesCount: 24,
    description:
      "Coverage of the annual fashion week with top tier influencers.",
    duration: "short",
    keywords: ["fashion", "afrofashion", "lagos", "style"],
    hashtags: ["#LagosFashionWeek", "#AfroModern", "#StyleHub"],
    mentions: ["@lagosstylehub"],
    allowNegotiation: false,
    noBudget: false,
    brandDescription:
      "The ultimate destination for contemporary African fashion and lifestyle.",
    campaignGoals:
      "Provide real-time coverage of runway shows and backstage access to drive event ticket sales.",
    requiresApproval: true,
  },
  {
    id: "cmp6",
    name: "Blaze It Up",
    brand: "Safaricom",
    logoUrl: "https://placehold.co/100x100/10B981/FFFFFF?text=SC",
    budget: 1200000,
    currency: "KES",
    status: "Active",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    creatorsCount: 12,
    deliverablesCount: 36,
    description:
      "5G network expansion campaign showcasing speed and connectivity across Kenya.",
    duration: "long",
    keywords: ["5G", "internet", "speed", "connectivity"],
    hashtags: ["#Safaricom5G", "#BlazeItUp", "#Tusonge"],
    mentions: ["@safaricomplc"],
    allowNegotiation: false,
    noBudget: false,
    brandDescription:
      "Kenya's leading telecommunications provider, connecting millions daily.",
    campaignGoals:
      "Educate consumers on 5G benefits and drive 5G-enabled device upgrades.",
    requiresApproval: true,
  },
  {
    id: "cmp7",
    name: "Weekend Fresh",
    brand: "Naivas Supermarkets",
    logoUrl: "https://placehold.co/100x100/F59E0B/FFFFFF?text=NS",
    budget: 380000,
    currency: "KES",
    status: "Active",
    startDate: "2024-11-01",
    endDate: "2024-11-30",
    creatorsCount: 6,
    deliverablesCount: 18,
    description:
      "Fresh produce and weekend deals promotion with food influencers.",
    duration: "short",
    keywords: ["fresh", "groceries", "weekend", "deals"],
    hashtags: ["#NaivasFresh", "#WeekendDeals", "#ShopNaivas"],
    mentions: ["@naivas_supermarket"],
    allowNegotiation: true,
    noBudget: false,
    brandDescription:
      "Kenya's most loved retail chain, offering quality products at great prices.",
    campaignGoals:
      "Increase weekend footfall and promote the new organic produce section.",
    requiresApproval: false,
  },
  {
    id: "cmp8",
    name: "Back to School Tech",
    brand: "Safaricom",
    logoUrl: "https://placehold.co/100x100/10B981/FFFFFF?text=SC",
    budget: 850000,
    currency: "KES",
    status: "Active",
    startDate: "2024-12-01",
    endDate: "2025-01-15",
    creatorsCount: 8,
    deliverablesCount: 24,
    description:
      "Student laptop and data bundle promotion for the new school year.",
    duration: "medium",
    keywords: ["school", "laptop", "data", "student"],
    hashtags: ["#BackToSchool", "#SafaricomStudent", "#TechForLearning"],
    mentions: ["@safaricomplc"],
    allowNegotiation: true,
    noBudget: false,
    brandDescription:
      "Kenya's leading telecommunications provider, connecting millions daily.",
    campaignGoals:
      "Drive sales of student laptop bundles and associated monthly data plans.",
    requiresApproval: true,
  },
  {
    id: "cmp9",
    name: "Festive Fashion Haul",
    brand: "Zawadi Fashion",
    logoUrl: "https://placehold.co/100x100/8B5CF6/FFFFFF?text=ZF",
    budget: 300000,
    currency: "KES",
    status: "Draft",
    startDate: "2024-12-15",
    endDate: "2024-12-31",
    creatorsCount: 0,
    deliverablesCount: 0,
    description:
      "End of year fashion haul and gift guide with style influencers.",
    duration: "short",
    keywords: ["fashion", "haul", "festive", "gifts"],
    hashtags: ["#ZawadiFashion", "#FestiveHaul", "#StyleGoals"],
    mentions: ["@zawadifashion"],
    allowNegotiation: true,
    noBudget: false,
    brandDescription:
      "Contemporary African fashion brand blending traditional prints with modern silhouettes.",
    campaignGoals:
      "Position Zawadi as the top choice for festive season gifting and party wear.",
    requiresApproval: false,
  },
  {
    id: "cmp10",
    name: "Unlimited Data Push",
    brand: "Safaricom",
    logoUrl: "https://placehold.co/100x100/10B981/FFFFFF?text=SC",
    budget: 1200000,
    currency: "KES",
    status: "Completed",
    startDate: "2024-06-01",
    endDate: "2024-09-30",
    creatorsCount: 45,
    deliverablesCount: 135,
    description:
      "Massive campaign promoting unlimited data bundles for streamers and gamers.",
    duration: "long",
    keywords: ["unlimited", "data", "gaming", "streaming"],
    hashtags: ["#UnlimitedData", "#SafaricomGaming", "#StreamFree"],
    mentions: ["@safaricomplc"],
    allowNegotiation: false,
    noBudget: false,
    brandDescription:
      "Kenya's leading telecommunications provider, connecting millions daily.",
    campaignGoals:
      "Acquire 50,000 new unlimited data subscribers among the 18-30 demographic.",
    requiresApproval: true,
  },
  {
    id: "cmp11",
    name: "Fitness January Challenge",
    brand: "Adidas Kenya",
    logoUrl: "https://placehold.co/100x100/000000/FFFFFF?text=AD",
    budget: 500000,
    currency: "KES",
    status: "Completed",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    creatorsCount: 20,
    deliverablesCount: 60,
    description:
      "New year fitness resolution campaign with workout challenges.",
    duration: "short",
    keywords: ["fitness", "newyear", "resolution", "adidas"],
    hashtags: ["#ImpossibleIsNothing", "#JanuaryChallenge", "#AdidasKenya"],
    mentions: ["@adidaske"],
    allowNegotiation: false,
    noBudget: false,
    brandDescription:
      "Global sportswear giant empowering athletes of all levels.",
    campaignGoals:
      "Drive Q1 apparel sales and build community engagement around New Year fitness goals.",
    requiresApproval: true,
  },
  {
    id: "cmp12",
    name: "Street Food Diaries",
    brand: "KFC",
    logoUrl: "https://placehold.co/100x100/DC2626/FFFFFF?text=KF",
    budget: 400000,
    currency: "KES",
    status: "Active",
    startDate: "2024-11-15",
    endDate: "2024-12-20",
    creatorsCount: 15,
    deliverablesCount: 45,
    description:
      "Exploring Nairobi street food culture and KFC new menu items.",
    duration: "medium",
    keywords: ["streetfood", "kfc", "nairobi", "foodie"],
    hashtags: ["#FingerLickinGood", "#StreetFoodDiaries", "#KFCKenya"],
    mentions: ["@kfckenya"],
    allowNegotiation: true,
    noBudget: false,
    brandDescription:
      "The world's most popular chicken restaurant chain, bringing flavor to every bite.",
    campaignGoals:
      "Promote the new spicy chicken sandwich by contrasting it with local street food favorites.",
    requiresApproval: true,
  },
  {
    id: "cmp13",
    name: "Lagos Tech Week",
    brand: "Andela",
    logoUrl: "https://placehold.co/100x100/3B82F6/FFFFFF?text=AN",
    budget: 2500000,
    currency: "NGN",
    status: "Active",
    startDate: "2024-11-01",
    endDate: "2024-11-30",
    creatorsCount: 18,
    deliverablesCount: 54,
    description:
      "Developer conference coverage and tech talent acquisition campaign.",
    duration: "short",
    keywords: ["tech", "developer", "lagos", "andela"],
    hashtags: ["#LagosTechWeek", "#Andela", "#BuildTheFuture"],
    mentions: ["@andela"],
    allowNegotiation: false,
    noBudget: false,
    brandDescription:
      "Global network of elite software developers powering the world's top companies.",
    campaignGoals:
      "Attract 500+ qualified developer applications and maximize event attendance.",
    requiresApproval: true,
  },
  {
    id: "cmp14",
    name: "Cape Town Vibes",
    brand: "Tourism South Africa",
    logoUrl: "https://placehold.co/100x100/14B8A6/FFFFFF?text=TS",
    budget: 1800000,
    currency: "ZAR",
    status: "Draft",
    startDate: "2025-01-15",
    endDate: "2025-03-15",
    creatorsCount: 0,
    deliverablesCount: 0,
    description:
      "Tourism campaign showcasing Cape Town attractions and experiences.",
    duration: "medium",
    keywords: ["travel", "capetown", "tourism", "southafrica"],
    hashtags: ["#CapeTownVibes", "#VisitSA", "#MotherCity"],
    mentions: ["@southafrica"],
    allowNegotiation: true,
    noBudget: true,
    brandDescription:
      "Official tourism board promoting the beauty, culture, and adventure of South Africa.",
    campaignGoals:
      "Increase international and regional tourist bookings for the summer season.",
    requiresApproval: true,
  },
  {
    id: "cmp15",
    name: "Mobile Money Revolution",
    brand: "M-Pesa",
    logoUrl: "https://placehold.co/100x100/10B981/FFFFFF?text=MP",
    budget: 2000000,
    currency: "KES",
    status: "Paused",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    creatorsCount: 25,
    deliverablesCount: 75,
    description:
      "Showcasing M-Pesa new features and financial inclusion stories.",
    duration: "long",
    keywords: ["mpesa", "mobilemoney", "fintech", "inclusion"],
    hashtags: ["#Mpesa", "#FinancialInclusion", "#TumaNaMpesa"],
    mentions: ["@safaricomplc"],
    allowNegotiation: false,
    noBudget: false,
    brandDescription:
      "Africa's most successful mobile money service, transforming financial access.",
    campaignGoals:
      "Drive adoption of M-Pesa GlobalPay and new savings features among Gen Z.",
    requiresApproval: true,
  },
  {
    id: "cmp16",
    name: "Accra Food Festival",
    brand: "Ghana Tourism",
    logoUrl: "https://placehold.co/100x100/F59E0B/FFFFFF?text=GT",
    budget: 450000,
    currency: "GHS",
    status: "Completed",
    startDate: "2024-08-01",
    endDate: "2024-08-31",
    creatorsCount: 12,
    deliverablesCount: 36,
    description:
      "Annual food festival promotion featuring local cuisine and chefs.",
    duration: "short",
    keywords: ["food", "festival", "accra", "ghana"],
    hashtags: ["#AccraFoodFest", "#TasteOfGhana", "#FoodieHeaven"],
    mentions: ["@ghana_tourism"],
    allowNegotiation: true,
    noBudget: false,
    brandDescription:
      "Promoting Ghana as the premier culinary and cultural destination in West Africa.",
    campaignGoals:
      "Sell out festival tickets and boost hotel bookings in Accra during the event weekend.",
    requiresApproval: false,
  },
  {
    id: "cmp17",
    name: "Kampala Nightlife",
    brand: "Nile Breweries",
    logoUrl: "https://placehold.co/100x100/DC2626/FFFFFF?text=NB",
    budget: 320000000,
    currency: "UGX",
    status: "Active",
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    creatorsCount: 10,
    deliverablesCount: 30,
    description:
      "Entertainment and nightlife campaign targeting young professionals.",
    duration: "medium",
    keywords: ["nightlife", "kampala", "entertainment", "beer"],
    hashtags: ["#KampalaNights", "#NileSpecial", "#LiveItUp"],
    mentions: ["@nilebreweries"],
    allowNegotiation: true,
    noBudget: false,
    brandDescription:
      "Uganda's leading brewery, crafting premium beverages for over 60 years.",
    campaignGoals:
      "Increase brand visibility in top Kampala clubs and drive weekend sales volume.",
    requiresApproval: true,
  },
  {
    id: "cmp18",
    name: "Green Energy Future",
    brand: "Kenya Power",
    logoUrl: "https://placehold.co/100x100/84CC16/FFFFFF?text=KP",
    budget: 650000,
    currency: "KES",
    status: "Draft",
    startDate: "2025-02-01",
    endDate: "2025-04-30",
    creatorsCount: 0,
    deliverablesCount: 0,
    description:
      "Renewable energy awareness and solar panel adoption campaign.",
    duration: "long",
    keywords: ["solar", "greenenergy", "sustainability", "kenyapower"],
    hashtags: ["#GreenEnergy", "#SolarKenya", "#SustainableFuture"],
    mentions: ["@kenyapower_care"],
    allowNegotiation: true,
    noBudget: true,
    brandDescription:
      "National electricity utility company committed to reliable and sustainable power.",
    campaignGoals:
      "Educate households on solar benefits and drive inquiries for the subsidized solar program.",
    requiresApproval: true,
  },
];

export const statusConfig: Record<
  CampaignStatus,
  { label: string; cls: string }
> = {
  Draft: { label: "Draft", cls: "bg-im-surface text-im-muted" },
  Active: { label: "Active", cls: "bg-emerald-50 text-emerald-700" },
  Paused: { label: "Paused", cls: "bg-amber-50 text-amber-700" },
  Completed: { label: "Completed", cls: "bg-im-violet/10 text-im-violet" },
};

export const durationConfig: Record<
  CampaignDuration,
  { label: string; description: string }
> = {
  short: {
    label: "Short-term",
    description: "Up to 1.5 months.",
  },
  medium: {
    label: "Medium-term",
    description: "Up to 3 months.",
  },
  long: {
    label: "Long-term",
    description: "Up to 6 months.",
  },
  ongoing: {
    label: "Ongoing",
    description: "No end date specified.",
  },
};
