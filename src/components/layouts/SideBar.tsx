'use client';

import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/src/lib/constants';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
	LayoutDashboard,
	Package,
	FileText,
	Users,
	BarChart3,
	Settings,
	HelpCircle,
	LogOut,
	Bell,
	Search,
	Focus,
	Plus,
	TrendingUp,
	AlertTriangle,
	MoreVertical,
	CheckCircle2,
	HelpCircleIcon,
	LogOutIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { NAV_ITEMS } from '@/src/lib/constants';

export default function SideBar() {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	const toggleMobile = () => setMobileOpen(!mobileOpen);

	return (
		<div className="h-screen w-1/5 sticky top-0 flex flex-col bg-[#eff3f5] px-4">
			{/* logo */}
			<div className="h-1/8 max-h-1/8 p-3">
				<Image priority={true} src="/name.jpg" alt="Logo" width={150} height={100} />
			</div>

			{/* nav menu */}
			<nav className="h-5/8 max-h-5/8 flex flex-col overflow-y-auto no-scrollbar">
				{NAV_ITEMS.map((item, i) => (
					<Link key={i} href="#" className={`flex items-center gap-3 p-3 rounded-lg ${i === 0 ? 'bg-[#eff7e4] text-[#4B866B] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
						<item.icon size={20} />
						<span className="text-sm">{item.label}</span>
					</Link>
				))}
			</nav>

			{/* alert and options */}
			<div className="h-2/8 max-h-2/8 py-6 border-t">
				<Link href="#" className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-slate-50">
					<LogOutIcon size={20} />
					<span className="text-sm ">Déconnexion</span>
				</Link>
			</div>
		</div>
	);
}
