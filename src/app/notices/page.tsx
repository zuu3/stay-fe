"use client";

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { theme } from '@/styles/theme';
import { getPosts, isAdmin, type Post } from '@/lib/posts';

const tags = ['전체', '공지', '패치', '이벤트'];

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 120px 48px 80px;

  @media (max-width: 768px) {
    padding: 100px 20px 60px;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const PageTitle = styled.h1`
  font-family: ${theme.font.display};
  font-size: 36px;
  font-weight: 800;
`;

const WriteBtn = styled(Link)`
  padding: 10px 24px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: ${theme.colors.accent};
  border-radius: 8px;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`;

const PageSub = styled.p`
  font-size: 14px;
  color: ${theme.colors.textMuted};
  margin-bottom: 40px;
`;

const Filters = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 48px;
`;

const FilterBtn = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid ${({ $active }) => $active ? theme.colors.accent : theme.colors.border};
  background: ${({ $active }) => $active ? theme.colors.accentSoft : 'transparent'};
  color: ${({ $active }) => $active ? theme.colors.accent : theme.colors.textSub};
  border-radius: 999px;
  transition: all 0.2s;
  &:hover {
    border-color: ${theme.colors.accent};
    color: ${theme.colors.accent};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const Card = styled(Link)`
  display: block;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s, transform 0.3s;

  &:hover {
    border-color: ${theme.colors.borderHover};
    transform: translateY(-4px);
  }
`;

const Thumb = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: ${theme.colors.surfaceAlt};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: ${theme.colors.textMuted};
`;

const CardBody = styled.div`
  padding: 20px;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const Tag = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${theme.colors.accent};
`;

const Divider = styled.span`
  font-size: 11px;
  color: ${theme.colors.textMuted};
`;

const DateText = styled.span`
  font-size: 11px;
  color: ${theme.colors.textMuted};
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.4;
`;

const CardDesc = styled.p`
  font-size: 13px;
  color: ${theme.colors.textSub};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const tagIcon: Record<string, string> = {
  '공지': '📢',
  '패치': '🔧',
  '이벤트': '🎉',
};

export default function NoticesPage() {
  const [filter, setFilter] = useState('전체');
  const [posts, setPosts] = useState<Post[]>([]);
  const { data: session } = useSession();
  const admin = session?.user?.isAdmin;

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const filtered = filter === '전체' ? posts : posts.filter(p => p.tag === filter);

  return (
    <Page>
      <TopRow>
        <PageTitle>새로운 소식</PageTitle>
        {admin && <WriteBtn href="/notices/write">글 작성</WriteBtn>}
      </TopRow>
      <PageSub>서버의 최신 공지사항과 업데이트를 확인하세요</PageSub>
      <Filters>
        {tags.map(t => (
          <FilterBtn key={t} $active={filter === t} onClick={() => setFilter(t)}>
            {t}
          </FilterBtn>
        ))}
      </Filters>
      <Grid>
        {filtered.map(p => (
          <Card key={p.id} href={`/notices/${p.id}`}>
            <Thumb>{tagIcon[p.tag] ?? '📄'}</Thumb>
            <CardBody>
              <CardMeta>
                <Tag>{p.tag}</Tag>
                <Divider>|</Divider>
                <DateText>{p.date}</DateText>
              </CardMeta>
              <CardTitle>{p.title}</CardTitle>
              <CardDesc>{p.summary}</CardDesc>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Page>
  );
}
