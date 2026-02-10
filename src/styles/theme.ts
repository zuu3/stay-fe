export const theme = {
    colors: {
        bg: '#000000',
        surface: '#0d0d12',
        surfaceAlt: '#14141c',
        border: 'rgba(255,255,255,0.08)',
        borderHover: 'rgba(255,255,255,0.15)',
        text: '#ffffff',
        textSub: 'rgba(255,255,255,0.6)',
        textMuted: 'rgba(255,255,255,0.35)',
        accent: '#00b4ff',
        accentSoft: 'rgba(0, 180, 255, 0.1)',
        accentGlow: 'rgba(0, 180, 255, 0.35)',
    },
    font: {
        body: "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "'Outfit', sans-serif",
    },
} as const;

export type Theme = typeof theme;
