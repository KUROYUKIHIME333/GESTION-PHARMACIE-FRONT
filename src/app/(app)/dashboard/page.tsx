'use client';

import { useAuthStore } from '../../../store/auth.store';

export default function DashboardPage() {
	const user = useAuthStore((s: any) => s.user);

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-h3 font-bold text-foreground">Dashboard</h1>
				<p className="text-body text-muted-foreground mt-1">
					Bienvenue, {user?.firstName} {user?.lastName}
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
				<div className="bento-card lg:col-span-2 min-h-[200px] flex items-center justify-center">
					<p className="text-muted-foreground text-small">Stock global — En développement (Jour 2)</p>
				</div>
				<div className="bento-card min-h-[200px] flex items-center justify-center">
					<p className="text-muted-foreground text-small">Alertes — En développement (Jour 5)</p>
				</div>
				<div className="bento-card lg:col-span-3 min-h-[160px] flex items-center justify-center">
					<p className="text-muted-foreground text-small">Consommation — En développement (Jour 5)</p>
				</div>
				<div className="bento-card min-h-[120px] flex items-center justify-center">
					<p className="text-muted-foreground text-small">KPI 1</p>
				</div>
				<div className="bento-card min-h-[120px] flex items-center justify-center">
					<p className="text-muted-foreground text-small">KPI 2</p>
				</div>
				<div className="bento-card min-h-[120px] flex items-center justify-center">
					<p className="text-muted-foreground text-small">KPI 3</p>
				</div>
			</div>
		</div>
	);
}
