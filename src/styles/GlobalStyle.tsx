"use client";

import { Global, css } from '@emotion/react';
import { theme } from './theme';

export default function GlobalStyle() {
    return (
        <Global
            styles={css`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          scroll-behavior: smooth;
        }

        body {
          font-family: ${theme.font.body};
          background: ${theme.colors.bg};
          color: ${theme.colors.text};
          line-height: 1.6;
          overflow-x: hidden;
        }

        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; cursor: pointer; }
        img { display: block; max-width: 100%; }

        ::selection {
          background: ${theme.colors.accentSoft};
          color: ${theme.colors.accent};
        }
      `}
        />
    );
}
