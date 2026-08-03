import { Button } from '@/src/components/ui/button';
import { Focus, BellRing } from 'lucide-react';

const MainContentHeader = () => {
	return (
		<header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#C1C7CB] px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center gap-3">
			<div className="flex items-center gap-4 flex-1 min-w-0">
				<div className="relative w-full sm:w-96" />
			</div>
			<Button variant="outline" className="gap-2 text-xs sm:text-sm px-2 sm:px-4">
				<Focus size={14} className="sm:hidden" />
				<Focus size={16} className="hidden sm:block" />
				<span className="hidden sm:inline">Focus Mode</span>
			</Button>
			<BellRing size={18} className="cursor-pointer sm:size-5 flex-shrink-0" />
		</header>
	);
};

export default MainContentHeader;