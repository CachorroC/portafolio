import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name                       : 'Portfolio',
    short_name                 : 'CV',
    background_color           : '#B71C1C',
    theme_color                : '#FF5252',
    prefer_related_applications: false,
    display                    : 'standalone',
    start_url                  : '/',
    //start_url                  : `https://${ process.env.BASE_URL ?? 'app.rsasesorjuridico.com' }`,
    description                : 'Contenido de Curriculum Vitae',
    display_override           : [
      'standalone',
      'minimal-ui'
    ],
    shortcuts: [
      {
        name : 'Hierbas',
        url  : '/herbs',
        icons: [
          {
            src    : '/icon.svg',
            sizes  : '150x150',
            purpose: 'any',
          },
        ],
      },
    ],

    icons: [
      {
        src    : '/web-app-manifest-192x192.png',
        sizes  : '192x192',
        type   : 'image/png',
        purpose: 'maskable',
      },
      {
        src    : '/web-app-manifest-512x512.png',
        sizes  : '512x512',
        type   : 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
