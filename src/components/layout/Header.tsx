'use client';

import { APP_NAME } from '@/src/lib/constants';
import { Pill } from 'lucide-react';
import { ROLE_LABELS } from '@/src/lib/constants';
import { useAuthStore } from '@/src/stores/auth.store';

export function Header() {
	const { user } = useAuthStore();

	return (
		<header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between">
			<div className="p-6">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
						<Pill className="w-5 h-5" />
					</div>
					<div>
						<h1 className="text-lg font-bold text-primary leading-tight">{APP_NAME}</h1>
						<p className="text-xs text-slate-500">Gestion pharmaceutique</p>
					</div>
				</div>
			</div>

			{/* User info */}
				{user && (
					<div className="px-6 py-4">
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
