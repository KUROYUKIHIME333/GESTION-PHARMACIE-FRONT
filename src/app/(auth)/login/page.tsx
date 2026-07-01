'use client';

import { LoginForm } from '@/src/components/forms/LoginForm';
import { useAuth } from '@/src/hooks/useAuth.hooks';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
			<div className="min-h-screen flex items-center justify-center bg-[rgb(240,247,229)]">
				{/* Logo */}
								<div className="flex justify-center mb-6">
									<Image
										priority={true}
										src="/name.jpg"
										alt="Logo"
										width={200}
										height={200}
										// className="w-30 h-30 rounded-full"
									/>
								</div>
			</div>
		);
	}

	if (isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<LoginForm />
			</div>
		</div>
	);
}
