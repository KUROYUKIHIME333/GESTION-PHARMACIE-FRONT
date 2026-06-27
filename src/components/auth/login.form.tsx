'use client';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { CardContent } from '../../components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../lib/constants';

const loginSchema = z.object({
	email: z.string().min(1, "L'email est requis").email('Email invalide'),
	password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
	const router = useRouter();
	const setUser = useAuthStore((s: any) => s.setUser);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		setError(null);
		setIsLoading(true);

		try {
			const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
				method: 'POST',
				credentials: "include",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				// On lance une erreur pour qu'elle soit attrapée par le catch
				throw new Error(result.message || 'Identifiants invalides');
			}

			// Si succès, résultat contient { data: { user, token } } selon votre backend
			if (result.success && result.data?.user) {
				setUser(result.data.user);
				router.push('/dashboard');
				router.refresh();
			} else if (!result.success && result.message) {
				setError(result.message);
			} else {
				throw new Error('Structure de réponse invalide');
			}
		} catch (err: any) {
			setError(err.message || 'Une erreur est survenue');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<CardContent className="p-6 sm:p-8">
			{/* Div au lieu de form pour éviter les comportements par défaut */}
			<div
				className="space-y-6"
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleSubmit(onSubmit)();
				}}
			>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" placeholder="votre@email.com" disabled={isLoading} {...register('email')} />
						{errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Mot de passe</Label>
						<Input id="password" type="password" placeholder="••••••••" disabled={isLoading} {...register('password')} />
						{errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
					</div>
				</div>

				{error && (
					<div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
						<AlertCircle className="h-4 w-4" />
						{error}
					</div>
				)}

				<Button type="button" onClick={handleSubmit(onSubmit)} disabled={isLoading} className="w-full">
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...
						</>
					) : (
						'Se connecter'
					)}
				</Button>
			</div>
		</CardContent>
	);
}
