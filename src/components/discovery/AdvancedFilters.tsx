// src/components/discovery/AdvancedFilters.tsx
"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AtSign,
  Check,
  ChevronDown,
  Hash,
  Info,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Platform } from "@/lib/mock-data/types";

/* -------------------------------------------------------------------------- */
/*  Field catalog — every filter from the Influencify reference                */
/* -------------------------------------------------------------------------- */

type Kind = "text" | "select" | "number" | "tags" | "boolean";
type Section = "demographics" | "performance" | "content" | "account";
type Opt = { value: string; label: string; group?: string };
type Ext = "niche" | "topics" | "lookalike1" | "lookalike2";
type Field = {
  label: string;
  kind: Kind;
  section: Section;
  hint?: string;
  key?: string; // text | select | tags | boolean
  min?: string; // number
  max?: string; // number
  unit?: string;
  placeholder?: string;
  options?: Opt[];
  suggestions?: string[];
  fixed?: boolean; // tags: only pick from suggestions
  ops?: Opt[]; // override default operators
  ext?: Ext; // state owned by the quick filter bar (see `shared` prop)
};

const SECTION_LABELS: Record<Section, string> = {
  demographics: "Demographics",
  performance: "Performance",
  content: "Content",
  account: "Account",
};

const o = (...v: string[]): Opt[] => v.map((x) => ({ value: x, label: x }));
const LANGS = [
  "English",
  "Swahili",
  "French",
  "Arabic",
  "Spanish",
  "Portuguese",
  "German",
  "Hindi",
  "Zulu",
  "Amharic",
  "Yoruba",
];
const MONTHS = o(
  "1 month",
  "2 months",
  "3 months",
  "4 months",
  "5 months",
  "6 months",
);

const FIELDS = {
  /* Demographics */
  influencerLocation: {
    label: "Influencer location",
    kind: "text",
    section: "demographics",
    key: "influencerLocation",
    placeholder: "Add city or country",
    hint: "Where the influencer is based.",
  },
  audienceLocation: {
    label: "Audience location",
    kind: "text",
    section: "demographics",
    key: "audienceLocation",
    placeholder: "Add city or country",
    hint: "Where the influencer's audience is located.",
  },
  influencerGender: {
    label: "Influencer gender",
    kind: "select",
    section: "demographics",
    key: "influencerGender",
    options: o("Male", "Female", "Male or Female", "Organization"),
    hint: "The influencer's gender.",
  },
  audienceGender: {
    label: "Audience gender",
    kind: "select",
    section: "demographics",
    key: "audienceGender",
    options: o("Male", "Female"),
    hint: "The gender of the influencer's audience.",
  },
  influencerLanguage: {
    label: "Influencer language",
    kind: "tags",
    section: "demographics",
    key: "influencerLanguage",
    suggestions: LANGS,
    placeholder: "Add language",
    hint: "Languages the influencer uses.",
  },
  audienceLanguage: {
    label: "Audience language",
    kind: "tags",
    section: "demographics",
    key: "audienceLanguage",
    suggestions: LANGS,
    placeholder: "Add language",
    hint: "Languages the audience speaks.",
  },
  influencerAge: {
    label: "Influencer age",
    kind: "number",
    section: "demographics",
    min: "minInfluencerAge",
    max: "maxInfluencerAge",
    hint: "The influencer's age range.",
  },
  audienceAge: {
    label: "Audience age",
    kind: "number",
    section: "demographics",
    min: "minAge",
    max: "maxAge",
    hint: "Age range of the audience (13 to 65+).",
  },
  audienceAgeShare: {
    label: "Audience age share",
    kind: "number",
    section: "demographics",
    min: "minAudienceAgeShare",
    unit: "%",
    ops: [{ value: "gt", label: "is more than" }],
    hint: "Minimum share of the audience that falls in the age range above.",
  },
  audienceType: {
    label: "Audience type",
    kind: "select",
    section: "demographics",
    key: "audienceType",
    options: [
      { value: "engaged", label: "Engaged" },
      { value: "followers", label: "Followers" },
    ],
    hint: "Apply audience filters to all followers, or only engaged followers.",
  },
  /* Performance */
  followers: {
    label: "Followers",
    kind: "number",
    section: "performance",
    min: "minFollowers",
    max: "maxFollowers",
    hint: "Minimum and maximum followers range.",
  },
  engagements: {
    label: "Engagements",
    kind: "number",
    section: "performance",
    min: "minEngagements",
    max: "maxEngagements",
    hint: "Range of total engagements.",
  },
  engagementRate: {
    label: "Engagement rate",
    kind: "number",
    section: "performance",
    min: "minEngagement",
    max: "maxEngagement",
    unit: "%",
    hint: "Minimum and maximum engagement rate.",
  },
  trending: {
    label: "Trending",
    kind: "select",
    section: "performance",
    key: "trending",
    options: MONTHS,
    hint: "Influencers with substantial growth in the past X months.",
  },
  reelsPlays: {
    label: "Reels plays",
    kind: "number",
    section: "performance",
    min: "minReelsPlays",
    max: "maxReelsPlays",
    hint: "Average plays on recent Reels.",
  },
  hiddenLikes: {
    label: "Hidden likes",
    kind: "number",
    section: "performance",
    min: "minHiddenLikes",
    max: "maxHiddenLikes",
    unit: "%",
    hint: "Share of posts that have hidden likes.",
  },
  views: {
    label: "Views",
    kind: "number",
    section: "performance",
    min: "minViews",
    max: "maxViews",
    hint: "Average number of views on recent posts.",
  },
  saves: {
    label: "Saves",
    kind: "number",
    section: "performance",
    min: "minSaves",
    max: "maxSaves",
    hint: "Average number of saves on recent posts.",
  },
  shares: {
    label: "Shares",
    kind: "number",
    section: "performance",
    min: "minShares",
    max: "maxShares",
    hint: "Average number of shares on recent posts.",
  },
  /* Content */
  niche: {
    label: "Niche",
    kind: "tags",
    section: "content",
    key: "niche",
    ext: "niche",
    placeholder: "Add a niche (1–2 words)",
    hint: "The influencer's main interest, in 1–2 words.",
    suggestions: [
      "Tech",
      "Fashion",
      "Beauty",
      "Fitness",
      "Food",
      "Travel",
      "Gaming",
      "Music",
      "Comedy",
      "Education",
    ],
    ops: [
      { value: "OR", label: "is any of" },
      { value: "AND", label: "is all of" },
      { value: "NOR", label: "is none of" },
    ],
  },
  topics: {
    label: "Topics",
    kind: "tags",
    section: "content",
    key: "topics",
    ext: "topics",
    placeholder: "Add a topic, e.g. birding",
    hint: "Hashtag topics the influencer posts about.",
  },
  lookalike1: {
    label: "Lookalike creator",
    kind: "text",
    section: "content",
    key: "lookalike1",
    ext: "lookalike1",
    placeholder: "Name or @handle",
    hint: "Find influencers similar to a specific creator.",
  },
  lookalike2: {
    label: "Lookalike content",
    kind: "text",
    section: "content",
    key: "lookalike2",
    ext: "lookalike2",
    placeholder: "Name or @handle",
    hint: "Find influencers with content similar to a specific creator.",
  },
  mentions: {
    label: "Mentions",
    kind: "tags",
    section: "content",
    key: "mentions",
    placeholder: "Name or @handle",
    hint: "Accounts the influencer mentions.",
  },
  influencerInterests: {
    label: "Influencer interests",
    kind: "tags",
    section: "content",
    key: "interests",
    placeholder: "Add interest",
    hint: "The influencer's interests.",
  },
  audienceInterests: {
    label: "Audience interests",
    kind: "tags",
    section: "content",
    key: "audienceInterests",
    placeholder: "Add interest",
    hint: "The audience's interests.",
  },
  keywords: {
    label: "Caption keyword",
    kind: "tags",
    section: "content",
    key: "keywords",
    placeholder: "Add keyword",
    hint: "Words they use in their posts. Tip: search in the influencer's language, like German for German influencers.",
  },
  partnerships: {
    label: "Partnerships",
    kind: "tags",
    section: "content",
    key: "partnerships",
    placeholder: "Add brand",
    hint: "Influencers sponsored by any brand, or by a specific brand.",
  },
  influencerBrands: {
    label: "Influencer brands",
    kind: "tags",
    section: "content",
    key: "brands",
    placeholder: "Add brand",
    hint: "The influencer's brand affinities.",
  },
  audienceBrands: {
    label: "Audience brands",
    kind: "tags",
    section: "content",
    key: "audienceBrands",
    placeholder: "Add brand",
    hint: "The audience's brand affinities.",
  },
  semantic: {
    label: "Semantic search",
    kind: "text",
    section: "content",
    key: "semantic",
    placeholder: "Describe the creator you're looking for",
    hint: "Describe the kind of creator in plain language.",
  },
  /* Account */
  lastPost: {
    label: "Last post",
    kind: "select",
    section: "account",
    key: "lastPost",
    options: o("1 month", "3 months", "6 months"),
    hint: "Influencers who were active within this period.",
  },
  accountType: {
    label: "Account type",
    kind: "tags",
    section: "account",
    key: "accountTypes",
    fixed: true,
    suggestions: ["Regular", "Business", "Creator", "UGC Creator"],
    placeholder: "Choose account types",
    hint: "Instagram account type.",
  },
  contacts: {
    label: "Contacts",
    kind: "tags",
    section: "account",
    key: "contacts",
    fixed: true,
    suggestions: ["Has email", "Has phone"],
    placeholder: "Choose contacts",
    hint: "Influencers with a public email or phone.",
  },
  verified: {
    label: "Only verified accounts",
    kind: "boolean",
    section: "account",
    key: "onlyVerified",
    hint: "Show verified accounts only.",
  },
  credible: {
    label: "Only credible accounts",
    kind: "boolean",
    section: "account",
    key: "onlyCredible",
    hint: "Show credible accounts only.",
  },
  excludePrivate: {
    label: "Exclude private accounts",
    kind: "boolean",
    section: "account",
    key: "excludePrivate",
    hint: "Hide private accounts.",
  },
  audience18Plus: {
    label: "Audience 18+ (70%+)",
    kind: "boolean",
    section: "account",
    key: "audience18Plus",
    hint: "At least 70% of the audience is 18 or older.",
  },
} satisfies Record<string, Field>;

type FieldKey = keyof typeof FIELDS;
const ALL_KEYS = Object.keys(FIELDS) as FieldKey[];
const fieldDef = (k: FieldKey) => FIELDS[k] as Field;
const FIELD_OPTIONS: Opt[] = ALL_KEYS.map((k) => ({
  value: k,
  label: FIELDS[k].label,
  group: SECTION_LABELS[FIELDS[k].section],
}));

const OPS: Record<Kind, Opt[]> = {
  text: [{ value: "contains", label: "contains" }],
  select: [{ value: "is", label: "is" }],
  tags: [{ value: "any", label: "is any of" }],
  boolean: [{ value: "is", label: "is" }],
  number: [
    { value: "between", label: "is between" },
    { value: "gt", label: "is more than" },
    { value: "lt", label: "is less than" },
  ],
};
const opsFor = (k: FieldKey): Opt[] => fieldDef(k).ops ?? OPS[fieldDef(k).kind];

/** State that the quick filter bar already owns — pass it so both stay in sync. */
export type SharedFilters = {
  nicheTerms: string[];
  setNicheTerms: (t: string[]) => void;
  nicheLogic: "AND" | "OR" | "NOR";
  setNicheLogic: (l: "AND" | "OR" | "NOR") => void;
  topics: string[];
  setTopics: (t: string[]) => void;
  lookalike1: string;
  setLookalike1: (v: string) => void;
  lookalike2: string;
  setLookalike2: (v: string) => void;
};

/* -------------------------------------------------------------------------- */
/*  Draft model (rules + one level of groups)                                  */
/* -------------------------------------------------------------------------- */

type Value = string | string[] | boolean | { min: string; max: string };
type RuleNode = {
  type: "rule";
  id: string;
  field: FieldKey;
  op: string;
  value: Value;
};
type GroupNode = { type: "group"; id: string; children: RuleNode[] };
type FilterNode = RuleNode | GroupNode;
type Patch = Partial<Pick<RuleNode, "field" | "op" | "value">>;

const uid = () => Math.random().toString(36).slice(2, 9);

function emptyValue(kind: Kind): Value {
  switch (kind) {
    case "number":
      return { min: "", max: "" };
    case "tags":
      return [];
    case "boolean":
      return true;
    default:
      return "";
  }
}

function makeRule(field: FieldKey, op?: string, value?: Value): RuleNode {
  return {
    type: "rule",
    id: uid(),
    field,
    op: op ?? opsFor(field)[0].value,
    value: value ?? emptyValue(fieldDef(field).kind),
  };
}

const flatten = (nodes: FilterNode[]): RuleNode[] =>
  nodes.flatMap((n) => (n.type === "rule" ? [n] : n.children));

/** Existing filters (+ bar state) -> editable rules. Only non-default values become rows. */
function filtersToNodes(f: any, shared?: SharedFilters): FilterNode[] {
  const out: FilterNode[] = [];
  for (const k of ALL_KEYS) {
    const def = fieldDef(k);

    if (def.ext && shared) {
      if (k === "niche" && shared.nicheTerms.length)
        out.push(makeRule(k, shared.nicheLogic, shared.nicheTerms));
      if (k === "topics" && shared.topics.length)
        out.push(makeRule(k, undefined, shared.topics));
      if (k === "lookalike1" && shared.lookalike1)
        out.push(makeRule(k, undefined, shared.lookalike1));
      if (k === "lookalike2" && shared.lookalike2)
        out.push(makeRule(k, undefined, shared.lookalike2));
      continue;
    }

    const sec = f?.[def.section] ?? {};
    if (def.kind === "number") {
      const min = sec[def.min!] ?? "";
      const max = (def.max && sec[def.max]) ?? "";
      if (min || max)
        out.push(
          makeRule(k, min && max ? "between" : min ? "gt" : "lt", {
            min: String(min),
            max: String(max),
          }),
        );
    } else if (def.kind === "tags") {
      const arr = sec[def.key!];
      if (Array.isArray(arr) && arr.length)
        out.push(makeRule(k, undefined, arr));
    } else if (def.kind === "boolean") {
      if (sec[def.key!]) out.push(makeRule(k, undefined, true));
    } else {
      const v = sec[def.key!];
      if (v && String(v).toLowerCase() !== "any")
        out.push(makeRule(k, undefined, v));
    }
  }
  return out;
}

/** Number of advanced filters currently applied (for badges). */
export const countAdvancedFilters = (f: any, shared?: SharedFilters) =>
  filtersToNodes(f, shared).length;

/** Rules -> existing FilterState shape (everything is AND, so groups flatten safely). */
function buildFilters(base: any, nodes: FilterNode[], shared?: SharedFilters) {
  const next = JSON.parse(JSON.stringify(base ?? {}));
  for (const k of ALL_KEYS) {
    const def = fieldDef(k);
    if (def.ext && shared) continue;
    const sec = (next[def.section] ??= {});
    if (def.kind === "number") {
      sec[def.min!] = "";
      if (def.max) sec[def.max] = "";
    } else if (def.kind === "tags") sec[def.key!] = [];
    else if (def.kind === "boolean") sec[def.key!] = false;
    else sec[def.key!] = def.kind === "select" ? "any" : "";
  }
  for (const r of flatten(nodes)) {
    const def = fieldDef(r.field);
    if (def.ext && shared) continue;
    const sec = next[def.section];
    if (def.kind === "number") {
      const v = r.value as { min: string; max: string };
      sec[def.min!] = r.op === "lt" ? "" : v.min;
      if (def.max) sec[def.max] = r.op === "gt" ? "" : v.max;
    } else if (def.kind === "tags") sec[def.key!] = r.value as string[];
    else if (def.kind === "boolean") sec[def.key!] = r.value === true;
    else
      sec[def.key!] =
        (r.value as string) || (def.kind === "select" ? "any" : "");
  }
  return next;
}

/** Push niche / topics / lookalikes back to the quick filter bar's state. */
function commitShared(nodes: FilterNode[], s?: SharedFilters) {
  if (!s) return;
  const by = new Map(flatten(nodes).map((r) => [r.field, r]));
  const niche = by.get("niche");
  s.setNicheTerms(niche ? (niche.value as string[]) : []);
  if (niche) s.setNicheLogic(niche.op as "AND" | "OR" | "NOR");
  s.setTopics((by.get("topics")?.value as string[]) ?? []);
  s.setLookalike1((by.get("lookalike1")?.value as string) ?? "");
  s.setLookalike2((by.get("lookalike2")?.value as string) ?? "");
}

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                 */
/* -------------------------------------------------------------------------- */

const control =
  "w-full rounded-lg border bg-white px-3 text-[13px] text-im-ink outline-none transition-[border-color,box-shadow]";
const idle = "border-black/10 hover:border-black/20";
const active = "border-im-violet ring-4 ring-im-violet/15";
const inputCls = `${control} h-10 ${idle} placeholder:text-im-muted/70 focus:border-im-violet focus:ring-4 focus:ring-im-violet/15`;

function usePopover() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const toggle = () => {
    if (!open && ref.current) {
      const t = ref.current.getBoundingClientRect();
      const b = ref.current
        .closest("[data-popover-boundary]")
        ?.getBoundingClientRect();
      const below = (b?.bottom ?? window.innerHeight) - t.bottom;
      const above = t.top - (b?.top ?? 0);
      setUp(below < 300 && above > below);
    }
    setOpen((v) => !v);
  };

  return { ref, open, setOpen, up, toggle };
}

const popup =
  "absolute left-0 z-50 rounded-xl border border-black/8 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150";

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid size-5 shrink-0 place-items-center rounded-md border transition-colors ${
        checked
          ? "border-im-violet bg-im-violet text-white"
          : "border-black/20 bg-white"
      }`}
    >
      {checked && <Check className="size-3.5" strokeWidth={3} />}
    </span>
  );
}

function Select({
  value,
  options,
  onChange,
  placeholder = "Select…",
  disabledValues = [],
  className = "",
}: {
  value: string;
  options: Opt[];
  onChange: (v: string) => void;
  placeholder?: string;
  disabledValues?: string[];
  className?: string;
}) {
  const { ref, open, setOpen, up, toggle } = usePopover();
  const current = options.find((x) => x.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${control} flex h-10 items-center justify-between gap-2 ${open ? active : idle}`}
      >
        <span className={`truncate ${current ? "" : "text-im-muted"}`}>
          {current?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-im-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          role="listbox"
          className={`${popup} ${up ? "bottom-full mb-2" : "top-full mt-2"} max-h-72 w-max min-w-full max-w-[320px] overflow-y-auto`}
        >
          {options.map((opt, i) => {
            const selected = opt.value === value;
            const disabled = disabledValues.includes(opt.value);
            const header = opt.group && opt.group !== options[i - 1]?.group;
            return (
              <Fragment key={opt.value}>
                {header && (
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold text-im-muted first:pt-1">
                    {opt.group}
                  </p>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={disabled}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-6 rounded-lg px-3 py-2 text-left text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent ${
                    selected
                      ? "bg-im-violet/10 font-medium text-im-violet"
                      : "text-im-ink hover:bg-im-surface"
                  }`}
                >
                  {opt.label}
                  {selected && <Check className="size-4" />}
                </button>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MultiSelect({
  value,
  onChange,
  suggestions = [],
  placeholder,
  fixed = false,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  fixed?: boolean;
}) {
  const { ref, open, up, toggle } = usePopover();
  const [draft, setDraft] = useState("");

  const options = useMemo(
    () => Array.from(new Set([...suggestions, ...value])),
    [suggestions, value],
  );
  const term = draft.trim();
  const shown = options.filter((x) =>
    x.toLowerCase().includes(term.toLowerCase()),
  );
  const canAdd =
    !fixed &&
    term &&
    !options.some((x) => x.toLowerCase() === term.toLowerCase());
  const showSearch = !fixed || options.length > 6;

  const toggleItem = (t: string) =>
    onChange(value.includes(t) ? value.filter((x) => x !== t) : [...value, t]);
  const addDraft = () => {
    if (!term || fixed) return;
    if (!value.some((x) => x.toLowerCase() === term.toLowerCase()))
      onChange([...value, term]);
    setDraft("");
  };

  return (
    <div ref={ref} className="relative">
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className={`${control} flex min-h-10 cursor-pointer items-center gap-2 py-1.5 ${open ? active : idle}`}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {value.length === 0 && (
            <span className="text-im-muted">{placeholder}</span>
          )}
          {value.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-md bg-im-surface px-2 py-0.5 text-[12px] font-medium text-im-ink"
            >
              {v}
              <button
                type="button"
                aria-label={`Remove ${v}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(v);
                }}
                className="text-im-muted transition-colors hover:text-im-ink"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown
          className={`size-4 shrink-0 text-im-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div
          className={`${popup} ${up ? "bottom-full mb-2" : "top-full mt-2"} w-full min-w-[240px]`}
        >
          {showSearch && (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDraft();
                }
              }}
              placeholder={fixed ? "Search…" : "Search or type to add…"}
              className="mb-1.5 h-9 w-full rounded-lg bg-im-surface px-3 text-[13px] outline-none placeholder:text-im-muted/70"
            />
          )}
          <div className="max-h-52 overflow-y-auto">
            {shown.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleItem(opt)}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-im-surface"
              >
                <Checkbox checked={value.includes(opt)} />
                <span
                  className={
                    value.includes(opt)
                      ? "font-medium text-im-violet"
                      : "text-im-ink"
                  }
                >
                  {opt}
                </span>
              </button>
            ))}
            {canAdd && (
              <button
                type="button"
                onClick={addDraft}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] text-im-violet transition-colors hover:bg-im-violet/10"
              >
                <Plus className="size-4" />
                Add “{term}”
              </button>
            )}
            {shown.length === 0 && !canAdd && (
              <p className="px-2.5 py-3 text-[12px] text-im-muted">
                {fixed
                  ? "No matches."
                  : "Type a term and press Enter to add it."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
  unit,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  unit?: string;
}) {
  return (
    <div className="relative min-w-0 flex-1">
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputCls} ${unit ? "pr-8" : ""}`}
      />
      {unit && (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[12px] text-im-muted">
          {unit}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Rule row                                                                   */
/* -------------------------------------------------------------------------- */

function ValueEditor({
  rule,
  onChange,
}: {
  rule: RuleNode;
  onChange: (v: Value) => void;
}) {
  const def = fieldDef(rule.field);

  switch (def.kind) {
    case "text":
      return (
        <input
          value={rule.value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={def.placeholder}
          className={inputCls}
        />
      );
    case "select":
      return (
        <Select
          value={rule.value as string}
          options={def.options!}
          onChange={onChange}
          placeholder="Choose…"
        />
      );
    case "boolean":
      return (
        <Select
          value={rule.value ? "yes" : "no"}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          onChange={(v) => onChange(v === "yes")}
        />
      );
    case "tags":
      return (
        <MultiSelect
          value={rule.value as string[]}
          onChange={onChange}
          suggestions={def.suggestions}
          placeholder={def.placeholder}
          fixed={def.fixed}
        />
      );
    case "number": {
      const v = rule.value as { min: string; max: string };
      const between = rule.op === "between";
      return (
        <div className="flex items-center gap-2">
          {rule.op !== "lt" && (
            <NumberInput
              value={v.min}
              onChange={(x) => onChange({ ...v, min: x })}
              placeholder={between ? "From" : "Minimum"}
              unit={def.unit}
            />
          )}
          {between && <span className="text-[12px] text-im-muted">and</span>}
          {rule.op !== "gt" && (
            <NumberInput
              value={v.max}
              onChange={(x) => onChange({ ...v, max: x })}
              placeholder={between ? "To" : "Maximum"}
              unit={def.unit}
            />
          )}
        </div>
      );
    }
  }
}

function ConnectorLabel({ label }: { label: "Where" | "And" }) {
  return label === "Where" ? (
    <span className="flex h-10 w-[72px] shrink-0 items-center text-[13px] text-im-muted">
      Where
    </span>
  ) : (
    <span
      title="All conditions must match"
      className="flex h-10 w-[72px] shrink-0 items-center rounded-lg border border-black/10 bg-white px-3 text-[13px] text-im-ink"
    >
      And
    </span>
  );
}

function RuleRow({
  rule,
  label,
  used,
  scrollOnMount,
  onPatch,
  onRemove,
}: {
  rule: RuleNode;
  label: "Where" | "And";
  used: Set<FieldKey>;
  scrollOnMount: boolean;
  onPatch: (patch: Patch) => void;
  onRemove: () => void;
}) {
  const def = fieldDef(rule.field);
  const rowRef = useRef<HTMLDivElement>(null);
  const disabledFields = [...used].filter((k) => k !== rule.field);

  useEffect(() => {
    if (scrollOnMount)
      rowRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
    >
      <div className="flex flex-wrap items-start gap-2">
        <ConnectorLabel label={label} />
        <Select
          className="w-full sm:w-56"
          value={rule.field}
          options={FIELD_OPTIONS}
          disabledValues={disabledFields}
          onChange={(f) => {
            const k = f as FieldKey;
            onPatch({
              field: k,
              op: opsFor(k)[0].value,
              value: emptyValue(fieldDef(k).kind),
            });
          }}
        />
        <Select
          className="w-full sm:w-36"
          value={rule.op}
          options={opsFor(rule.field)}
          onChange={(op) => onPatch({ op })}
        />
        <div className="w-full min-w-0 sm:min-w-[240px] sm:flex-1 sm:basis-0">
          <ValueEditor rule={rule} onChange={(value) => onPatch({ value })} />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove condition"
          className="grid size-10 shrink-0 place-items-center rounded-lg text-im-muted transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {def.hint && (
        <p className="ml-[80px] mt-1.5 text-[12px] leading-snug text-im-muted">
          {def.hint}
        </p>
      )}
    </motion.div>
  );
}

const addBtn =
  "inline-flex items-center gap-1.5 rounded-md py-1 text-[13px] font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-40";

/* -------------------------------------------------------------------------- */
/*  "All filters" browser — every filter visible at once                       */
/* -------------------------------------------------------------------------- */

function FilterBrowser({
  used,
  onToggle,
}: {
  used: Set<FieldKey>;
  onToggle: (k: FieldKey) => void;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-im-surface/40 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="size-4 text-im-violet" />
        <h4 className="text-[14px] font-semibold text-im-ink">All filters</h4>
        <span className="text-[12px] text-im-muted">
          Click a filter to add it. Selected filters are highlighted.
        </span>
      </div>
      <div className="space-y-4">
        {(Object.keys(SECTION_LABELS) as Section[]).map((sec) => (
          <div key={sec}>
            <p className="mb-2 text-[12px] font-semibold text-im-ink">
              {SECTION_LABELS[sec]}
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_KEYS.filter((k) => fieldDef(k).section === sec).map((k) => {
                const on = used.has(k);
                return (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={on}
                    title={fieldDef(k).hint}
                    onClick={() => onToggle(k)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                      on
                        ? "border-im-violet bg-im-violet/10 text-im-violet"
                        : "border-black/10 bg-white text-im-ink hover:border-im-violet/40 hover:text-im-violet"
                    }`}
                  >
                    {on ? (
                      <Check className="size-3" strokeWidth={3} />
                    ) : (
                      <Plus className="size-3" />
                    )}
                    {fieldDef(k).label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modal                                                                      */
/* -------------------------------------------------------------------------- */

export function AdvancedFiltersModal({
  isOpen,
  onClose,
  filters,
  setFilters,
  onApply,
  matchingCount,
  shared,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (f: any) => void;
  onApply: () => void;
  /** Optional: number of creators in the current results, shown in the badge. */
  matchingCount?: number;
  /** Niche / topics / lookalikes live in the quick filter bar — pass them to keep both in sync. */
  shared?: SharedFilters;
  /** Kept for backwards compatibility; "Reset" now clears the draft only. */
  onClearAll?: () => void;
}) {
  const [nodes, setNodes] = useState<FilterNode[]>([]);
  const [focusId, setFocusId] = useState<string | null>(null);

  // Load a fresh draft from the applied filters every time the modal opens.
  useEffect(() => {
    if (isOpen) {
      setNodes(filtersToNodes(filters, shared));
      setFocusId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const used = useMemo(
    () => new Set(flatten(nodes).map((r) => r.field)),
    [nodes],
  );
  const free = ALL_KEYS.filter((k) => !used.has(k));

  const addRule = (groupId?: string, field?: FieldKey) => {
    const f = field ?? free[0];
    if (!f || used.has(f)) return;
    const rule = makeRule(f);
    setFocusId(rule.id);
    setNodes((ns) =>
      groupId
        ? ns.map((n) =>
            n.type === "group" && n.id === groupId
              ? { ...n, children: [...n.children, rule] }
              : n,
          )
        : [...ns, rule],
    );
  };

  const addGroup = () => {
    if (!free[0]) return;
    const rule = makeRule(free[0]);
    setFocusId(rule.id);
    setNodes((ns) => [...ns, { type: "group", id: uid(), children: [rule] }]);
  };

  const patchRule = (id: string, patch: Patch) =>
    setNodes((ns) =>
      ns.map((n) =>
        n.type === "rule"
          ? n.id === id
            ? { ...n, ...patch }
            : n
          : {
              ...n,
              children: n.children.map((c) =>
                c.id === id ? { ...c, ...patch } : c,
              ),
            },
      ),
    );

  const removeRule = (id: string) =>
    setNodes((ns) =>
      ns.reduce<FilterNode[]>((acc, n) => {
        if (n.type === "rule") {
          if (n.id !== id) acc.push(n);
        } else {
          const children = n.children.filter((c) => c.id !== id);
          if (children.length) acc.push({ ...n, children });
        }
        return acc;
      }, []),
    );

  const removeGroup = (id: string) =>
    setNodes((ns) => ns.filter((n) => n.id !== id));

  const toggleField = (k: FieldKey) => {
    const existing = flatten(nodes).find((r) => r.field === k);
    if (existing) removeRule(existing.id);
    else addRule(undefined, k);
  };

  const apply = () => {
    setFilters(buildFilters(filters, nodes, shared));
    commitShared(nodes, shared);
    onApply();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Advanced filters"
              className="pointer-events-auto flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[90vh] sm:max-w-5xl sm:rounded-3xl"
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-black/6 px-6 py-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-[16px] font-semibold text-im-ink">
                    Advanced filters
                  </h2>
                  <span className="hidden text-[13px] text-im-muted sm:inline">
                    Combine conditions to narrow your results
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-lg text-im-muted transition-colors hover:bg-black/5 hover:text-im-ink"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Body */}
              <div
                data-popover-boundary
                className="im-scroll flex-1 overflow-y-auto px-6 py-6"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg bg-im-violet/10 text-im-violet">
                      <SlidersHorizontal className="size-4" />
                    </span>
                    <h3 className="text-[14px] font-semibold text-im-ink">
                      Creator filters
                    </h3>
                    <span
                      title="A creator must match every condition"
                      className="text-im-muted"
                    >
                      <Info className="size-3.5" />
                    </span>
                  </div>
                  {typeof matchingCount === "number" && (
                    <span className="rounded-full bg-im-surface px-3 py-1 text-[12px] font-medium text-im-muted">
                      {matchingCount} in current results
                    </span>
                  )}
                </div>

                {nodes.length === 0 ? (
                  <div className="flex flex-col items-center rounded-2xl border border-dashed border-black/15 px-6 py-8 text-center">
                    <p className="text-[14px] font-medium text-im-ink">
                      No conditions yet
                    </p>
                    <p className="mt-1 text-[13px] text-im-muted">
                      Add a condition, or pick any filter from the list below.
                    </p>
                    <button
                      type="button"
                      onClick={() => addRule()}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-im-ink px-3.5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <Plus className="size-4" />
                      Add condition
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {nodes.map((n, i) => {
                        const label = i === 0 ? "Where" : "And";
                        if (n.type === "rule") {
                          return (
                            <RuleRow
                              key={n.id}
                              rule={n}
                              label={label}
                              used={used}
                              scrollOnMount={focusId === n.id}
                              onPatch={(p) => patchRule(n.id, p)}
                              onRemove={() => removeRule(n.id)}
                            />
                          );
                        }
                        return (
                          <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.16 }}
                            className="flex flex-wrap items-start gap-2"
                          >
                            <ConnectorLabel label={label} />
                            <div className="min-w-0 flex-1 basis-[320px] rounded-xl border border-black/5 bg-im-surface/70 p-4">
                              <div className="mb-3 flex items-center justify-between">
                                <p className="text-[13px] text-im-ink">
                                  if all of the following are true
                                </p>
                                <button
                                  type="button"
                                  onClick={() => removeGroup(n.id)}
                                  aria-label="Remove group"
                                  className="grid size-8 place-items-center rounded-lg text-im-muted transition-colors hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                              <div className="space-y-4">
                                <AnimatePresence initial={false}>
                                  {n.children.map((c) => (
                                    <RuleRow
                                      key={c.id}
                                      rule={c}
                                      label="Where"
                                      used={used}
                                      scrollOnMount={focusId === c.id}
                                      onPatch={(p) => patchRule(c.id, p)}
                                      onRemove={() => removeRule(c.id)}
                                    />
                                  ))}
                                </AnimatePresence>
                              </div>
                              <button
                                type="button"
                                onClick={() => addRule(n.id)}
                                disabled={free.length === 0}
                                className={`${addBtn} mt-3 text-im-violet hover:opacity-80`}
                              >
                                <Plus className="size-4" />
                                Add condition
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    <div className="flex items-center gap-5 pt-1">
                      <button
                        type="button"
                        onClick={() => addRule()}
                        disabled={free.length === 0}
                        className={`${addBtn} text-im-violet hover:opacity-80`}
                      >
                        <Plus className="size-4" />
                        Add condition
                      </button>
                      <button
                        type="button"
                        onClick={addGroup}
                        disabled={free.length === 0}
                        className={`${addBtn} text-im-ink/70 hover:text-im-ink`}
                      >
                        <Plus className="size-4" />
                        Add group
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <FilterBrowser used={used} onToggle={toggleField} />
                </div>
              </div>

              {/* Footer */}
              <div className="flex shrink-0 items-center justify-between border-t border-black/6 bg-im-surface/30 px-6 py-4">
                <Button
                  variant="secondary"
                  onClick={() => setNodes([])}
                  disabled={nodes.length === 0}
                >
                  Reset
                </Button>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={apply}>
                    Apply filters{used.size > 0 ? ` (${used.size})` : ""}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Quick Filter Bar ---

export function DiscoveryFilterBar({
  platforms,
  setPlatforms,
  nicheLogic,
  setNicheLogic,
  nicheTerms,
  setNicheTerms,
  topics,
  setTopics,
  lookalike1,
  setLookalike1,
  lookalike2,
  setLookalike2,
  isAdvanced,
  setIsAdvanced,
  activeCount,
  onClearAll,
}: {
  platforms: Platform[];
  setPlatforms: (p: Platform[]) => void;
  nicheLogic: "AND" | "OR" | "NOR";
  setNicheLogic: (l: "AND" | "OR" | "NOR") => void;
  nicheTerms: string[];
  setNicheTerms: (t: string[]) => void;
  topics: string[];
  setTopics: (t: string[]) => void;
  lookalike1: string;
  setLookalike1: (v: string) => void;
  lookalike2: string;
  setLookalike2: (v: string) => void;
  isAdvanced: boolean;
  setIsAdvanced: (v: boolean) => void;
  activeCount: number;
  onClearAll: () => void;
}) {
  const allPlatforms: Platform[] = ["Instagram", "TikTok", "YouTube", "X"];
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const togglePlatform = (p: Platform) => {
    setPlatforms(
      platforms.includes(p)
        ? platforms.filter((x) => x !== p)
        : [...platforms, p],
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Platform Multi-Select */}
      <div className="relative">
        <button
          onClick={() =>
            setOpenFilter(openFilter === "platform" ? null : "platform")
          }
          className={`im-card flex h-10 items-center gap-2 rounded-xl px-3 text-[13px] font-medium transition-colors ${
            platforms.length > 0
              ? "bg-im-ink text-white"
              : "text-im-muted hover:text-im-ink"
          }`}
        >
          <span>
            Platform {platforms.length > 0 && `(${platforms.length})`}
          </span>
        </button>
        {openFilter === "platform" && (
          <div className="absolute top-full left-0 mt-2 z-50 w-56 rounded-2xl border border-black/6 bg-white p-3 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-[11px] font-semibold text-im-muted uppercase tracking-wider mb-2 px-2">
              Select Platforms
            </p>
            {allPlatforms.map((p) => (
              <label
                key={p}
                className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-im-surface cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={platforms.includes(p)}
                  onChange={() => togglePlatform(p)}
                  className="size-4 rounded border-black/20 text-im-violet focus:ring-im-violet"
                />
                <span className="text-[13px] text-im-ink">{p}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Niche Filter */}
      <div className="relative">
        <button
          onClick={() => setOpenFilter(openFilter === "niche" ? null : "niche")}
          className={`im-card flex h-10 items-center gap-2 rounded-xl px-3 text-[13px] font-medium transition-colors ${
            nicheTerms.length > 0
              ? "bg-im-ink text-white"
              : "text-im-muted hover:text-im-ink"
          }`}
        >
          <Target className="size-3.5" />
          <span>Niche {nicheTerms.length > 0 && `(${nicheTerms.length})`}</span>
        </button>
        {openFilter === "niche" && (
          <div className="absolute top-full left-0 mt-2 z-50 w-80 rounded-2xl border border-black/6 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-im-muted uppercase tracking-wider mb-2">
                  Match Logic
                </p>
                <div className="flex gap-1 bg-im-surface p-1 rounded-xl">
                  {(["AND", "OR", "NOR"] as const).map((logic) => (
                    <button
                      key={logic}
                      onClick={() => setNicheLogic(logic)}
                      className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
                        nicheLogic === logic
                          ? "bg-white text-im-ink shadow-sm"
                          : "text-im-muted hover:text-im-ink"
                      }`}
                    >
                      {logic}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-im-muted uppercase tracking-wider mb-2">
                  Terms
                </p>
                <div className="flex flex-wrap gap-2">
                  {nicheTerms.map((tag, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 rounded-lg bg-im-violet/10 px-2.5 py-1 text-[12px] font-medium text-im-violet"
                    >
                      {tag}
                      <button
                        onClick={() =>
                          setNicheTerms(
                            nicheTerms.filter((_, idx) => idx !== i),
                          )
                        }
                        className="hover:text-im-ink"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-black/6">
                <Button
                  variant="secondary"
                  className="flex-1 text-[12px] py-2 h-auto"
                  onClick={() => {
                    setNicheTerms([]);
                    setOpenFilter(null);
                  }}
                >
                  Clear
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 text-[12px] py-2 h-auto"
                  onClick={() => setOpenFilter(null)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Topics Filter */}
      <div className="relative">
        <button
          onClick={() =>
            setOpenFilter(openFilter === "topics" ? null : "topics")
          }
          className={`im-card flex h-10 items-center gap-2 rounded-xl px-3 text-[13px] font-medium transition-colors ${
            topics.length > 0
              ? "bg-im-ink text-white"
              : "text-im-muted hover:text-im-ink"
          }`}
        >
          <Hash className="size-3.5" />
          <span>Topics {topics.length > 0 && `(${topics.length})`}</span>
        </button>
        {openFilter === "topics" && (
          <div className="absolute top-full left-0 mt-2 z-50 w-80 rounded-2xl border border-black/6 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-[11px] font-semibold text-im-muted uppercase tracking-wider mb-3">
              Hashtag Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {topics.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 rounded-lg bg-im-violet/10 px-2.5 py-1 text-[12px] font-medium text-im-violet"
                >
                  #{tag}
                  <button
                    onClick={() =>
                      setTopics(topics.filter((_, idx) => idx !== i))
                    }
                    className="hover:text-im-ink"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 pt-3 border-t border-black/6">
              <Button
                variant="secondary"
                className="flex-1 text-[12px] py-2 h-auto"
                onClick={() => {
                  setTopics([]);
                  setOpenFilter(null);
                }}
              >
                Clear
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-[12px] py-2 h-auto"
                onClick={() => setOpenFilter(null)}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Lookalikes Filter */}
      <div className="relative">
        <button
          onClick={() =>
            setOpenFilter(openFilter === "lookalikes" ? null : "lookalikes")
          }
          className={`im-card flex h-10 items-center gap-2 rounded-xl px-3 text-[13px] font-medium transition-colors ${
            lookalike1 || lookalike2
              ? "bg-im-ink text-white"
              : "text-im-muted hover:text-im-ink"
          }`}
        >
          <AtSign className="size-3.5" />
          <span>Lookalikes</span>
        </button>
        {openFilter === "lookalikes" && (
          <div className="absolute top-full left-0 mt-2 z-50 w-80 rounded-2xl border border-black/6 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-[11px] font-semibold text-im-muted uppercase tracking-wider mb-3">
              Compare with
            </p>
            <div className="space-y-2">
              <input
                value={lookalike1}
                onChange={(e) => setLookalike1(e.target.value)}
                placeholder="@creator_handle_1"
                className="w-full rounded-xl border border-black/10 bg-im-surface px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-im-violet/20"
              />
              <input
                value={lookalike2}
                onChange={(e) => setLookalike2(e.target.value)}
                placeholder="@creator_handle_2 (optional)"
                className="w-full rounded-xl border border-black/10 bg-im-surface px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-im-violet/20"
              />
            </div>
            <div className="flex gap-2 pt-3 border-t border-black/6">
              <Button
                variant="secondary"
                className="flex-1 text-[12px] py-2 h-auto"
                onClick={() => {
                  setLookalike1("");
                  setLookalike2("");
                  setOpenFilter(null);
                }}
              >
                Clear
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-[12px] py-2 h-auto"
                onClick={() => setOpenFilter(null)}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Clear All */}
      {activeCount > 0 && (
        <button
          onClick={onClearAll}
          className="text-[12px] font-medium text-im-violet hover:text-im-violet/80 px-2"
        >
          Clear all
        </button>
      )}

      {/* Advanced Filters Trigger */}
      <div className="flex-1" />
      <button
        onClick={() => setIsAdvanced(true)}
        className="im-card flex h-10 items-center gap-2 rounded-xl px-4 text-[13px] font-medium text-im-muted hover:text-im-ink transition-colors"
      >
        <SlidersHorizontal className="size-4" />
        Advanced Filters
      </button>
    </div>
  );
}
