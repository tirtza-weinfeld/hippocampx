import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: '%s | HippoCampX',
        default: 'Hippocampx',
    },
    description: 'AI powered platform',
    keywords: 'AI, utility, learning, platform',
    openGraph: {
        title: 'HippoCampX',
        description: 'AI powered platform',
        url: 'https://hippocampx.vercel.app',
        siteName: 'HippoCampX',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://hippocampx.vercel.app/app-icon/opengraph-image.png',
                width: 1200,
                height: 630,
                alt: 'HippoCampX - AI Powered Platform',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@HippoCampX',
        title: 'HippoCampX',
        description: 'AI powered platform',
        images: ['https://hippocampx.vercel.app/app-icon/twitter-image.png'],
    },
    icons: {
        icon: '/app-icon/favicon.ico',
        shortcut: '/app-icon/favicon-16x16.png',
        apple: '/app-icon/apple-touch-icon.png',
    },
};
