import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "서버 법전",
    description: "원활한 플레이를 위해 STAY FiveM 서버의 규칙과 가이드라인을 반드시 숙지해주세요.",
};

export default function LawsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
