import { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Murray State ACM',
    short_name: 'MSU ACM',
    description: 'A website for the Murray State ACM student organization.',
    start_url: '/',
    display: 'standalone',
    icons: [
        {
          src: '/acm-logo.png',
          sizes: 'any',
          type: 'image/png',
          purpose: 'any'
        },
      ],
  }
}