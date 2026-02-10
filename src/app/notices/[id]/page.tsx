"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { theme } from '@/styles/theme';
import { getPost, deletePost, isAdmin, type Post } from '@/lib/posts';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

const Page = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 120px 24px 80px;

  @media (max-width: 768px) {
    padding: 100px 20px 60px;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${theme.colors.textSub};
  margin-bottom: 32px;
  transition: color 0.2s;
  &:hover { color: ${theme.colors.text}; }

  &::before {
    content: '←';
    font-size: 16px;
  }
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const TagBadge = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${theme.colors.accent};
  padding: 3px 10px;
  background: ${theme.colors.accentSoft};
  border-radius: 4px;
`;

const DateText = styled.span`
  font-size: 13px;
  color: ${theme.colors.textMuted};
`;

const Title = styled.h1`
  font-family: ${theme.font.display};
  font-size: 32px;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 40px;
`;

const ContentWrap = styled.div`
  min-height: 200px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid ${theme.colors.border};
`;

const EditBtn = styled(Link)`
  padding: 10px 24px;
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text};
  background: ${theme.colors.surfaceAlt};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  transition: all 0.2s;
  &:hover {
    border-color: ${theme.colors.borderHover};
  }
`;

const DeleteBtn = styled.button`
  padding: 10px 24px;
  font-size: 13px;
  font-weight: 600;
  color: #ff5555;
  background: transparent;
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: 8px;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 85, 85, 0.08);
    border-color: rgba(255, 85, 85, 0.5);
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: 120px 24px;
  color: ${theme.colors.textMuted};
  font-size: 16px;
`;

export default function NoticeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const admin = isAdmin(session?.user?.id);

    useEffect(() => {
        const id = params.id as string;
        const found = getPost(id);
        setPost(found ?? null);
        setLoading(false);
    }, [params.id]);

    if (loading) return null;

    if (!post) {
        return (
            <NotFound>
                <p>존재하지 않는 게시글입니다.</p>
                <BackLink href="/notices">목록으로 돌아가기</BackLink>
            </NotFound>
        );
    }

    const handleDelete = () => {
        if (confirm('정말 삭제하시겠습니까?')) {
            deletePost(post.id);
            router.push('/notices');
        }
    };

    return (
        <Page>
            <BackLink href="/notices">목록으로</BackLink>
            <Meta>
                <TagBadge>{post.tag}</TagBadge>
                <DateText>{post.date}</DateText>
            </Meta>
            <Title>{post.title}</Title>
            <ContentWrap>
                <Editor initialContent={post.content} editable={false} />
            </ContentWrap>

            {admin && (
                <Actions>
                    <EditBtn href={`/notices/write?id=${post.id}`}>수정</EditBtn>
                    <DeleteBtn onClick={handleDelete}>삭제</DeleteBtn>
                </Actions>
            )}
        </Page>
    );
}
