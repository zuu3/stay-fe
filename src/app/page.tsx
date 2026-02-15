"use client";

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { theme } from '@/styles/theme';
import { useEffect, useState } from 'react';

/* ── animations ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50%      { opacity: 1; }
`;

/* ── layout ── */
const Hero = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  overflow: hidden;
`;

/* dark gradient bg with subtle color bleed */
const BG = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 80, 160, 0.18) 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 80% 20%, rgba(0, 140, 255, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 20% 70%, rgba(60, 0, 180, 0.06) 0%, transparent 60%),
    ${theme.colors.bg};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 60%, ${theme.colors.bg} 100%);
  }
`;

/* noise overlay for grain texture */
const Noise = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  animation: ${fadeUp} 1s ease both;
  animation-delay: 0.2s;
`;

const LogoWrap = styled.div`
  margin-bottom: 36px;
  display: flex;
  justify-content: center;
`;

const Counter = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSub};
  margin-bottom: 24px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font-family: ${theme.font.display};
  font-size: clamp(32px, 8vw, 80px); /* 모바일에서 조금 더 크게 조절 */
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: clamp(28px, 10vw, 48px);
    margin-bottom: 24px;
    line-height: 1.25;
    word-break: keep-all;
  }
`;

/* hexagonal CTA button */
const CTAButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 64px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${theme.colors.text};
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  clip-path: polygon(
    16px 0%, calc(100% - 16px) 0%,
    100% 50%,
    calc(100% - 16px) 100%, 16px 100%,
    0% 50%
  );
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.accent};
    color: ${theme.colors.accent};
    box-shadow: 0 0 30px ${theme.colors.accentGlow};
  }
`;

const ScrollHint = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.textMuted};
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: ${pulse} 2s ease-in-out infinite;

  &::after {
    content: '';
    width: 1px;
    height: 24px;
    background: linear-gradient(to bottom, ${theme.colors.textMuted}, transparent);
  }
`;

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchData();
  }, [session]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/pre-registration');
      const data = await res.json();
      setCount(data.count || 0);
      setIsRegistered(!!data.isRegistered);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCTA = () => {
    if (session) {
      if (isRegistered) {
        alert('이미 사전예약이 완료되었습니다!');
        return;
      }
      router.push('/pre-registration');
    } else {
      signIn('discord', { callbackUrl: '/pre-registration' });
    }
  };

  return (
    <Hero>
      <BG />
      <Noise />
      <Content>
        <LogoWrap>
          <Image src="/assets/logo.png" alt="STAY" width={80} height={80} priority />
        </LogoWrap>
        {count >= 100 && (
          <Counter>{count.toLocaleString()}명이 사전예약에 참여했습니다</Counter>
        )}
        <Title>2026, 새롭게<br />돌아옵니다!</Title>
        <CTAButton onClick={handleCTA}>
          {session ? (isRegistered ? '신청 완료' : '사전예약 하기') : '사전예약'}
        </CTAButton>
      </Content>
      <ScrollHint>SCROLL</ScrollHint>
    </Hero>
  );
}
