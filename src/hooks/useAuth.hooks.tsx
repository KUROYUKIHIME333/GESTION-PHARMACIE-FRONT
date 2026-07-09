/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/stores/auth.store';
import { api } from '@/src/lib/api';
import { User } from '../types';

export function useAuth() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore();

	// Vérifier l'authentification au chargement
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await api.get('/api/auth/me');
				if (
					response &&
					typeof response === 'object' &&
					'success' in response &&
					response.success &&
					'data' in response &&
					response.data &&
					typeof response.data === 'object' &&
					'user' in response.data
				) {
					setUser(response.data.user as User);
				} else {
					setUser(null);
					// Pas de redirect ici — le middleware ou le composant gère ça
				}
			} catch (error: unknown) {
				setUser(null);
				// Pas de redirect ici non plus
			} finally {
				setLoading(false);
			}
		};

		if (!isAuthenticated && isLoading) {
			checkAuth();
		}
	}, [isAuthenticated, isLoading, setUser, setLoading]);

	const handleLogin = async (email: string, password: string) => {
		try {
			const response = await api.post('/api/auth/login', { email, password });

			if (
				response &&
				typeof response === 'object' &&
				'success' in response &&
				response.success &&
				'data' in response &&
				response.data &&
				typeof response.data === 'object' &&
				'user' in response.data &&
				response.data?.user
			) {
				setUser(response.data.user as User);
				return { success: true };
			}

			if (response && typeof response === 'object' && 'success' in response && !response.success && 'message' in response && response.message) {
				return { success: false, error: response.message as string };
			}

			return { success: false, error: 'Réponse invalide du serveur' };
		} catch (error: unknown) {
			const message = 'Erreur de connexion';
			return { success: false, error: message };
		}
	};

	const handleLogout = async () => {
		try {
			const disconnection = await api.post('/api/auth/logout', {});

			// On appelle toujours logout côté client, même si l'API échoue
			logout();

			// Redirection après déconnexion
			router.replace('/login');

			// Vider l'historique pour empêcher le retour arrière
			window.history.replaceState(null, '', '/login');

			return { success: true };
		} catch (error) {
			// Même en cas d'erreur API, on déconnecte côté client
			logout();
			router.replace('/login');
			window.history.replaceState(null, '', '/login');

			const message = 'Erreur de déconnexion';
			return { success: false, error: message };
		}
	};

	const requireAuth = () => {
		if (!isLoading && !isAuthenticated) {
			router.replace('/login');
		}
	};

	return {
		user,
		isAuthenticated,
		isLoading,
		login: handleLogin,
		logout: handleLogout,
		requireAuth,
	};
}
