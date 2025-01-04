import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs/markdown-page',
    component: ComponentCreator('/docs/markdown-page', 'c78'),
    exact: true
  },
  {
    path: '/docs/todoist',
    component: ComponentCreator('/docs/todoist', '994'),
    exact: true
  },
  {
    path: '/docs/Validate_Failure',
    component: ComponentCreator('/docs/Validate_Failure', '701'),
    exact: true
  },
  {
    path: '/docs/Validate_Success',
    component: ComponentCreator('/docs/Validate_Success', 'fbf'),
    exact: true
  },
  {
    path: '/docs/docs',
    component: ComponentCreator('/docs/docs', '5d1'),
    routes: [
      {
        path: '/docs/docs',
        component: ComponentCreator('/docs/docs', 'dbf'),
        routes: [
          {
            path: '/docs/docs',
            component: ComponentCreator('/docs/docs', '359'),
            routes: [
              {
                path: '/docs/docs/hello',
                component: ComponentCreator('/docs/docs/hello', 'f26'),
                exact: true
              },
              {
                path: '/docs/docs/intro',
                component: ComponentCreator('/docs/docs/intro', '2e5'),
                exact: true
              },
              {
                path: '/docs/docs/todoist/Instructions',
                component: ComponentCreator('/docs/docs/todoist/Instructions', 'c08'),
                exact: true,
                sidebar: "todoist"
              },
              {
                path: '/docs/docs/todoist/Introduction',
                component: ComponentCreator('/docs/docs/todoist/Introduction', '246'),
                exact: true,
                sidebar: "todoist"
              },
              {
                path: '/docs/docs/wonderlist/',
                component: ComponentCreator('/docs/docs/wonderlist/', '7a7'),
                exact: true,
                sidebar: "wonderlist"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/docs/',
    component: ComponentCreator('/docs/', 'bba'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
