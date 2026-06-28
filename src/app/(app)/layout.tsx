'use client';

import { useAuth } from '@/src/hooks/useAuth.hooks';
import { Sidebar } from '@/src/components/layout/SideBar';
import { Header } from '@/src/components/layout/Header';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading, logout, requireAuth } = useAuth();
	const router = useRouter();

	useEffect(() => {
		requireAuth();
	}, [requireAuth]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F6F8FA]">
				<div className="flex flex-col items-center gap-4">
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					<p className="text-sm text-slate-500">Chargement...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="flex-1 flex flex-col min-w-0 [#F6F8FA] overflow-hidden">
			<Header />
			<div className="bg-background flex overflow-hidden h-screen">
				<Sidebar onLogout={logout} />

				<main className="p-6 lg:p-8 overflow-y-auto no-scrollbar">{children}</main>
			</div>
		</div>
	);
}
