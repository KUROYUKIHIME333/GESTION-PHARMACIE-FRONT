'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import DispensationForm from '@/src/components/forms/DispensationForm';

export default function NewDispensationPage() {
	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex items-center gap-3 px-3 md:px-6 lg:px-8 pt-6">
				<Link href="/dispensations">
					<Button variant="ghost" size="sm" className="text-slate-500 hover:text-[rgb(25,119,119)] hover:bg-[#eff7e4] rounded-[2px]">
						<ArrowLeft size={18} />
					</Button>
				</Link>
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-slate-900">Nouvelle dispensation</h1>
					<p className="text-sm text-slate-500">Dispenser des médicaments à un patient (FEFO automatique)</p>
				</div>
			</div>

			<DispensationForm />
		</div>
	);
}
