'use client';

import SideBar from '@/src/components/layouts/SideBar';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* Sidebar */}
			<SideBar />
			{/* Main Content */}
			{children}
		</div>
	);
};

export default AppLayout;
