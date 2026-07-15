export const IMAGE_GUIDELINES = {
  hero: {
    desktop: "1920 × 1080 px",
    mobile: "1080 × 1350 px",
    aspectRatio: "16:9 Desktop / 4:5 Mobile",
    format: "JPG / PNG / WebP",
    maxSize: "5 MB"
  },
  articleHero: {
    desktop: "1920 × 1080 px",
    mobile: "1080 × 1350 px",
    aspectRatio: "16:9 Desktop / 4:5 Mobile",
    format: "JPG / PNG / WebP",
    maxSize: "5 MB"
  },
  articleCover: {
    desktop: "800 × 1000 px",
    mobile: "800 × 1000 px",
    aspectRatio: "4:5",
    format: "JPG / PNG / WebP",
    maxSize: "5 MB"
  },
  galleryImage: {
    desktop: "1200 × 800 px",
    mobile: "1200 × 800 px",
    aspectRatio: "3:2",
    format: "JPG / PNG / WebP",
    maxSize: "5 MB"
  },
  authorImage: {
    desktop: "400 × 400 px",
    mobile: "400 × 400 px",
    aspectRatio: "1:1",
    format: "JPG / PNG / WebP",
    maxSize: "2 MB"
  },
  talkSpeaker: {
    desktop: "800 × 1000 px",
    mobile: "800 × 1000 px",
    aspectRatio: "4:5",
    format: "JPG / PNG / WebP",
    maxSize: "5 MB"
  },
  topPick: {
    desktop: "800 × 1000 px",
    mobile: "800 × 1000 px",
    aspectRatio: "4:5",
    format: "JPG / PNG / WebP",
    maxSize: "5 MB"
  },
  whatWeCover: {
    desktop: "800 × 1000 px",
    mobile: "800 × 1000 px",
    aspectRatio: "4:5",
    format: "JPG / PNG / WebP",
    maxSize: "5 MB"
  },
  tbsNightsPoster: {
    desktop: "1920 × 1080 px",
    mobile: "1080 × 1350 px",
    aspectRatio: "16:9 Desktop / 4:5 Mobile",
    format: "JPG / PNG / WebP",
    maxSize: "5 MB"
  },
  footerLogo: {
    desktop: "400 × 200 px",
    mobile: "400 × 200 px",
    aspectRatio: "2:1",
    format: "PNG (Transparent) / WebP",
    maxSize: "2 MB"
  },
  footerBackground: {
    desktop: "1920 × 1080 px",
    mobile: "1080 × 1350 px",
    aspectRatio: "16:9 Desktop / 4:5 Mobile",
    format: "JPG / PNG / WebP",
    maxSize: "5 MB"
  },
  default: {
    desktop: "Recommended dimensions will be updated.",
    mobile: "Recommended dimensions will be updated.",
    aspectRatio: "-",
    format: "JPG / PNG / WebP",
    maxSize: "5 MB"
  }
} as const;

export type GuidelineKey = keyof typeof IMAGE_GUIDELINES;
