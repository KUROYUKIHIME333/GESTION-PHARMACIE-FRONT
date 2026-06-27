'use client';
import { Pill } from 'lucide-react';
import { LoginForm } from '../../../components/auth/login.form';
import { Card } from '@/src/components/ui/card';

export default function LoginPage() {
	return (
		<Card className="bento-card">
			{/* <div className="min-h-screen bg-background flex items-center justify-center p-4"> */}
				<div className="w-full max-w-md space-y-8">
					{/* Logo */}
					<div className="text-center space-y-2">
						<div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
							<Pill className="h-6 w-6 text-primary-foreground" />
						</div>
						<h1 className="text-h3 text-primary font-bold">Pharmacie Hospitalière</h1>
						<p className="text-small text-muted-foreground">Connectez-vous pour accéder au système</p>
					</div>
					<LoginForm />
				{/* </div> */}
			</div>
		</Card>
	);
}
