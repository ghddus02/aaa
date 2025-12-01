import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const backendBaseUrl = process.env.BACKEND_API_BASE_URL!;

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account && account.id_token) {
				try {
					const res = await fetch(`${backendBaseUrl}/auth/google`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							idToken: account.id_token,
						}),
					});

					if (!res.ok) {
						console.error('Backend auth/google failed');
						return token;
					}

					const data = await res.json();
					token.backendAccessToken = data.accessToken;
					token.userId = data.userId;
				} catch (err) {
					console.error('Error calling backend auth/google', err);
				}
			}

			return token;
		},
		async session({ session, token }) {
			if (token?.backendAccessToken) {
				// @ts-ignore
				session.backendAccessToken = token.backendAccessToken;
			}
			if (token?.userId) {
				// @ts-ignore
				session.userId = token.userId;
			}
			return session;
		},
	},
	pages: {
		signIn: '/auth/signin',
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
