'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
import { NAV_ITEMS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { Search, LayoutDashboard, Pill, Package, Users, FileText, HandHeart, Bell, Shield, FileJson, Menu, ChevronRight, LogOut } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	LayoutDashboard,
	Pill,
	Package,
	Users,
	FileText,
	HandHeart,
	Bell,
	Shield,
	FileJson,
};

interface SidebarProps {
	onLogout: () => void;
}

interface NavContentProps {
	userDisplay: boolean;
}

export function Sidebar({ onLogout }: SidebarProps) {
	const user = useAuthStore((s: any) => s.user);
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '';

	const NavContent = ({ userDisplay }: NavContentProps) => (
		<div className="flex flex-col h-full">
			<div className="p-6 pb-4">
				<div className="flex items-center">
					<Search className="h-4 w-4 text-muted-foreground" />
					<Input placeholder="Rechercher... (Ctrl+K)" className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1" readOnly />
				</div>
			</div>

			<nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
				{NAV_ITEMS.map((item: any) => {
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

			<div className="p-4 border-t border-border space-y-3">
				{userDisplay && (
					<div className="flex items-center gap-3 px-3 py-2">
						<div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-small font-semibold">{initials}</div>
						<div className="min-w-0">
							<p className="text-small font-medium truncate">
								{user?.firstName} {user?.lastName}
							</p>
							<p className="text-small text-muted-foreground truncate">{user?.role}</p>
						</div>
					</div>
				)}
				<Button variant="ghost" size="sm" onClick={onLogout} className="w-full justify-start gap-2 text-muted-foreground hover:text-error">
					<LogOut className="h-4 w-4" />
					Déconnexion
				</Button>
			</div>
		</div>
	);

	return (
		<>
			{/* Mobile */}
			<div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-border flex items-center px-4">
				<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
					<SheetTrigger
						render={
							<Button variant="ghost" size="icon" className="mr-3">
								<Menu className="h-5 w-5" />
							</Button>
						}
					/>
					<SheetContent side="left" className="p-0 bg-surface">
						<NavContent userDisplay={true} />
					</SheetContent>
				</Sheet>
				<div className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
						<Pill className="h-4 w-4 text-primary-foreground" />
					</div>
					<span className="text-small font-semibold text-primary">Pharmacie</span>
				</div>
			</div>

			{/* Desktop */}
			<aside className="hidden max-h-[calc(100vh-4rem)] lg:flex w-72 flex-col bg-surface border-r  h-screen sticky top-0 shrink-0 full-height">
				<NavContent userDisplay={false} />
			</aside>

			<div className="lg:hidden h-16" />
		</>
	);
}
