import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/ticklrLogo.png',
  url: 'https://ticklr.app',
  baseUrl: '/docs/',
  customFields: {
    reactAppUrl: 'http://localhost:3000/app', // UPDATE FOR PRODUCTION
  },
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/ticklrLogo.png',
    navbar: {
      title: 'Ticklr',
      logo: {
        alt: 'Ticklr Logo',
        src: 'img/ticklrLogo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'todoist',
          position: 'left',
          label: 'Todoist',
          collapsible: 'false'
        },{
          type: 'docSidebar',
          sidebarId: 'wonderlist',
          position: 'left',
          label: 'Wonderlist',
          collapsible: 'false'
        },
       { to: 'http://localhost:3000/app', // UPDATE FOR PRODUCTION
        label: 'Login',
        position: 'right'}
      ],
    },
    footer: {
      style: 'dark',
      links: [
      ],
      copyright: `Copyright © ${new Date().getFullYear()}Matt Lister.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
