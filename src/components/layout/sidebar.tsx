'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/use-auth.hooks';
import { NAV_ITEMS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { LayoutDashboard, Pill, Package, Users, FileText, HandHeart, Bell, Shield, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import { Search, Command } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { UserRole } from '@/src/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	LayoutDashboard,
	Pill,
	Package,
	Users,
	FileText,
	HandHeart,
	Bell,
	Shield,
};

export function Sidebar() {
	const { user, logout } = useAuth();
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	const userRole = user?.role;
	const userName = user ? `${user.firstName} ${user.lastName}` : '';
	const userInitials = user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : '';
	const test = NAV_ITEMS[0].roles;

	const filteredNavItems = NAV_ITEMS.filter((item) => (userRole ? (item.roles as readonly UserRole[]).includes(userRole) : false));

	interface SidebarUserDisplay {
		userDisplay?: boolean;
	}

	const NavContent = ({ userDisplay = true }: SidebarUserDisplay) => (
		<div className="flex flex-col h-full">
			<div className="p-6 pb-4">
					<div className='flex items-center'>
						<Search className="h-4 w-4 text-muted-foreground" />
						<Input placeholder="Rechercher... (Ctrl+K)" className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1" readOnly />
					</div>
				
			</div>

			<nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
				{filteredNavItems.map((item) => {
					const Icon = iconMap[item.icon] || LayoutDashboard;
					const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => setMobileOpen(false)}
							className={cn(
								'flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium transition-colors',
								isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
							)}
						>
							<Icon className={cn('h-4.5 w-4.5 shrink-0', isActive && 'text-primary')} />
							<span className="truncate">{item.label}</span>
							{isActive && <ChevronRight className="h-4 w-4 ml-auto shrink-0 opacity-50" />}
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t  space-y-3">
				{userDisplay && (
					<div className="flex items-center gap-3 px-3 py-2">
						<div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-small font-semibold">{userInitials}</div>
						<div className="min-w-0">
							<p className="text-small font-medium truncate">{userName}</p>
							<p className="text-small text-muted-foreground truncate">{userRole}</p>
						</div>
					</div>
				)}

				<Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start gap-2 text-muted-foreground hover:text-error">
					<LogOut className="h-4 w-4" />
					Déconnexion
				</Button>
			</div>
		</div>
	);

	return (
		<>
			{/* Mobile: Header fixe */}
			<div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 glass border-b  flex items-center px-4">
				<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
					<SheetTrigger
						render={
							<Button variant="ghost" size="icon" className="mr-3">
								<Menu className="h-5 w-5" />
							</Button>
						}
					/>
					{/* w-fit permet d'adapter la largeur au contenu uniquement */}
					<SheetContent side="left" className="w-fit min-w-[280px] p-0 bg-surface/95 backdrop-blur-md">
						<NavContent />
					</SheetContent>
				</Sheet>
			</div>

			{/* Desktop: Sidebar "à côté" du contenu */}
			<aside className="hidden lg:flex w-72 flex-col bg-surface border-r  h-screen sticky top-0 shrink-0 full-height">
				<NavContent userDisplay={false} />
			</aside>

			{/* Spacer mobile uniquement */}
			<div className="lg:hidden h-16" />
		</>
	);
}
