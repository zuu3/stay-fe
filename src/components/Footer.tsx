"use client";

import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

const Wrap = styled.footer`
  padding: 40px 48px;
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 32px 24px;
  }
`;

const Copy = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
`;

const Links = styled.div`
  display: flex;
  gap: 20px;
`;

const FootLink = styled.a`
  font-size: 12px;
  color: ${theme.colors.textMuted};
  transition: color 0.2s;
  &:hover { color: ${theme.colors.textSub}; }
`;

export default function Footer() {
    return (
        <Wrap>
            <Copy>© 2026 Stay. All rights reserved.</Copy>
            <Links>
                <FootLink href="#">이용약관</FootLink>
                <FootLink href="#">개인정보 처리방침</FootLink>
            </Links>
        </Wrap>
    );
}
