import type { Block } from "@blocknote/core";

export const ADMIN_ID = "7cc60edf-a83c-4885-ab14-e1c26f74f6be";

export type Post = {
    id: string;
    tag: "공지" | "패치" | "이벤트";
    date: string;
    title: string;
    summary: string;
    content: Block[];
};

const STORAGE_KEY = "stay-posts";

const defaultPosts: Post[] = [
    {
        id: "1",
        tag: "공지",
        date: "2026.02.10",
        title: "사전예약 안내",
        summary: "사전예약이 시작되었습니다. 오픈 시 특별 보상이 지급됩니다.",
        content: [
            { id: "b1", type: "heading", props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "사전예약 안내", styles: {} }], children: [] },
            { id: "b2", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "STAY 서버의 사전예약이 공식적으로 시작되었습니다. 사전예약에 참여하신 모든 분께 오픈 시 특별 보상이 지급됩니다.", styles: {} }], children: [] },
            { id: "b3", type: "heading", props: { level: 3, textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "사전예약 보상", styles: {} }], children: [] },
            { id: "b4", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "초기 자본 $50,000 추가 지급", styles: {} }], children: [] },
            { id: "b5", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "사전예약 전용 차량 1대", styles: {} }], children: [] },
            { id: "b6", type: "bulletListItem", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "한정판 네임태그", styles: {} }], children: [] },
        ] as unknown as Block[],
    },
    {
        id: "2",
        tag: "패치",
        date: "2026.02.08",
        title: "2월 첫 번째 업데이트",
        summary: "차량 핸들링 개선 및 신규 주거지역이 추가됩니다.",
        content: [
            { id: "c1", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "차량 핸들링 시스템이 전면 개선되었으며, 새로운 주거지역이 맵에 추가되었습니다.", styles: {} }], children: [] },
        ] as unknown as Block[],
    },
    {
        id: "3",
        tag: "이벤트",
        date: "2026.02.05",
        title: "오픈 기념 이벤트",
        summary: "서버 오픈 후 48시간 내 접속하는 모든 분께 초기 자본을 드립니다.",
        content: [
            { id: "d1", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "서버 오픈 후 48시간 내 접속하는 모든 분께 초기 자본 $30,000을 드립니다. 친구를 초대하면 추가 보상도 받을 수 있습니다!", styles: {} }], children: [] },
        ] as unknown as Block[],
    },
    {
        id: "4",
        tag: "공지",
        date: "2026.02.01",
        title: "커뮤니티 규칙 안내",
        summary: "원활한 플레이를 위한 커뮤니티 가이드라인을 확인해주세요.",
        content: [
            { id: "e1", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "원활한 플레이를 위한 커뮤니티 가이드라인을 확인해주세요. 상세 규칙은 게임 가이드 페이지에서 확인하실 수 있습니다.", styles: {} }], children: [] },
        ] as unknown as Block[],
    },
    {
        id: "5",
        tag: "패치",
        date: "2026.01.28",
        title: "핫픽스 1.0.2",
        summary: "일부 차량 스폰 에러 및 NPC 관련 버그가 수정되었습니다.",
        content: [
            { id: "f1", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "일부 차량 스폰 에러 및 NPC 관련 버그가 수정되었습니다.", styles: {} }], children: [] },
        ] as unknown as Block[],
    },
    {
        id: "6",
        tag: "이벤트",
        date: "2026.01.20",
        title: "사전예약 달성 기념",
        summary: "1,000명 사전예약 달성을 기념하여 추가 보상이 준비됩니다.",
        content: [
            { id: "g1", type: "paragraph", props: { textColor: "default", backgroundColor: "default", textAlignment: "left" }, content: [{ type: "text", text: "1,000명 사전예약 달성을 기념하여 추가 보상이 준비됩니다. 감사합니다!", styles: {} }], children: [] },
        ] as unknown as Block[],
    },
];

function isClient() {
    return typeof window !== "undefined";
}

function loadPosts(): Post[] {
    if (!isClient()) return defaultPosts;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPosts));
        return defaultPosts;
    }
    try {
        return JSON.parse(raw);
    } catch {
        return defaultPosts;
    }
}

function savePosts(posts: Post[]) {
    if (!isClient()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function getPosts(): Post[] {
    return loadPosts();
}

export function getPost(id: string): Post | undefined {
    return loadPosts().find((p) => p.id === id);
}

export function createPost(post: Omit<Post, "id" | "date">): Post {
    const posts = loadPosts();
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
    const newPost: Post = {
        ...post,
        id: Date.now().toString(),
        date: dateStr,
    };
    savePosts([newPost, ...posts]);
    return newPost;
}

export function updatePost(id: string, data: Partial<Omit<Post, "id">>): Post | undefined {
    const posts = loadPosts();
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    posts[idx] = { ...posts[idx], ...data };
    savePosts(posts);
    return posts[idx];
}

export function deletePost(id: string): boolean {
    const posts = loadPosts();
    const filtered = posts.filter((p) => p.id !== id);
    if (filtered.length === posts.length) return false;
    savePosts(filtered);
    return true;
}

export function isAdmin(userId?: string | null): boolean {
    return userId === ADMIN_ID;
}
