'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/src/lib/constants';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { LayoutDashboard, Package, FileText, Users, BarChart3, Settings, HelpCircle, LogOut, Bell, Search, Focus, Plus, TrendingUp, AlertTriangle, MoreVertical, CheckCircle2 } from 'lucide-react';

import Image from 'next/image';


export default function SideBar() {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	const toggleMobile = () => setMobileOpen(!mobileOpen);

	return (
		<div className='h-screen w-1/5 bg-red-500'>
			{/* logo */}
			<Image priority={true} src="/jnapps-tracker/jnappsTrackerLogo.svg" alt="Logo" width={100} height={100} className="w-30 h-30 rounded-full" />

			{/* nav menu */}
			<nav className="flex-1 space-y-2">
				{[
					{ icon: LayoutDashboard, label: 'Dashboard' },
					{ icon: Package, label: 'Inventory' },
					{ icon: FileText, label: 'Prescriptions' },
					{ icon: Users, label: 'Patients' },
					{ icon: BarChart3, label: 'Analytics' },
					{ icon: Settings, label: 'Settings' },
				].map((item, i) => (
					<a key={i} href="#" className={`flex items-center gap-3 p-3 rounded-lg ${i === 0 ? 'bg-slate-100 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
						<item.icon size={20} />
						<span className="text-sm">{item.label}</span>
					</a>
				))}
			</nav>

			{/* alert and options */}
			<div></div>
		</div>
	);
}
