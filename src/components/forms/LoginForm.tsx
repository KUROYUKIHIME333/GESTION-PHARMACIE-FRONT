'use client';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '../ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

const loginSchema = z.object({
	email: z.string().email('Email invalide'),
	password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type InputType = 'password' | 'number' | 'text';

export default function LoginForm() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordFieldType, setPasswordFieldType] = useState<InputType>('password');

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	function togglePassword() {
		setPasswordFieldType(passwordFieldType === 'password' ? 'text' : 'password');
	}

	return (
		<Card className="w-full max-w-md shadow-lg border-slate-200 bg-white p-8">
			{/* <form>
				<div>
					<div className="space-y-2">
						<Label htmlFor="email" className="font-small text-small text-on-surface-variant flex justify-between items-center">
							Email
						</Label>
						<Input id="email" type="email" placeholder="votre@email.com" className="h-11 border-slate-300 focus:border-primary focus:ring-primary" {...register('email')} />
						{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password" className="font-small text-small text-on-surface-variant flex justify-between items-center">
							Mot de passe
						</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							className="w-full h-[48px] px-sm bg-surface-container-low border border-transparent border-b-outline-variant text-on-surface font-body text-body input-minimal transition-all"
							{...register('password')}
						/>
						{errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
					</div>
				</div>
			</form> */}

			<form className="flex flex-col space-y-md" id="loginForm">
				{/* <!-- Input Group: Email --> */}
				<div className="space-y-xs">
					<label className="font-small text-small text-on-surface-variant flex justify-between items-center" htmlFor="email">
						Email Address
						<span className="text-[10px] text-outline opacity-50 font-mono uppercase tracking-tighter">Required</span>
					</label>
					<input
						className="w-full h-[48px] px-sm bg-surface-container-low border border-transparent border-b-outline-variant text-on-surface font-body text-body input-minimal transition-all"
						id="email"
						name="email"
						placeholder="pharmacist@hospital.org"
						required={true}
						type="email"
					/>
				</div>
				{/* <!-- Input Group: Password --> */}
				<div className="space-y-xs">
					<label className="font-small text-small text-on-surface-variant flex justify-between items-center" htmlFor="password">
						Password
						<a className="text-secondary hover:underline transition-all" href="#">
							Forgot?
						</a>
					</label>
					<div className="relative">
						<input
							className="w-full h-[48px] px-sm bg-surface-container-low border border-transparent border-b-outline-variant text-on-surface font-body text-body input-minimal transition-all"
							id="password"
							name="password"
							placeholder="••••••••"
							required={true}
							type={passwordFieldType}
						/>
						<button
							className="absolute right-xs top-1/2 -translate-y-1/2 p-xs text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity"
							onClick={() => togglePassword()}
							type="button"
						>
							<span className="material-symbols-outlined text-[20px]" id="eye-icon">
								visibility
							</span>
						</button>
					</div>
				</div>
				{/* <!-- Discreet Error Messaging --> */}
				<div className="hidden animate-in fade-in duration-300" id="errorArea">
					<div className="bg-error-container/20 border border-error/10 p-sm flex items-start gap-xs">
						<span className="material-symbols-outlined text-error text-[18px]">error</span>
						<p className="font-small text-small text-error leading-tight" id="errorMessage">
							Invalid credentials. Please verify your organizational ID.
						</p>
					</div>
				</div>
				{/* <!-- Primary Action --> */}
				<button
					className="w-full h-[48px] bg-primary text-on-primary font-body text-body font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-xs"
					type="submit"
				>
					Authorize Access
					<span className="material-symbols-outlined text-[18px]">lock_open</span>
				</button>
			</form>
		</Card>
	);
}
