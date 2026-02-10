import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "사전예약",
    description: "STAY FiveM 서버의 사전예약에 참여하고 특별한 초기 보상을 놓치지 마세요.",
};

export default function PreRegistrationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
