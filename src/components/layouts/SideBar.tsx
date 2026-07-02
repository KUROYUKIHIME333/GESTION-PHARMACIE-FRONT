'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/src/lib/constants';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { LayoutDashboard, Pill, Package, Users, FileText, ShoppingCart, AlertTriangle, LogOut, Menu, X, Search, Command } from 'lucide-react';
import Image from 'next/image';

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
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	const toggleMobile = () => setMobileOpen(!mobileOpen);

	return (
		<div>
			{/* logo */}
			<div>
				<Image priority={true} src="/jnapps-tracker/jnappsTrackerLogo.svg" alt="Logo" width={100} height={100} className="w-full h-full rounded-full" />
			</div>

			{/* nav menu */}
			<div></div>

			{/* alert and options */}
			<div></div>
		</div>
	);
}
