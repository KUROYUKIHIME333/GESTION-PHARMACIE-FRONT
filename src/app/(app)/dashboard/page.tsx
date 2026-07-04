'use client';

import { useEffect, memo } from 'react';
import { Package, AlertTriangle, Banknote, CalendarX2, Pill, Plus, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { useDashboardStore } from '@/src/stores/dashboard.store';
import { api } from '@/src/lib/api';
import { API_ENDPOINTS } from '@/src/lib/constants';
import Spinner from '@/src/components/layouts/Spinner';
import { DashboardStats } from '@/src/types';

// Composant mémoïsé pour éviter les re-rendus inutiles
const StatCard = memo(({ title, value, icon: Icon, others = [] }: { title: string; value: number | string; icon: LucideIcon; others: string[] }) => (
	<Card>
		<CardContent className="pt-6">
			<Icon className="w-5 h-5 text-slate-500 mb-2" />
			<p className="text-xs text-slate-500 uppercase font-bold">{title}</p>
			<p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
			{others.length > 0 && (
				<div className="text-[10px] text-slate-400 mt-2 flex gap-2">
					{others.map((el: string, i: number) => (
						<span key={i}>{el}</span>
					))}
				</div>
			)}
		</CardContent>
	</Card>
));
StatCard.displayName = 'StatCard';

const Dashboard = () => {
	const { stats, isLoading, lastError, setDashboardStats, setDashboardLoading, setDashboardLastError } = useDashboardStore();

	useEffect(() => {
		let isMounted = true;
		const fetchData = async () => {
			setDashboardLoading(true);
			try {
				const response = await api.get(API_ENDPOINTS.stats);
				if (isMounted && response && typeof response === 'object' && 'success' in response && response.success && 'data' in response && response.data)
					setDashboardStats(response.data as DashboardStats);
				else if (response && typeof response === 'object' && 'success' in response && !response.success && 'message' in response && response.message && typeof response.message === 'string')
					setDashboardLastError(response.message || 'Erreur chargement');
				else setDashboardLastError('Erreur chargement');
			} catch (error: unknown) {
				if (isMounted) setDashboardLastError((error as Error).message);
			} finally {
				if (isMounted) setDashboardLoading(false);
			}
		};
		fetchData();
		return () => {
			isMounted = false;
		};
	});

	if (isLoading) return <Spinner />;

	return (
		<main className="flex-1 p-8 space-y-8">
			{/* SECTION 1 : KPIs */}
			<section className="grid grid-cols-1 md:grid-cols-5 gap-4">
				{stats && (
					<>
						<StatCard title="En Stock" value={stats.stock.drugsInStock} icon={Package} others={[]} />
						<StatCard title="Valeur" value={`${stats.stock.totalValueCDF} CDF`} icon={Banknote} others={[`${stats.stock.totalValueUSD} USD`]} />
						<StatCard title="Alertes" value={stats.alerts.totalActive} icon={AlertTriangle} others={[`Critique: ${stats.alerts.critical}`, `Warn: ${stats.alerts.warning}`]} />
						<StatCard title="Périmés" value={stats.expiries.expired} icon={CalendarX2} others={[`30j: ${stats.expiries.critical30Days}`]} />
						<StatCard title="Dispensations" value={stats.activity.dispensationsToday} icon={Pill} others={[`Semaine: ${stats.activity.dispensationsWeek}`]} />
					</>
				)}
			</section>

			{/* SECTION 2 : VUES DYNAMIQUES */}
			<section className="grid grid-cols-12 gap-6">
				<Card className="col-span-12 lg:col-span-8">
					<CardHeader>
						<CardTitle>Activité Récente</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-3 gap-4">
						<div className="bg-slate-50 p-4 rounded-lg">
							<p className="text-slate-500 text-sm">Nouveaux Patients</p>
							<p className="text-2xl font-bold">{stats?.activity.newPatientsToday || 0}</p>
						</div>
						<div className="bg-slate-50 p-4 rounded-lg">
							<p className="text-slate-500 text-sm">Prescriptions</p>
							<p className="text-2xl font-bold">{stats?.activity.prescriptionsToday || 0}</p>
						</div>
						<div className="bg-slate-50 p-4 rounded-lg">
							<p className="text-slate-500 text-sm">Total Dispensations</p>
							<p className="text-2xl font-bold">{stats?.counts.totalDispensations || 0}</p>
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-12 lg:col-span-4">
					<CardHeader>
						<CardTitle>Inventaire Global</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex justify-between">
							<span>Total Médicaments</span>
							<span className="font-bold">{stats?.counts.totalDrugs}</span>
						</div>
						<div className="flex justify-between">
							<span>Lots actifs</span>
							<span className="font-bold">{stats?.counts.totalBatches}</span>
						</div>
						<div className="flex justify-between">
							<span>Total Patients</span>
							<span className="font-bold">{stats?.counts.totalPatients}</span>
						</div>
					</CardContent>
				</Card>
			</section>

			{lastError && <div className="fixed bottom-8 left-8 bg-red-100 text-red-700 p-4 rounded shadow-lg">{lastError}</div>}
			<Button className="fixed bottom-8 right-8 rounded-full h-14 w-14 shadow-xl">
				<Plus size={24} />
			</Button>
		</main>
	);
};

export default Dashboard;
