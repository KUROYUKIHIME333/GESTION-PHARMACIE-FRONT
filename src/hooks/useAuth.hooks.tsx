import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/stores/auth.store';
import { api } from '@/src/lib/api';

export function useAuth() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore();

	// Vérifier l'authentification au chargement
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await api.get('/api/auth/me');
				if (response.success && response.data?.user) {
					setUser(response.data.user);
				} else {
					setUser(null);
				}
			} catch (error: any) {
				// Si 401 ou autre erreur, on considère que l'utilisateur n'est pas connecté
				setUser(null);
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

			if (response.success && response.data?.user) {
				setUser(response.data.user);
				return { success: true };
			}

			if (!response.success && response.message) {
				return { success: false, error: response.message };
			}

			return { success: false, error: 'Réponse invalide du serveur' };
		} catch (error: any) {
			const message = error.message || 'Erreur de connexion';
			return { success: false, error: message };
		}
	};

	const handleLogout = async () => {
		try {
			// Appel API pour invalider le cookie côté serveur
			await api.post('/api/auth/logout', {});
		} catch (error) {
			// Ignorer les erreurs lors de la déconnexion
		} finally {
			logout();
			router.push('/login');
		}
	};

	const requireAuth = () => {
		if (!isLoading && !isAuthenticated) {
			router.push('/login');
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
