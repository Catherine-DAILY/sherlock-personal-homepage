// Sanity data access layer (read-only)
//
// Usage:
// 1) Create a Sanity project + dataset (see docs/运营后台（Sanity）指南.md)
// 2) Configure env vars (Vercel/Cloudflare Pages):
//    - VITE_SANITY_PROJECT_ID
//    - VITE_SANITY_DATASET
//    - VITE_SANITY_API_VERSION (optional)
//
// Notes:
// - This site uses public read access. Keep your dataset public or enable CORS + token.
// - For a zero-code editor experience, Sanity Studio is the "后台".

import { createClient } from "@sanity/client";

export const sanityConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined,
  dataset: (import.meta.env.VITE_SANITY_DATASET as string | undefined) ?? "production",
  apiVersion: (import.meta.env.VITE_SANITY_API_VERSION as string | undefined) ?? "2025-01-01",
  useCdn: true,
};

export function isSanityEnabled() {
  return Boolean(sanityConfig.projectId && sanityConfig.dataset);
}

export const sanityClient = isSanityEnabled()
  ? createClient({
      projectId: sanityConfig.projectId!,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: sanityConfig.useCdn,
    })
  : null;

export type SiteSettings = {
  title: string;
  tagline: string;
  description: string;
  contactHint?: string;
};

export type JournalEntry = {
  _id: string;
  title: string;
  date: string; // YYYY-MM-DD
  mood?: string;
  excerpt: string;
  likes?: number;
  coverUrl?: string;
};

export type CaseEntry = {
  _id: string;
  id: string;
  title: string;
  status: "进行中" | "已结案" | "归档";
  hook: string;
  tags: string[];
  background: string;
  observations: string[];
  deductions: string[];
  conclusion: string;
};

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityClient) return null;
  const q = `*[_type == "siteSettings"][0]{
    title,
    tagline,
    description,
    contactHint
  }`;
  return sanityClient.fetch(q);
}

export async function fetchJournalEntries(): Promise<JournalEntry[]> {
  if (!sanityClient) return [];
  const q = `*[_type=="journalEntry"]|order(date desc){
    _id,
    title,
    date,
    mood,
    excerpt,
    likes,
    "coverUrl": cover.asset->url
  }`;
  return sanityClient.fetch(q);
}

export async function fetchCaseEntries(): Promise<CaseEntry[]> {
  if (!sanityClient) return [];
  const q = `*[_type=="caseEntry"]|order(_createdAt desc){
    _id,
    id,
    title,
    status,
    hook,
    tags,
    background,
    observations,
    deductions,
    conclusion
  }`;
  return sanityClient.fetch(q);
}
