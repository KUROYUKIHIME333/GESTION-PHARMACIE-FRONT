'use client';

import { APP_NAME } from '@/src/lib/constants';
import { Pill } from 'lucide-react';
import { ROLE_LABELS } from '@/src/lib/constants';
import { useAuthStore } from '@/src/stores/auth.store';
import Image from 'next/image';

export function Header() {
	const { user } = useAuthStore();

	return (
		<header className="sticky top-0 z-20 bg-[rgb(241,242,247)] backdrop-blur-md border-b border-slate-200 flex justify-between">
			{/* Logo */}
			<div className="p-6">
				<Image
					priority={true}
					src="/name.jpg"
					alt="Logo"
					width={200}
					height={200}
					// className="w-30 h-30 rounded-full"
				/>
			</div>

			{/* User info */}
			{user && (
				<div className="px-6 py-4 ">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
							<span className="text-sm font-semibold text-secondary">
								{user.firstName[0]}
								{user.lastName[0]}
							</span>
						</div>
						<div className="min-w-0">
							<p className="text-sm font-medium text-slate-900 truncate">
								{user.firstName} {user.lastName}
							</p>
							<p className="text-xs text-slate-500">{ROLE_LABELS[user.role] || user.role}</p>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
