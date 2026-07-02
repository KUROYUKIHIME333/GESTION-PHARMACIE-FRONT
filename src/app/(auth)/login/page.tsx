'use client';
import Image from 'next/image';
import LoginForm from '@/src/components/forms/LoginForm';

export default function LoginPage() {
	return (
		<div>
			<div className='w-1/5'>
				<Image priority={true} src="/name.jpg" alt="Logo" width={100} height={100} className="w-full" />
				<p></p>
			</div>

			<div>
				<LoginForm />
			</div>

			<div></div>

			<div></div>
		</div>
	);
}
