import { Loader2 } from 'lucide-react';

const Spinner = () => {
	return (
		<div className="w-full h-full p-8 space-y-8 flex flex-col justify-center items-center">
			<Loader2 className="bg-[#56AC35] animate-spin h-1/8 w-1/8" />
			{/* <svg className="animate-spin h-1/8 w-1/8" viewBox="0 0 24 24">
			
				<circle className="opacity-25" cx="12" cy="12" r="10" stroke="#4B866B" strokeWidth="4" fill="none" />
				<path className="opacity-75" fill="#56AC35" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
			</svg> */}
		</div>
	);
};

export default Spinner;
