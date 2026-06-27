'use client';

import { usePathname } from 'next/navigation';
import { APP_NAME } from '@/src/lib/constants';

export function Header() {
	const pathname = usePathname();

	const getPageTitle = () => {
		switch (pathname) {
			case '/dashboard':
				return 'Tableau de bord';
			case '/drugs':
				return 'Médicaments';
			case '/stock':
				return 'Stock';
			case '/patients':
				return 'Patients';
			case '/prescriptions':
				return 'Ordonnances';
			case '/dispensations':
				return 'Dispensations';
			case '/alerts':
				return 'Alertes';
			default:
				return APP_NAME;
		}
	};

	return (
		<header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
			<div className="px-8 py-4">
				<h2 className="text-xl font-semibold text-slate-900">{getPageTitle()}</h2>
			</div>
		</header>
	);
}
