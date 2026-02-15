import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Discord],
    callbacks: {
        async jwt({ token, profile }) {
            if (profile) {
                token.id = profile.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.id) {
                session.user.id = token.id as string;
            }
            const adminEmailsStr = process.env.ADMIN_EMAILS || "";
            const adminEmails = adminEmailsStr.split(",").map(e => e.trim());
            session.user.isAdmin = !!session.user.email && adminEmails.includes(session.user.email);
            return session;
        },
    },
});
