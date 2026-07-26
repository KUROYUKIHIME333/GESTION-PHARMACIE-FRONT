import { usePathname, useRouter } from 'next/navigation';
import { NAV_ITEMS } from '@/src/lib/constants';
import { useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth.hooks';
import { LayoutDashboard, Package, FileText, Users, AlertTriangle, LogOutIcon, Pill, ShoppingCart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ROLE_LABELS } from '@/src/lib/constants';
import { Button } from '../ui/button';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	LayoutDashboard,
	Pill,
	Package,
	Users,
	FileText,
	ShoppingCart,
	AlertTriangle,
};

interface SideBarProps {
	mobileOpen: boolean;
	onToggleMobile: () => void;
	onCloseMobile: () => void;
}

interface SidebarContentProps {
	pathname: string;
	user: ReturnType<typeof useAuth>['user'];
	onLogout: () => void;
	onNavClick: () => void;
	showCloseButton?: boolean;
}

const SidebarContent = ({ pathname, user, onLogout, onNavClick, showCloseButton = false }: SidebarContentProps) => {
	return (
		<>
			{/* logo */}
			<div className="h-1/8 max-h-1/8 p-3 flex items-center justify-between">
				<Image priority={true} src="/name.jpg" alt="Logo" width={150} height={100} />
				{showCloseButton && (
					<button onClick={onNavClick} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Fermer le menu">
						<X size={20} />
					</button>
				)}
			</div>

			{/* nav menu */}
			<nav className="h-5/8 max-h-5/8 flex flex-col overflow-y-auto no-scrollbar">
				{NAV_ITEMS.map((item) => {
					const Icon = iconMap[item.icon] || LayoutDashboard;
					const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={onNavClick}
							className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
								isActive ? 'bg-[#eff7e4] text-[#4B866B] font-bold' : 'text-slate-600 hover:bg-slate-50'
							}`}
						>
							<Icon className="w-4 h-4 flex-shrink-0" />
							<span className="text-sm">{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* alert and options */}
			<div className="h-2/8 max-h-2/8 py-6 border-t border-[#C1C7CB]">
				{user && (
					<div className="p-3">
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
								{user.profilePicture ? (
									<Image priority={true} src={user.profilePicture} alt="profile picture" width={100} height={100} className="w-full h-full rounded-full object-cover" />
								) : (
									<span className="text-sm font-semibold text-secondary">
										{user.firstName[0]}
										{user.lastName[0]}
									</span>
								)}
							</div>
							<div className="min-w-0">
								<p className="text-xs font-medium text-slate-900 truncate">
									{user.firstName} {user.lastName}
								</p>
								<p className="text-xs text-slate-500">{ROLE_LABELS[user.role] || user.role}</p>
							</div>
						</div>
					</div>
				)}
				<Button onClick={onLogout} className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-100 w-full justify-start">
					<LogOutIcon size={20} />
					<span className="text-sm">Déconnexion</span>
				</Button>
			</div>
		</>
	);
};

const SideBar = ({ mobileOpen, onToggleMobile, onCloseMobile }: SideBarProps) => {
	const { user, logout } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	const handleLogoutEffects = async () => {
		const result = await logout();
		if (result.success) {
			window.history.replaceState(null, '', '/login');
			router.replace('/login');
		} else {
			console.error('Erreur déconnexion:', result.error);
			// On déconnecte quand même côté client
			window.history.replaceState(null, '', '/login');
			router.replace('/login');
		}
	};

	// Empecher le scroll du body quand le menu mobile est ouvert
	useEffect(() => {
		if (mobileOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [mobileOpen]);

	useEffect(() => {
		console.log(user);
	}, [user]);

	return (
		<>
			{/*  BOUTON HAMBURGER */}
			<button onClick={onToggleMobile} className="lg:hidden fixed top-3 left-4 z-50 p-3 transition-all duration-200 cursor-pointer" aria-label="Ouvrir le menu">
				<Menu size={20} className="text-slate-700 hover:w-6 hover:h-6 dark-official-green-hover" />
			</button>

			{/*  SIDEBAR DESKTOP */}
			<div className="hidden lg:flex h-screen w-1/5 sticky top-0 flex-col bg-[#eff3f5] px-4 border-r border-[#C1C7CB]">
				<SidebarContent pathname={pathname} user={user} onLogout={handleLogoutEffects} onNavClick={() => {}} />
			</div>

			{/*  SIDEBAR MOBILE / TABLETTE — Drawer glissant avec overlay */}
			{/* Overlay glass */}
			<div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
				<div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onCloseMobile} />
			</div>

			{/* Drawer */}
			<div
				className={`lg:hidden fixed top-0 left-0 z-50 h-screen w-72 flex flex-col bg-[#eff3f5]/95 backdrop-blur-xl border-r border-[#C1C7CB]/60 shadow-2xl transition-transform duration-300 ease-out ${
					mobileOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<SidebarContent pathname={pathname} user={user} onLogout={handleLogoutEffects} onNavClick={onCloseMobile} showCloseButton={true} />
			</div>
		</>
	);
};

export default SideBar;
