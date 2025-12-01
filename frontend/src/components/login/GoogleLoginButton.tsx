'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function GoogleLoginButton() {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return <button disabled>로딩 중...</button>;
	}

	if (session) {
		return (
			<div className="flex flex-col gap-2">
				<div>로그인됨: {session.user?.email}</div>
				<button
					onClick={() => signOut()}
					className="border px-4 py-2 rounded w-[200px]"
				>
					로그아웃
				</button>
			</div>
		);
	}

	return (
		<button
			onClick={() => signIn('google')}
			className="border px-4 py-2 rounded w-[200px]"
		>
			Google로 로그인
		</button>
	);
}
