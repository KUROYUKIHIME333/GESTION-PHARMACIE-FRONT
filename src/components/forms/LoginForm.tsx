'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/src/hooks/useAuth.hooks';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';

const loginSchema = z.object({
	email: z.string().email('Email invalide'),
	password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
	const { login } = useAuth();
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
			const result = await login(data.email, data.password);

			if (!result.success) {
				setError(result.error || 'Erreur de connexion');
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			setError("Une erreur inattendue s'est produite");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md shadow-lg border-slate-200 bg-[rgb(241,242,247)]">
			<CardHeader className="space-y-1 pb-6">
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
				<CardTitle className="text-2xl font-bold text-center text-primary">Connexion</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Erreur globale */}
					{error && (
						<div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
							<AlertCircle className="w-4 h-4 flex-shrink-0" />
							<span>{error}</span>
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="email" className="text-sm font-medium text-slate-700">
							Email
						</Label>
						<Input id="email" type="email" placeholder="votre@email.com" className="h-11 border-slate-300 focus:border-primary focus:ring-primary" {...register('email')} />
						{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password" className="text-sm font-medium text-slate-700">
							Mot de passe
						</Label>
						<Input id="password" type="password" placeholder="••••••••" className="h-11 border-slate-300 focus:border-primary focus:ring-primary" {...register('password')} />
						{errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
					</div>

					<Button
						type="submit"
						className="w-full h-11 bg-[rgb(85,173,53)] hover:bg-[rgb(126,197,43)] cursor-pointer font-bold hover:font-medium text-[rgb(240,247,229)]"
						disabled={isLoading}
					>
						{isLoading ? (
							<span className="flex items-center gap-2">
								<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Connexion en cours...
							</span>
						) : (
							'Se connecter'
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
