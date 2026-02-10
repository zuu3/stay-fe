import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Discord],
    callbacks: {
        async session({ session, token }) {
            if (token.sub) session.user.id = token.sub;
            const adminEmailsStr = process.env.ADMIN_EMAILS || "";
            const adminEmails = adminEmailsStr.split(",").map(e => e.trim());
            session.user.isAdmin = !!session.user.email && adminEmails.includes(session.user.email);
            return session;
        },
    },
});
