"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import type { Block } from '@blocknote/core';
import { theme } from '@/styles/theme';
import { getPost, createPost, updatePost, isAdmin, type Post } from '@/lib/posts';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

const Page = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 120px 24px 80px;
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
  &::before { content: '←'; font-size: 16px; }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const TitleInput = styled.input`
  width: 100%;
  font-family: ${theme.font.display};
  font-size: 32px;
  font-weight: 800;
  color: ${theme.colors.text};
  background: transparent;
  border: none;
  outline: none;
  margin-bottom: 16px;

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

const SummaryInput = styled.input`
  width: 100%;
  font-size: 14px;
  color: ${theme.colors.textSub};
  background: transparent;
  border: none;
  outline: none;
  padding-bottom: 16px;
  border-bottom: 1px solid ${theme.colors.border};

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const TagOption = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${({ $active }) => $active ? theme.colors.accent : theme.colors.border};
  background: ${({ $active }) => $active ? theme.colors.accentSoft : 'transparent'};
  color: ${({ $active }) => $active ? theme.colors.accent : theme.colors.textSub};
  border-radius: 6px;
  transition: all 0.2s;
`;

const EditorWrap = styled.div`
  min-height: 400px;
  margin-bottom: 32px;
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid ${theme.colors.border};
`;

const CancelBtn = styled(Link)`
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.textSub};
  background: ${theme.colors.surfaceAlt};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  transition: all 0.2s;
  &:hover { border-color: ${theme.colors.borderHover}; }
`;

const SaveBtn = styled.button`
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: ${theme.colors.accent};
  border: none;
  border-radius: 8px;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const Denied = styled.div`
  text-align: center;
  padding: 120px 24px;
  color: ${theme.colors.textMuted};
  font-size: 16px;
`;

const tagOptions: Post["tag"][] = ["공지", "패치", "이벤트"];

function WritePageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const editId = searchParams.get('id');

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [tag, setTag] = useState<Post["tag"]>('공지');
    const [saving, setSaving] = useState(false);
    const contentRef = useRef<Block[]>([]);
    const [initialContent, setInitialContent] = useState<Block[] | undefined>(undefined);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (editId) {
            const existing = getPost(editId);
            if (existing) {
                setTitle(existing.title);
                setSummary(existing.summary);
                setTag(existing.tag);
                setInitialContent(existing.content);
                contentRef.current = existing.content;
            }
        }
        setReady(true);
    }, [editId]);

    if (status === 'loading') return null;
    if (!isAdmin(session?.user?.id)) {
        return (
            <Denied>
                <p>관리자만 접근할 수 있습니다.</p>
                <BackLink href="/notices">목록으로</BackLink>
            </Denied>
        );
    }

    const handleSave = () => {
        if (!title.trim()) return;
        setSaving(true);

        if (editId) {
            updatePost(editId, {
                title: title.trim(),
                summary: summary.trim(),
                tag,
                content: contentRef.current,
            });
            router.push(`/notices/${editId}`);
        } else {
            const newPost = createPost({
                title: title.trim(),
                summary: summary.trim(),
                tag,
                content: contentRef.current,
            });
            router.push(`/notices/${newPost.id}`);
        }
    };

    return (
        <Page>
            <BackLink href="/notices">목록으로</BackLink>
            <Header>
                <TagRow>
                    {tagOptions.map(t => (
                        <TagOption key={t} $active={tag === t} onClick={() => setTag(t)}>{t}</TagOption>
                    ))}
                </TagRow>
                <TitleInput
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                />
                <SummaryInput
                    placeholder="요약 (목록에 표시됩니다)"
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                />
            </Header>
            <EditorWrap>
                {ready && (
                    <Editor
                        initialContent={initialContent}
                        onChange={blocks => { contentRef.current = blocks; }}
                        editable={true}
                    />
                )}
            </EditorWrap>
            <BottomBar>
                <CancelBtn href="/notices">취소</CancelBtn>
                <SaveBtn onClick={handleSave} disabled={saving || !title.trim()}>
                    {saving ? '저장 중...' : editId ? '수정 완료' : '작성 완료'}
                </SaveBtn>
            </BottomBar>
        </Page>
    );
}

export default function WritePage() {
    return (
        <Suspense>
            <WritePageInner />
        </Suspense>
    );
}
