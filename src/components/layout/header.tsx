'use client';

import React from 'react';
import { useAuth } from '../../hooks/use-auth.hooks';
import { Search, Command } from 'lucide-react';
import { Input } from '../../components/ui/input';

export function Header() {
	const { user } = useAuth();

	return (
		<header className="h-16 glass border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
			<div className="flex items-center gap-4 flex-1">
				<div className="relative max-w-md w-full hidden sm:block">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input placeholder="Rechercher... (Ctrl+K)" className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1" readOnly />
					<kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
						<Command className="h-3 w-3" />K
					</kbd>
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
