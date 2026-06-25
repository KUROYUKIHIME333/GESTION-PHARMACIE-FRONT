'use client';
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../lib/constants';
import { User, LoginCredentials, LoginResponse, AuthState } from '../types';

interface AuthContextType extends AuthState {
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => void;
	refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const isAuthenticated = !!user && !!accessToken;

	useEffect(() => {
		const initAuth = async () => {
			const storedToken = localStorage.getItem(TOKEN_KEY);
			const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);

			if (storedToken && storedRefresh) {
				setAccessToken(storedToken);
				try {
					const userData = await api.get<User>('/api/auth/me');
					setUser(userData);
				} catch {
					localStorage.removeItem(TOKEN_KEY);
					localStorage.removeItem(REFRESH_TOKEN_KEY);
				}
			}

			setIsLoading(false);
		};

		initAuth();
	}, []);

	const login = useCallback(
		async (credentials: LoginCredentials) => {
			setIsLoading(true);
			try {
				const response = await api.post<LoginResponse>('/api/auth/login', credentials);
				const { accessToken: token, refreshToken, user: userData } = response;

				localStorage.setItem(TOKEN_KEY, token);
				localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
				api.setTokens(token, refreshToken);

				setAccessToken(token);
				setUser(userData);

				router.push('/dashboard');
			} finally {
				setIsLoading(false);
			}
		},
		[router],
	);

	const logout = useCallback(() => {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
		api.clearTokens();
		setUser(null);
		setAccessToken(null);
		router.push('/login');
	}, [router]);

	const refreshUser = useCallback(async () => {
		try {
			const userData = await api.get<User>('/api/auth/me');
			setUser(userData);
		} catch {
			logout();
		}
	}, [logout]);

	const value = useMemo(
		() => ({
			user,
			accessToken,
			isLoading,
			isAuthenticated,
			login,
			logout,
			refreshUser,
		}),
		[user, accessToken, isLoading, isAuthenticated, login, logout, refreshUser],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
