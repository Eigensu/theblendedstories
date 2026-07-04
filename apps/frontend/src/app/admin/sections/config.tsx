import { ComponentType } from 'react';
// These imports will be created later
import HeroEditor from './HeroEditor';
import TheEditEditor from './TheEditEditor';
import TBSNightsEditor from './TBSNightsEditor';
import WhatIsTBSEditor from './WhatIsTBSEditor';
import FooterEditor from './FooterEditor';
import SEOEditor from './SEOEditor';
import SettingsEditor from './SettingsEditor';
import WhatWeCoverEditor from './WhatWeCoverEditor';
import TBSTalksEditor from './TBSTalksEditor';

// Placeholder component until real ones are built
const Placeholder = ({ sectionId }: { sectionId: string }) => (
  <div className="p-8 text-center text-gray-500">Editor for {sectionId} coming soon</div>
);

export type AdminSection = {
  id: string;
  title: string;
  collection: string; // backend route prefix
  icon: string; // simple string for now, could be an SVG component
  component: ComponentType<any>;
  order: number;
};

export const adminSections: AdminSection[] = [
  { id: 'hero', title: 'Hero', collection: 'hero', icon: 'monitor', component: HeroEditor, order: 1 },
  { id: 'what_is_tbs', title: 'What is TBS', collection: 'what-is-tbs', icon: 'info', component: WhatIsTBSEditor, order: 2 },
  { id: 'what_we_cover', title: 'What We Cover', collection: 'what-we-cover', icon: 'image', component: WhatWeCoverEditor, order: 3 },
  { id: 'tbs_nights', title: 'TBS Nights', collection: 'tbs-nights', icon: 'moon', component: TBSNightsEditor, order: 4 },
  { id: 'the_edit', title: 'The Edit', collection: 'the-edit', icon: 'book', component: TheEditEditor, order: 5 },
  { id: 'tbs_talks', title: 'TBS Talks', collection: 'tbs-talks', icon: 'users', component: TBSTalksEditor, order: 6 },
  { id: 'footer', title: 'Footer', collection: 'footer', icon: 'layout', component: FooterEditor, order: 7 },
  { id: 'seo', title: 'SEO', collection: 'seo', icon: 'search', component: SEOEditor, order: 8 },
  { id: 'settings', title: 'Settings', collection: 'settings', icon: 'settings', component: SettingsEditor, order: 9 },
];
