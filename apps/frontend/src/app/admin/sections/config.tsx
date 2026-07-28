import { ComponentType } from 'react';
// These imports will be created later
import HeroEditor from './HeroEditor';
import ArticlesEditor from './ArticlesEditor';
import TopPicksEditor from './TopPicksEditor';
import TBSNightsEditor from './TBSNightsEditor';
import WhatIsTBSEditor from './WhatIsTBSEditor';
import FooterEditor from './FooterEditor';
import WhatWeCoverEditor from './WhatWeCoverEditor';
import TBSTalksEditor from './TBSTalksEditor';
import TBSTalksFeaturedEditor from './TBSTalksFeaturedEditor';
import MembersView from './MembersView';
import SubscribersView from './SubscribersView';
import WaitlistView from './WaitlistView';

// Placeholder component until real ones are built
const Placeholder = ({ sectionId }: { sectionId: string }) => (
  <div className="p-8 text-center text-gray-500">
    Editor for {sectionId} coming soon
  </div>
);

export type AdminSection = {
  id: string;
  title: string;
  collection: string; // backend route prefix
  icon: string; // simple string for now, could be an SVG component
  component: ComponentType<any>;
  order: number;
  group: 'home' | 'standalone' | 'global' | 'crm';
};

export const adminSections: AdminSection[] = [
  // Home group — homepage sections
  {
    id: 'hero',
    title: 'Hero',
    collection: 'hero',
    icon: 'monitor',
    component: HeroEditor,
    order: 1,
    group: 'home',
  },
  {
    id: 'what_is_tbs',
    title: 'What is TBS',
    collection: 'what-is-tbs',
    icon: 'info',
    component: WhatIsTBSEditor,
    order: 2,
    group: 'home',
  },
  {
    id: 'what_we_cover',
    title: 'What We Cover',
    collection: 'what-we-cover',
    icon: 'image',
    component: WhatWeCoverEditor,
    order: 3,
    group: 'home',
  },
  {
    id: 'tbs_nights',
    title: 'TBS Nights',
    collection: 'tbs-nights',
    icon: 'moon',
    component: TBSNightsEditor,
    order: 4,
    group: 'home',
  },
  {
    id: 'top_picks',
    title: 'Top Picks',
    collection: 'articles',
    icon: 'star',
    component: TopPicksEditor,
    order: 5,
    group: 'home',
  },
  {
    id: 'tbs_talks_featured',
    title: 'Featured Talks',
    collection: 'tbs-talks',
    icon: 'star',
    component: TBSTalksFeaturedEditor,
    order: 6,
    group: 'home',
  },
  {
    id: 'tbs_talks',
    title: 'TBS Talks',
    collection: 'tbs-talks',
    icon: 'users',
    component: TBSTalksEditor,
    order: 7,
    group: 'home',
  },

  // Standalone sections
  {
    id: 'articles',
    title: 'Articles',
    collection: 'articles',
    icon: 'book',
    component: ArticlesEditor,
    order: 7,
    group: 'standalone',
  },

  // Global sections
  {
    id: 'footer',
    title: 'Footer',
    collection: 'footer',
    icon: 'layout',
    component: FooterEditor,
    order: 8,
    group: 'global',
  },

  // CRM sections
  {
    id: 'members',
    title: 'Members',
    collection: 'members',
    icon: 'users',
    component: MembersView,
    order: 1,
    group: 'crm',
  },
  {
    id: 'subscribers',
    title: 'Newsletter Subscribers',
    collection: 'newsletter',
    icon: 'mail',
    component: SubscribersView,
    order: 2,
    group: 'crm',
  },
  {
    id: 'waitlist',
    title: 'TBS Nights Waitlist',
    collection: 'tbs-nights',
    icon: 'list',
    component: WaitlistView,
    order: 3,
    group: 'crm',
  },
];

// Helper selectors
export const homeSections = adminSections.filter((s) => s.group === 'home');
export const standaloneSections = adminSections.filter(
  (s) => s.group === 'standalone'
);
export const globalSections = adminSections.filter((s) => s.group === 'global');
export const crmSections = adminSections.filter((s) => s.group === 'crm');
