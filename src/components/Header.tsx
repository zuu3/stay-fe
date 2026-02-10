"use client";

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { theme } from '@/styles/theme';

const Wrap = styled.header`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 64px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const LogoText = styled.span`
  font-family: ${theme.font.display};
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.5px;
  color: ${theme.colors.text};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 36px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link) <{ $active: boolean }>`
  font-size: 15px;
  font-weight: 500;
  color: ${({ $active }) => $active ? theme.colors.text : theme.colors.textSub};
  transition: color 0.2s;
  &:hover { color: ${theme.colors.text}; }
`;

const ExternalNavLink = styled.a`
  font-size: 15px;
  font-weight: 500;
  color: ${theme.colors.textSub};
  transition: color 0.2s;
  &:hover { color: ${theme.colors.text}; }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.textSub};

  @media (max-width: 768px) {
    span { display: none; } /* 모바일에서는 닉네임 숨기고 아바타만 노출 */
  }
`;

const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
`;

const LoginBtn = styled.button`
  padding: 0;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.textSub};
  transition: color 0.2s;
  &:hover { color: ${theme.colors.text}; }
`;

const GameStartBtn = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 8px 22px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff;
  background: ${theme.colors.accent};
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Hamburger = styled.button<{ $open: boolean }>`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 20px;
  height: 14px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 110;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    width: 100%;
    height: 2px;
    background: ${theme.colors.text};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: left center;

    &:nth-of-type(1) { transform: ${({ $open }) => $open ? 'rotate(45deg) translateY(-1px)' : 'rotate(0)'}; }
    &:nth-of-type(2) { opacity: ${({ $open }) => $open ? 0 : 1}; }
    &:nth-of-type(3) { transform: ${({ $open }) => $open ? 'rotate(-45deg) translateY(1px)' : 'rotate(0)'}; }
  }
`;

const MobileMenu = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: ${theme.colors.bg};
  z-index: 105; /* Wrap 보다는 위, Hamburger 보다는 아래 */
  display: flex;
  flex-direction: column;
  padding: 100px 24px;
  gap: 24px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ $open }) => $open ? 'translateY(0)' : 'translateY(-100%)'};
  pointer-events: ${({ $open }) => $open ? 'auto' : 'none'};
`;

const MobileNavLink = styled(Link) <{ $active: boolean }>`
  font-size: 24px;
  font-weight: 700;
  color: ${({ $active }) => $active ? theme.colors.accent : theme.colors.text};
`;

const MobileExternalLink = styled.a`
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

const links = [
  { href: '/notices', label: '새로운 소식' },
  { href: '/laws', label: '게임 가이드' },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <Wrap>
        <Logo href="/">
          <Image src="/assets/logo.png" alt="STAY" width={36} height={36} />
          <LogoText>STAY</LogoText>
        </Logo>

        <Nav>
          {links.map(l => (
            <NavLink key={l.href} href={l.href} $active={pathname.startsWith(l.href)}>
              {l.label}
            </NavLink>
          ))}
          <ExternalNavLink href="https://discord.gg/BsFcbVA84Z" target="_blank" rel="noopener noreferrer">
            디스코드
          </ExternalNavLink>
        </Nav>

        <Right>
          {session?.user ? (
            <UserChip>
              {session.user.image && <Avatar src={session.user.image} alt="" />}
              <span>{session.user.name}</span>
            </UserChip>
          ) : (
            <LoginBtn onClick={() => signIn('discord')}>로그인</LoginBtn>
          )}
          <GameStartBtn href="https://cfx.re/" target="_blank" rel="noopener noreferrer">
            GAME START
          </GameStartBtn>
          <Hamburger $open={open} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </Hamburger>
        </Right>
      </Wrap>

      <MobileMenu $open={open}>
        {links.map(l => (
          <MobileNavLink key={l.href} href={l.href} $active={pathname.startsWith(l.href)}>
            {l.label}
          </MobileNavLink>
        ))}
        <MobileExternalLink href="https://discord.gg/BsFcbVA84Z" target="_blank" rel="noopener noreferrer">
          디스코드
        </MobileExternalLink>
        {!session && (
          <MobileExternalLink as="button" onClick={() => signIn('discord')} style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0 }}>
            로그인
          </MobileExternalLink>
        )}
      </MobileMenu>
    </>
  );
}
