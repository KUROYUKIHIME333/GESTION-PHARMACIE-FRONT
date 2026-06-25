import { LoginForm } from '../../../components/auth/login-form';

export const metadata = {
	title: 'Connexion — Pharmacie Hospitalière',
};

export default function LoginPage() {
	return (
		<div className="space-y-8">
			<div className="text-center space-y-2">
				<h1 className="text-h3 text-primary font-bold">Pharmacie Hospitalière</h1>
				<p className="text-small text-muted-foreground">Connectez-vous pour accéder au système</p>
			</div>
			<LoginForm />
		</div>
	);
}
