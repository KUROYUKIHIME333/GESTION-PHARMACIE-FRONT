'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Image from 'next/image';
import { api } from '@/src/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeClosed } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { useAuthStore } from '@/src/stores/auth.store';
import { User } from '@/src/types';
import { API_ENDPOINTS } from '@/src/lib/constants';

const loginSchema = z.object({
	email: z.string().email('Adresse email invalide'),
	password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [serverError, setServerError] = useState<string | null>(null);

	const { setLoading: loadingUserInStore, login: loginUserInStore } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true);
		setServerError(null);
		loadingUserInStore(true);

		try {
			const response = await api.post(API_ENDPOINTS.login, data);

			if (response && typeof response === 'object' && 'success' in response) {
				if (response.success && 'data' in response && response.data && typeof response.data === 'object' && 'user' in response.data && response.data.user) {
					loginUserInStore(response.data.user as User);
					router.push('/dashboard');
				} else if (!response.success && 'message' in response && response.message && typeof response.message === 'string') {
					setServerError(response.message);
				} else {
					setServerError('Erreur de connection');
				}
			}
		} catch (err: unknown) {
			setServerError((err as Error).message || 'Une erreur est survenue lors de la connexion.');
		} finally {
			setIsLoading(false);
			loadingUserInStore(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#eff3f5]">
			{/* Header */}
			<header className="mb-8 flex flex-col items-center text-center">
				<div className="relative w-[200px] mb-3 mt-6">
					<Image priority={true} src="/name.jpg" alt="Logo" width={200} height={100} />
				</div>
				<h1 className="text-[18px] text-gray-500 tracking-[0.2em] uppercase">Portail d&apos;accès</h1>
			</header>

			<Card className="w-full max-w-[400px] p-8 lg:border-2 ring-0 border-[#C1C7CB] rounded-none md:shadow-sm lg:shadow-sm bg-[#eff3f5] md:bg-white lg:bg-white">
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
					{/* Email */}
					<div className="space-y-3">
						<Label htmlFor="email">Email Professionnel</Label>
						{errors.email && <span className="block text-[11px] text-red-500 uppercase tracking-wide">{errors.email.message}</span>}
						<Input
							id="email"
							type="email"
							placeholder="name@pharmacy.com"
							{...register('email')}
							className={`py-6 text-gray-800 placeholder:text-gray-400 w-full border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 ${
								errors.email ? 'border-red-500 bg-red-50 focus-visible:bg-red-100' : 'border-gray-300 bg-gray-100 focus-visible:bg-gray-100 focus-visible:border-primary'
							}`}
						/>
					</div>

					{/* Password */}
					<div className="space-y-3">
						<div className="flex justify-between items-end">
							<Label htmlFor="password">Mot de Passe</Label>
							{/* When we'll implement the recovery of password functionnality */}
							{/* <a href="#" className="text-[12px] text-secondary hover:underline">
								Forgot?
							</a> */}
						</div>
						{errors.password && <span className="block text-[11px] text-red-500 uppercase tracking-wide">{errors.password.message}</span>}
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								placeholder="••••••••"
								{...register('password')}
								className={`py-6 text-gray-800 placeholder:text-gray-400 w-full border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 ${errors.password ? 'border-red-500 bg-red-50 focus-visible:bg-red-100' : 'border-gray-300 bg-gray-100 focus-visible:bg-gray-100 focus-visible:border-primary'}`}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 opacity-60 hover:opacity-100 ${errors.password ? 'text-red-500' : ''}`}
							>
								{showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>
					{/* Erreurs dasn la reponse */}
					{serverError && (
						<div className="space-y-3">
							<span className="block text-[11px] text-red-500 uppercase tracking-wide">{serverError}</span>
						</div>
					)}

					<Button
						type="submit"
						className={`w-full mt-2 py-6 hover:bg-[#4B866B] bg-[#56AC35] ${isLoading ? 'bg-[#4B866B]' : 'bg-[#56AC35]'} text-white rounded-none transition-all duration-200`}
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
							</span>
						) : (
							'Authorize Access'
						)}
					</Button>
				</form>

				<div className="mt-6 pt-8 border-t border-outline-variant/30 text-center">
					<p className="font-small text-[11px] text-on-surface-variant leading-relaxed">
						Authorized Hospital Staff Only. <br />
						<span className="text-[#4B866B] opacity-50 uppercase tracking-widest">By logging in, you agree to HIPAA data standards.</span>
					</p>
				</div>
			</Card>
		</div>
	);
};

export default LoginPage;
