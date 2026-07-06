import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/src/lib/constants';
import { useState, useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth.hooks';
import { LayoutDashboard, Package, FileText, Users, AlertTriangle, LogOutIcon, Pill, ShoppingCart } from 'lucide-react';
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

export default function SideBar() {
	const { user, logout } = useAuth();
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	const toggleMobile = () => setMobileOpen(!mobileOpen);

	useEffect(() => {
		console.log(user);
	}, [user]);

	return (
		<div className="h-screen w-1/5 sticky top-0 flex flex-col bg-[#eff3f5] px-4 border-r border-[#C1C7CB]">
			{/* logo */}
			<div className="h-1/8 max-h-1/8 p-3">
				<Image priority={true} src="/name.jpg" alt="Logo" width={150} height={100} />
			</div>

			{/* nav menu */}
			<nav className="h-5/8 max-h-5/8 flex flex-col overflow-y-auto no-scrollbar">
				{/* {NAV_ITEMS.map((item, i) => (
					<Link key={i} href="#" className={`flex items-center gap-3 p-3 rounded-lg ${i === 0 ? 'bg-[#eff7e4] text-[#4B866B] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
						<item.icon size={20} />
						<span className="text-sm">{item.label}</span>
					</Link>
				))} */}

				{NAV_ITEMS.map((item) => {
					const Icon = iconMap[item.icon] || LayoutDashboard;
					const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => setMobileOpen(false)}
							className={`flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-[#eff7e4] text-[#4B866B] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
						>
							<Icon className="w-4 h-4" />
							<span className="text-sm">{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* alert and options */}
			<div className="h-2/8 max-h-2/8 py-6 border-t border-[#C1C7CB]">
				{user && (
					<div className="p-3 ">
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
								{user.profilePicture ? (
									<Image priority={true} src={user.profilePicture} alt="profile picture" width={100} height={100} />
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
				<Button onClick={logout} className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-100">
					<LogOutIcon size={20} />
					<span className="text-sm ">Déconnexion</span>
				</Button>
			</div>
		</div>
	);
}
