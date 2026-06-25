'use client';

import React from 'react';
import { useAuth } from '../../hooks/use-auth.hooks';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/layout/sidebar';
import { Header } from '../../components/layout/header';
import { Loader2 } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	React.useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push('/login');
		}
	}, [isLoading, isAuthenticated, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background flex">
			<Sidebar />
			<div className="flex-1 flex flex-col min-w-0">
				<Header />
				<main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
					<div className="max-w-7xl mx-auto">{children}</div>
				</main>
			</div>
		</div>
	);
}
