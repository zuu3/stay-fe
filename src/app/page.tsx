"use client";

import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { theme } from '@/styles/theme';
import { useEffect, useState, useRef, useCallback } from 'react';

/* ── types ── */
type Post = {
  id: string;
  tag: '공지' | '패치' | '이벤트';
  date: string;
  title: string;
  summary: string;
};

/* ── animations ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50%      { opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Section wrapper ── */
const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  overflow: hidden;
`;

/* ━━━ SECTION 1: HERO ━━━ */
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

const Noise = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  text-align: center;
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
  font-size: clamp(32px, 8vw, 80px);
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

/* ━━━ SECTION 2/3 SHARED ━━━ */
const SectionBG = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background: ${theme.colors.bg};
`;

const SectionInner = styled(motion.div)`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1100px;
  padding: 0 48px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const SectionLabel = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${theme.colors.accent};
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.font.display};
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: clamp(24px, 7vw, 32px);
  }
`;

const SectionDesc = styled.p`
  font-size: 15px;
  color: ${theme.colors.textSub};
  margin-bottom: 40px;
  max-width: 480px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 28px;
  }
`;

/* ━━━ SECTION 2: 새로운 소식 ━━━ */
const TabRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
`;

const TabBtn = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid ${({ $active }) => $active ? theme.colors.accent : theme.colors.border};
  background: ${({ $active }) => $active ? theme.colors.accentSoft : 'transparent'};
  color: ${({ $active }) => $active ? theme.colors.accent : theme.colors.textSub};
  border-radius: 999px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${theme.colors.accent};
    color: ${theme.colors.accent};
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const PostCard = styled(Link)`
  display: block;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;

  &:hover {
    border-color: ${theme.colors.borderHover};
    transform: translateY(-4px);
  }
`;

const PostCardThumb = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: ${theme.colors.surfaceAlt};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: ${theme.colors.textMuted};
`;

const PostCardBody = styled.div`
  padding: 18px;
`;

const PostCardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const PostTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${theme.colors.accent};
`;

const PostDate = styled.span`
  font-size: 11px;
  color: ${theme.colors.textMuted};
`;

const PostCardTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostCardDesc = styled.p`
  font-size: 13px;
  color: ${theme.colors.textSub};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.textSub};
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.accent};
  }

  &::after {
    content: '→';
  }
`;

/* ━━━ SECTION 3: 게임 가이드 ━━━ */
const GuideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const GuideCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px 28px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
  transition: border-color 0.3s, transform 0.3s;

  &:hover {
    border-color: ${theme.colors.borderHover};
    transform: translateY(-4px);
  }
`;

const GuideIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${theme.colors.accentSoft};
  font-size: 22px;
`;

const GuideTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

const GuideDesc = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSub};
  line-height: 1.6;
`;

/* ━━━ SECTION 4: 커뮤니티 ━━━ */
const CommunityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const CommunityCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 24px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
  text-align: center;
  transition: border-color 0.3s, transform 0.3s;

  &:hover {
    border-color: ${theme.colors.borderHover};
    transform: translateY(-4px);
  }
`;

const CommunityIcon = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: ${theme.colors.accentSoft};
`;

const CommunityName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

const CommunityDesc = styled.span`
  font-size: 13px;
  color: ${theme.colors.textMuted};
`;

/* ━━━ Footer in section 4 ━━━ */
const FooterBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 48px;
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
    padding: 20px 24px;
  }
`;

const FooterCopy = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const FooterLink = styled.a`
  font-size: 12px;
  color: ${theme.colors.textMuted};
  transition: color 0.2s;
  &:hover { color: ${theme.colors.textSub}; }
`;



/* ── tag icons ── */
const tagIcon: Record<string, string> = {
  '공지': '📢',
  '패치': '🔧',
  '이벤트': '🎉',
};

/* ── tab → tag mapping ── */
const newsTabs = [
  { label: '전체', tag: null },
  { label: '업데이트', tag: '패치' },
  { label: '이벤트', tag: '이벤트' },
  { label: '공지사항', tag: '공지' },
];

/* ── guide data ── */
const guides = [
  {
    icon: '⚖️',
    title: '법률',
    desc: '서버 내 적용되는 규칙과 법률을 확인하세요.',
    href: '/laws',
  },
  {
    icon: '🔗',
    title: '접속 방법',
    desc: 'FiveM 설치부터 서버 접속까지 단계별로 안내합니다.',
    href: '/laws',
  },
  {
    icon: '📖',
    title: '뉴비 가이드',
    desc: '처음 시작하는 분들을 위한 필수 가이드를 제공합니다.',
    href: '/laws',
  },
];

/* ── community links ── */
const communityLinks = [
  {
    name: '유튜브',
    desc: '영상으로 만나보세요',
    href: 'https://youtube.com',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.016 3.016 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000" />
      </svg>
    ),
  },
  {
    name: '디스코드',
    desc: '커뮤니티에 참여하세요',
    href: 'https://discord.gg/BsFcbVA84Z',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" fill="#5865F2" />
      </svg>
    ),
  },
  {
    name: '어플리케이션',
    desc: '서버 지원 신청',
    href: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
  },
];

const SECTION_COUNT = 4;

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newsTab, setNewsTab] = useState<string | null>(null);


  // Fetch data
  useEffect(() => {
    fetchPreReg();
    fetchPosts();
  }, [session]);

  const fetchPreReg = async () => {
    try {
      const res = await fetch('/api/pre-registration');
      const data = await res.json();
      setCount(data.count || 0);
      setIsRegistered(!!data.isRegistered);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
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

  // Filter posts for news section
  const filteredPosts = newsTab
    ? posts.filter(p => p.tag === newsTab)
    : posts;
  const displayPosts = filteredPosts.slice(0, 3);

  return (
    <main>
      {/* ── SECTION 0: HERO ── */}
      <Section id="section-0">
        <BG />
        <Noise />
        <HeroContent
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
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
        </HeroContent>
        <ScrollHint>SCROLL</ScrollHint>
      </Section>

      {/* ── SECTION 1: 새로운 소식 ── */}
      <Section id="section-1">
        <SectionBG />
        <Noise />
        <SectionInner
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionLabel>NEWS</SectionLabel>
          <SectionTitle>새로운 소식</SectionTitle>
          <SectionDesc>서버의 최신 공지사항, 업데이트, 이벤트를 확인하세요.</SectionDesc>

          <TabRow>
            {newsTabs.map(t => (
              <TabBtn
                key={t.label}
                $active={newsTab === t.tag}
                onClick={() => setNewsTab(t.tag)}
              >
                {t.label}
              </TabBtn>
            ))}
          </TabRow>

          <CardGrid>
            {displayPosts.length > 0 ? displayPosts.map(p => (
              <PostCard key={p.id} href={`/notices/${p.id}`}>
                <PostCardThumb>{tagIcon[p.tag] ?? '📄'}</PostCardThumb>
                <PostCardBody>
                  <PostCardMeta>
                    <PostTag>{p.tag}</PostTag>
                    <PostDate>{p.date}</PostDate>
                  </PostCardMeta>
                  <PostCardTitle>{p.title}</PostCardTitle>
                  <PostCardDesc>{p.summary}</PostCardDesc>
                </PostCardBody>
              </PostCard>
            )) : (
              <p style={{ color: theme.colors.textMuted, fontSize: 14, gridColumn: '1 / -1' }}>
                등록된 게시물이 없습니다.
              </p>
            )}
          </CardGrid>

          <MoreLink href="/notices">모든 소식 보기</MoreLink>
        </SectionInner>
      </Section>

      {/* ── SECTION 2: 게임 가이드 ── */}
      <Section id="section-2">
        <SectionBG />
        <Noise />
        <SectionInner
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionLabel>GUIDE</SectionLabel>
          <SectionTitle>게임 가이드</SectionTitle>
          <SectionDesc>서버 규칙부터 입문 가이드까지, 필요한 정보를 한눈에.</SectionDesc>

          <GuideGrid>
            {guides.map(g => (
              <GuideCard key={g.title} href={g.href}>
                <GuideIcon>{g.icon}</GuideIcon>
                <GuideTitle>{g.title}</GuideTitle>
                <GuideDesc>{g.desc}</GuideDesc>
              </GuideCard>
            ))}
          </GuideGrid>
        </SectionInner>
      </Section>

      {/* ── SECTION 3: 커뮤니티 ── */}
      <Section id="section-3">
        <SectionBG />
        <Noise />
        <SectionInner
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <SectionLabel>COMMUNITY</SectionLabel>
          <SectionTitle>커뮤니티</SectionTitle>
          <SectionDesc>다양한 채널에서 STAY를 만나보세요.</SectionDesc>

          <CommunityGrid>
            {communityLinks.map(c => (
              <CommunityCard
                key={c.name}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CommunityIcon>{c.icon}</CommunityIcon>
                <CommunityName>{c.name}</CommunityName>
                <CommunityDesc>{c.desc}</CommunityDesc>
              </CommunityCard>
            ))}
          </CommunityGrid>
        </SectionInner>

        <FooterBar>
          <FooterCopy>© 2026 Stay. All rights reserved.</FooterCopy>
          <FooterLinks>
            <FooterLink href="#">이용약관</FooterLink>
            <FooterLink href="#">개인정보 처리방침</FooterLink>
          </FooterLinks>
        </FooterBar>
      </Section>
    </main>
  );
}
