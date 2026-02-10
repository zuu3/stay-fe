"use client";

import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

const lawData = [
    {
        id: 'server',
        title: '서버 이용 규칙',
        sections: [
            { heading: '제1조 (기본 규칙)', body: '모든 유저는 상호 존중하며, 비매너 행위를 삼가야 합니다. 타인에게 불쾌감을 주는 언행, 차별 발언, 고의적인 게임 방해 행위는 제재 대상입니다.' },
            { heading: '제2조 (버그 악용)', body: '의도되지 않은 시스템 오류를 이용한 이득 취득은 금지됩니다. 발견 시 운영진에게 즉시 신고해주시기 바랍니다.' },
            { heading: '제3조 (핵/매크로)', body: '외부 프로그램을 사용한 모든 형태의 핵, 매크로, 오토는 영구 차단 사유에 해당합니다.' },
        ],
    },
    {
        id: 'rp',
        title: '일반 RP 법률',
        sections: [
            { heading: '제1조 (RP 기본)', body: 'RP(Role Play) 상황에서는 자신의 캐릭터에 맞는 행동을 해야 합니다. 현실의 정보와 게임 내 정보를 혼용하는 메타게이밍은 금지됩니다.' },
            { heading: '제2조 (신규 생명 규칙)', body: '사망 후 부활 시 직전 사망과 관련된 모든 기억이 소멸됩니다. 사망 상황에 대한 보복이나 언급은 불가합니다.' },
            { heading: '제3조 (강제 RP)', body: '상대방의 동의 없이 과도한 강제 RP를 진행하는 것은 금지됩니다.' },
        ],
    },
    {
        id: 'civil',
        title: '공무원 법률',
        sections: [
            { heading: '제1조 (직무 수행)', body: '경찰, 소방, 의료진 등 공무원 직렬은 해당 직무에 맞는 행동을 해야 하며, 직무 중 사적 이득을 취하는 행위는 금지됩니다.' },
            { heading: '제2조 (관할권)', body: '각 공무원 직렬은 정해진 관할 구역과 업무 범위 내에서만 활동해야 합니다.' },
        ],
    },
    {
        id: 'gang',
        title: '조직 RP 법률',
        sections: [
            { heading: '제1조 (조직 등록)', body: '조직 활동을 위해서는 운영진의 사전 승인이 필요합니다. 미등록 조직 활동은 제재 대상입니다.' },
            { heading: '제2조 (항쟁 규칙)', body: '조직 간 분쟁 시 정해진 절차에 따라 진행해야 하며, 무분별한 총격전은 금지됩니다.' },
        ],
    },
];

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 120px 48px 80px;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 100px 20px 60px;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 100px;
  align-self: start;

  @media (max-width: 768px) {
    position: static;
    display: flex;
    gap: 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
  }
`;

const SideTitle = styled.h3`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${theme.colors.textMuted};
  margin-bottom: 20px;

  @media (max-width: 768px) { display: none; }
`;

const SideItem = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  margin-bottom: 2px;
  font-size: 14px;
  font-weight: ${({ $active }) => $active ? 600 : 400};
  color: ${({ $active }) => $active ? theme.colors.text : theme.colors.textSub};
  background: ${({ $active }) => $active ? theme.colors.accentSoft : 'transparent'};
  border: none;
  border-left: 2px solid ${({ $active }) => $active ? theme.colors.accent : 'transparent'};
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: ${theme.colors.text};
    background: ${({ $active }) => $active ? theme.colors.accentSoft : 'rgba(255,255,255,0.03)'};
  }

  @media (max-width: 768px) {
    width: auto;
    flex-shrink: 0;
    margin-bottom: 0;
    border-left: none;
    border-radius: 6px;
    border: 1px solid ${({ $active }) => $active ? theme.colors.accent : theme.colors.border};
  }
`;

const Content = styled.article``;

const ContentTitle = styled.h1`
  font-family: ${theme.font.display};
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 48px;
`;

const Section = styled.div`
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${theme.colors.border};
  &:last-of-type { border-bottom: none; }
`;

const SectionHeading = styled.h2`
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 14px;
`;

const SectionBody = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: ${theme.colors.textSub};
`;

export default function LawsPage() {
    const [active, setActive] = useState('server');
    const current = lawData.find(d => d.id === active)!;

    return (
        <Page>
            <Sidebar>
                <SideTitle>카테고리</SideTitle>
                {lawData.map(d => (
                    <SideItem key={d.id} $active={active === d.id} onClick={() => setActive(d.id)}>
                        {d.title}
                    </SideItem>
                ))}
            </Sidebar>
            <Content>
                <ContentTitle>{current.title}</ContentTitle>
                {current.sections.map((s, i) => (
                    <Section key={i}>
                        <SectionHeading>{s.heading}</SectionHeading>
                        <SectionBody>{s.body}</SectionBody>
                    </Section>
                ))}
            </Content>
        </Page>
    );
}
