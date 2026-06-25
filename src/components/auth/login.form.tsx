'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/use-auth.hooks';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

const loginSchema = z.object({
	email: z.string().min(1, "L'email est requis").email('Email invalide'),
	password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
	const { login, isLoading: authLoading } = useAuth();
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		setError(null);
		try {
			await login(data);
		} catch (err: any) {
			setError(err?.message || 'Identifiants invalides');
		}
	};

	const isLoading = isSubmitting || authLoading;

	return (
		<Card className="bento-card">
			<CardContent className="p-6 sm:p-8 space-y-6">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email" className="text-small font-medium">
								Email
							</Label>
							<Input id="email" type="email" placeholder="votre@email.com" autoComplete="email" disabled={isLoading} className="h-11" {...register('email')} />
							{errors.email && (
								<p className="text-small text-error flex items-center gap-1">
									<AlertCircle className="h-3.5 w-3.5" />
									{errors.email.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-small font-medium">
								Mot de passe
							</Label>
							<Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" disabled={isLoading} className="h-11" {...register('password')} />
							{errors.password && (
								<p className="text-small text-error flex items-center gap-1">
									<AlertCircle className="h-3.5 w-3.5" />
									{errors.password.message}
								</p>
							)}
						</div>
					</div>

					{error && (
						<div className="p-3 rounded-lg bg-error/10 border border-error/20 text-small text-error flex items-center gap-2">
							<AlertCircle className="h-4 w-4 shrink-0" />
							{error}
						</div>
					)}

					<Button type="submit" disabled={isLoading} className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Connexion...
							</>
						) : (
							'Se connecter'
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
