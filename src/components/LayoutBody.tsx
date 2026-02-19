"use client";

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function LayoutBody({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    if (isHome) {
        // 홈에서는 fullpage 스크롤이 자체 Footer를 포함하므로 main 태그 없이 직접 렌더링
        return <>{children}</>;
    }

    return (
        <>
            <main>{children}</main>
            <Footer />
        </>
    );
}
