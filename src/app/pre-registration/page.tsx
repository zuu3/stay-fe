"use client";

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { theme } from '@/styles/theme';
import { useEffect, useState } from 'react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 140px 24px 80px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 100px 20px 60px;
  }
`;

const Title = styled.h1`
  font-family: ${theme.font.display};
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const Sub = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSub};
  margin-bottom: 24px;
`;

const CountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 40px;

  span {
    color: ${theme.colors.accent};
    font-weight: 700;
  }
`;

/* discord login card */
const LoginCard = styled.div`
  padding: 40px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 16px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 480px) {
    padding: 32px 20px;
  }
`;

const DiscordIcon = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  background: #5865F2;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
`;

const LoginDesc = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSub};
  line-height: 1.6;
  margin-bottom: 28px;
`;

const PrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #5865F2;
  border: none;
  border-radius: 10px;
  transition: opacity 0.2s;
  cursor: pointer;
  
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const RegisterBtn = styled(PrimaryBtn)`
  background: ${theme.colors.accent};
  color: ${theme.colors.bg};
`;

/* success state */
const Success = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
`;

const Check = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${theme.colors.accentSoft};
  border: 2px solid ${theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 24px;
`;

const SuccessTitle = styled.h2`
  font-family: ${theme.font.display};
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const SuccessDesc = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSub};
  line-height: 1.6;
  margin-bottom: 32px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  margin-bottom: 32px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const UserName = styled.span`
  font-size: 15px;
  font-weight: 600;
`;

const LogoutBtn = styled.button`
  margin-top: 12px;
  font-size: 13px;
  color: ${theme.colors.textMuted};
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  &:hover { color: ${theme.colors.textSub}; }
`;

const BackLink = styled.a`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.accent};
  &:hover { text-decoration: underline; }
`;

export default function PreRegistrationPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
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
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!session) return;
    setRegistering(true);
    try {
      const res = await fetch('/api/pre-registration', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsRegistered(true);
        setCount(data.count);
      } else {
        alert(data.message || '오류가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return null;

  /* 1. Logged in AND Registered -> Show Success */
  if (session && isRegistered) {
    return (
      <Page>
        <Success>
          <Check>✓</Check>
          <SuccessTitle>사전예약 완료</SuccessTitle>
          <SuccessDesc>
            오픈 일정이 확정되면<br />
            디스코드로 안내 드리겠습니다.
          </SuccessDesc>

          <CountBadge>
            현재 <span>{count.toLocaleString()}</span>명이 사전예약했어요
          </CountBadge>

          <UserInfo>
            {session.user?.image && <Avatar src={session.user.image} alt="" />}
            <UserName>{session.user?.name}</UserName>
          </UserInfo>

          <BackLink href="/">홈으로 돌아가기</BackLink>
          <LogoutBtn onClick={() => signOut()}>다른 계정으로 로그인</LogoutBtn>
        </Success>
      </Page>
    );
  }

  /* 2. Logged in But NOT Registered -> Show Register Button */
  if (session && !isRegistered) {
    return (
      <Page>
        <Title>사전예약</Title>
        <Sub>버튼을 눌러 사전예약을 완료하세요</Sub>

        <CountBadge>
          현재 <span>{count.toLocaleString()}</span>명이 사전예약했어요
        </CountBadge>

        <LoginCard>
          <UserInfo style={{ marginBottom: 20, justifyContent: 'center', border: 'none', background: 'transparent', padding: 0 }}>
            {session.user?.image && <Avatar src={session.user.image} alt="" />}
            <UserName>{session.user?.name}</UserName>
          </UserInfo>

          <LoginDesc>
            아래 버튼을 누르면<br />
            사전예약이 완료됩니다.
          </LoginDesc>

          <RegisterBtn onClick={handleRegister} disabled={registering}>
            {registering ? '처리중...' : '사전예약 신청하기'}
          </RegisterBtn>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
            <LogoutBtn onClick={() => signOut()}>다른 계정으로 로그인</LogoutBtn>
          </div>
        </LoginCard>
      </Page>
    );
  }

  /* 3. Not Logged In -> Show Discord Login */
  return (
    <Page>
      <Title>사전예약</Title>
      <Sub>디스코드 계정으로 간편하게 사전예약하세요</Sub>

      <CountBadge>
        현재 <span>{count.toLocaleString()}</span>명이 사전예약했어요
      </CountBadge>

      <LoginCard>
        <DiscordIcon>
          <svg width="28" height="22" viewBox="0 0 71 55" fill="none">
            <path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.7 40.7 0 00-1.8 3.7 54 54 0 00-16.2 0A37 37 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18 -.9 30.6.3 43a.3.3 0 00.1.2 58.7 58.7 0 0017.7 9 .2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.8 41.8 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.5 58.5 0 0070.6 43.2a.3.3 0 00.1-.2c1.4-14.5-2.4-27.1-10.1-38.2a.2.2 0 00-.1-.1zM23.7 35.6c-3.3 0-6-3-6-6.8s2.7-6.8 6-6.8 6.1 3.1 6 6.8c0 3.7-2.7 6.8-6 6.8zm22.2 0c-3.3 0-6-3-6-6.8s2.6-6.8 6-6.8c3.3 0 6 3.1 6 6.8 0 3.7-2.7 6.8-6 6.8z" fill="white" />
          </svg>
        </DiscordIcon>
        <LoginDesc>
          디스코드 계정으로 로그인하면<br />
          사전예약에 참여할 수 있습니다.
        </LoginDesc>
        <PrimaryBtn onClick={() => signIn('discord', { callbackUrl: '/pre-registration' })}>
          <svg width="18" height="14" viewBox="0 0 71 55" fill="none">
            <path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.7 40.7 0 00-1.8 3.7 54 54 0 00-16.2 0A37 37 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18-.9 30.6.3 43a.3.3 0 00.1.2 58.7 58.7 0 0017.7 9 .2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.8 41.8 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.5 58.5 0 0070.6 43.2a.3.3 0 00.1-.2c1.4-14.5-2.4-27.1-10.1-38.2a.2.2 0 00-.1-.1zM23.7 35.6c-3.3 0-6-3-6-6.8s2.7-6.8 6-6.8 6.1 3.1 6 6.8c0 3.7-2.7 6.8-6 6.8zm22.2 0c-3.3 0-6-3-6-6.8s2.6-6.8 6-6.8c3.3 0 6 3.1 6 6.8 0 3.7-2.7 6.8-6 6.8z" fill="white" />
          </svg>
          Discord로 계속하기
        </PrimaryBtn>
      </LoginCard>
    </Page>
  );
}

