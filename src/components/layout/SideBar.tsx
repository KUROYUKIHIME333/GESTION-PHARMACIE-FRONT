'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/src/lib/constants';
import { cn } from '@/src/lib/utils';
import { LayoutDashboard, Pill, Package, Users, FileText, ShoppingCart, AlertTriangle, LogOut, Menu, X, Search, Command } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '@/src/components/ui/button';
import { HOVER_COLOR } from '@/src/lib/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	LayoutDashboard,
	Pill,
	Package,
	Users,
	FileText,
	ShoppingCart,
	AlertTriangle,
};

interface SidebarProps {
	onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	const toggleMobile = () => setMobileOpen(!mobileOpen);

	const navContent = (
		<div className="flex flex-col h-fit">
			{/* Sidebar Search */}
			<div className="p-6 pb-4">
				<div className="flex items-center">
					<Search className="h-4 w-4 text-muted-foreground" />
					<Input placeholder="Rechercher... (Ctrl+K)" className="pl-10 h-10 bg-muted/50 border-0 focus-visible:ring-1" readOnly />
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
				{NAV_ITEMS.map((item) => {
					const Icon = iconMap[item.icon] || LayoutDashboard;
					const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => setMobileOpen(false)}
							className={cn(
								'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
								isActive ? `bg-primary text-[${HOVER_COLOR}]` : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
							)}
						>
							<Icon className={cn('w-4 h-4', isActive ? `text-[${HOVER_COLOR}]` : 'text-slate-400')} />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Footer */}
			<div className="p-4 border-t border-slate-200">
				<Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50" onClick={onLogout}>
					<LogOut className="w-4 h-4" />
					<span className="text-sm font-medium">Déconnexion</span>
				</Button>
			</div>
		</div>
	);

	return (
		<>
			{/* Mobile toggle */}
			<button onClick={toggleMobile} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200">
				{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
			</button>

			{/* Mobile overlay */}
			{mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />}

			{/* Desktop sidebar */}
			<aside className="hidden h-[50vh] lg:flex w-72 flex-col bg-surface border-r sticky top-0 shrink-0 full-height">{navContent}</aside>

			{/* Mobile sidebar */}
			<aside
				className={cn(
					'lg:hidden fixed inset-y-0 left-0 w-full bg-white border-r border-slate-200 z-50 transform transition-transform duration-200',
					mobileOpen ? 'translate-x-0' : '-translate-x-full',
				)}
			>
				{navContent}
			</aside>
		</>
	);
}
