'use client';
import { Input } from '../ui/input';

export default function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	return (
		<div>
			<form>
				<div>
					<Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
					<Input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>
			</form>
		</div>
	);
}
