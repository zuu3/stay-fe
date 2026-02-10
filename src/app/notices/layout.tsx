import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "새로운 소식",
    description: "STAY 서버의 최신 공지사항, 패치 노트, 그리고 다양한 이벤트 소식을 확인하세요.",
};

export default function NoticesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
