'use client';

import React from 'react';
import { useAuth } from '../../hooks/use-auth.hooks';
import { Pill } from 'lucide-react';

export function Header() {
	const { user } = useAuth();

	return (
		<header className="h-16 glass border-b  flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
			<div className="flex items-center gap-4 flex-1">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
						<Pill className="h-5 w-5 text-primary-foreground" />
					</div>
					<div>
						<h2 className="text-h4 font-bold text-primary leading-tight">Pharmacie</h2>
						<p className="text-small text-muted-foreground">Hospitalière</p>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="hidden sm:block text-right">
					<p className="text-small font-medium">
						{user?.firstName} {user?.lastName}
					</p>
					<p className="text-small text-muted-foreground">{user?.role}</p>
				</div>
				<div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-small font-semibold">
					{user?.firstName?.charAt(0)}
					{user?.lastName?.charAt(0)}
				</div>
			</div>
		</header>
	);
}
