'use client';

import { LoginForm } from '@/src/components/forms/LoginForm';
import { useAuth } from '@/src/hooks/useAuth.hooks';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push('/dashboard');
		}
	}, [isAuthenticated, isLoading, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F6F8FA]">
				<div className="animate-pulse flex flex-col items-center gap-4">
					<div className="w-12 h-12 rounded-xl bg-primary/20" />
					<div className="w-32 h-4 rounded bg-slate-200" />
				</div>
			</div>
		);
	}

	if (isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#F6F8FA] p-4">
			<div className="w-full max-w-md">
				<LoginForm />
			</div>
		</div>
	);
}
