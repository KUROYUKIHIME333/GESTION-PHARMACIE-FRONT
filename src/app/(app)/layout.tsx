'use client';

import { useState } from 'react';
import SideBar from '@/src/components/layouts/SideBar';
import MainContentHeader from '@/src/components/layouts/MainContentHeader';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
	const [mobileOpen, setMobileOpen] = useState(false);

	const toggleMobile = () => setMobileOpen((prev) => !prev);
	const closeMobile = () => setMobileOpen(false);

	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* Sidebar */}
			<SideBar mobileOpen={mobileOpen} onToggleMobile={toggleMobile} onCloseMobile={closeMobile} />

			{/* Main Content */}
			<div className="w-full lg:w-4/5">
				<MainContentHeader />
				{children}
			</div>
		</div>
	);
};

export default AppLayout;
