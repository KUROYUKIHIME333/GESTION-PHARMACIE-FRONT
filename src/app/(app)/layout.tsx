'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { api } from '../../lib/api';
import { Sidebar } from '../../components/layout/sidebar';
import { Header } from '../../components/layout/header';
import { Loader2 } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { user, isLoading, isAuthenticated, setUser, setLoading, logout } = useAuthStore();

	// Vérifie la session au chargement
	useEffect(() => {
		if (isAuthenticated) return; // Déjà authentifié

		let cancelled = false;

		api.get<{ user: any }>('/api/auth/me')
			.then((data: any) => {
				if (!cancelled) setUser(data.user);
			})
			.catch(() => {
				if (!cancelled) {
					setLoading(false);
					router.push('/login');
				}
			});

		return () => {
			cancelled = true;
		};
	}, [isAuthenticated, setUser, setLoading, router]);

	// Déconnexion handler
	const handleLogout = async () => {
		try {
			await api.post('/api/auth/logout', {});
		} catch {
			// Ignore
		}
		logout();
		router.push('/login');
	};

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
		<div className="flex-1 flex flex-col min-w-0">
			<Header />
			<div className="min-h-screen bg-background flex">
				<Sidebar onLogout={handleLogout} />
				<main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
					<div className="max-w-7xl mx-auto">{children}</div>
				</main>
			</div>
		</div>
	);
}
