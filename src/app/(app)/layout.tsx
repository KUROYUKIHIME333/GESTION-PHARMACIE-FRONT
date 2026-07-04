'use client';

import SideBar from '@/src/components/layouts/SideBar';
import MainContentHeader from '@/src/components/layouts/MainContentHeader';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* Sidebar */}
			<SideBar />
			{/* Main Content */}
			<div>
				<MainContentHeader />
				{children}
			</div>
		</div>
	);
};

export default AppLayout;
