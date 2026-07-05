import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Search, Focus, BellRing } from 'lucide-react';

const MainContentHeader = () => {
	return (
		<header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#C1C7CB] px-8 py-4 flex justify-between items-center">
			<div className="flex items-center gap-4">
				{/* <h1 className="text-2xl font-bold">Command Center</h1> */}
				<div className="relative w-96">
					<Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
					<Input
						placeholder="Global Search (⌘K)"
						className="pl-10 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 bg-gray-100 focus-visible:bg-gray-100 focus-visible:border-primary"
					/>
				</div>
			</div>
			<Button variant="outline" className="gap-2">
				<Focus size={16} /> Focus Mode
			</Button>
			<BellRing size={20} className='cursor-pointer'/>
		</header>
	);
};

export default MainContentHeader;
