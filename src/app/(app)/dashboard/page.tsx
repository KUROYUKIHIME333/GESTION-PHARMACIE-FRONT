'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/src/lib/api';
import { usePharmacyStore, useDashboardStats, useDashboardLoading, useDashboardError } from '@/src/stores/pharmacy.store';
import type { DashboardStats } from '@/src/stores/pharmacy.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { AlertTriangle, Package, Pill, ShoppingCart, FileText, Users, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

interface DashboardResponse {
	success: boolean;
	data: DashboardStats;
}

export default function DashboardPage() {
	const router = useRouter();

	// Store selectors
	const stats = useDashboardStats();
	const isLoading = useDashboardLoading();
	const error = useDashboardError();

	const { setDashboardStats, setDashboardLoading, setDashboardError, setAlertSummary } = usePharmacyStore();

	// Fetch au montage
	const loadDashboard = useCallback(async () => {
		setDashboardLoading(true);
		setDashboardError(null);

		try {
			const res = (await api.get('/api/dashboard/stats')) as DashboardResponse;
			if (res.success) {
				setDashboardStats(res.data);
				// On garde aussi le résumé des alertes à jour pour le badge sidebar
				if (res.data.alerts) {
					setAlertSummary(res.data.alerts);
				}
			}
		} catch (err: unknown) {
			if (err && typeof err === 'object' && 'status' in err && err.status === 401) {
				router.push('/login');
				return;
			}
			setDashboardError((err as Error).message || 'Erreur lors du chargement du tableau de bord');
		} finally {
			setDashboardLoading(false);
		}
	}, [router, setDashboardStats, setDashboardLoading, setDashboardError, setAlertSummary]);

	useEffect(() => {
		loadDashboard();
	}, [loadDashboard]);

	// Si pas encore de données et en chargement
	if (isLoading && !stats) {
		return (
			<div className="flex items-center justify-center h-96">
				<Loader2 className="w-8 h-8 animate-spin text-[rgb(25,119,119)]" />
			</div>
		);
	}

	// Si erreur et pas de données en cache
	if (error && !stats) {
		return (
			<div className="flex flex-col items-center justify-center h-96 gap-4">
				<p className="text-red-600">{error}</p>
				<Button onClick={loadDashboard} variant="outline">
					Réessayer
				</Button>
			</div>
		);
	}

	// Fallback si stats null (ne devrait pas arriver mais TypeScript est content)
	if (!stats) return null;

	const { alerts, stock, expiries, activity, counts } = stats;

	return (
		<div className="space-y-8">
			{/* Erreur silencieuse (si re-fetch échoue mais données en cache) */}
			{error && <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">{error} — Données affichées peuvent être obsolètes</div>}

			{/* Section principale - Bento Grid */}
			<div className="bento-grid">
				{/* Stock global - 50% */}
				<Card className="bento-item-6 border-slate-200 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
							<Package className="w-5 h-5 text-[rgb(40,185,180)]" />
							Stock global
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<p className="text-3xl font-bold text-[rgb(25,119,119)]">{stock.drugsInStock.toLocaleString('fr-FR')}</p>
								<p className="text-sm text-slate-500">médicaments en stock sur {stock.totalDrugs} référencés</p>
							</div>
							<div className="flex items-center gap-4 text-sm">
								<div className="flex items-center gap-1 text-emerald-600">
									<TrendingUp className="w-4 h-4" />
									<span>{stock.drugsLow} sous seuil min</span>
								</div>
								<div className="flex items-center gap-1 text-slate-500">
									<span>Valeur: {stock.totalValueCDF.toLocaleString('fr-FR')} CDF</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Alertes - 25% */}
				<Link href="/alerts" className="block">
					<Card className="bento-item-3 border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
								<AlertTriangle className="w-5 h-5 text-amber-500" />
								Alertes
								{(alerts.critical > 0 || alerts.warning > 0) && (
									<span className="ml-auto flex h-2.5 w-2.5">
										<span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
									</span>
								)}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-slate-600">Critiques</span>
									<span className={`text-lg font-bold ${alerts.critical > 0 ? 'text-red-600' : 'text-slate-400'}`}>{alerts.critical}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-slate-600">Avertissements</span>
									<span className={`text-lg font-bold ${alerts.warning > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{alerts.warning}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-slate-600">Infos</span>
									<span className="text-lg font-bold text-blue-500">{alerts.info}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</Link>

				{/* Activité aujourd'hui - 25% */}
				<Card className="bento-item-3 border-slate-200 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
							<ShoppingCart className="w-5 h-5 text-[rgb(40,185,180)]" />
							Aujourd&apos;hui
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Dispensations</span>
								<span className="text-lg font-bold text-[rgb(25,119,119)]">{activity.dispensationsToday}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Ordonnances</span>
								<span className="text-lg font-bold text-[rgb(25,119,119)]">{activity.prescriptionsToday}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Nouveaux patients</span>
								<span className="text-lg font-bold text-[rgb(25,119,119)]">{activity.newPatientsToday}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* KPIs */}
			<div className="bento-grid">
				<Card className="bento-item-3 border-slate-200 shadow-sm">
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-lg bg-[rgb(25,119,119)]/10 flex items-center justify-center">
								<Pill className="w-6 h-6 text-[rgb(25,119,119)]" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{counts.totalDrugs}</p>
								<p className="text-sm text-slate-500">Médicaments référencés</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bento-item-3 border-slate-200 shadow-sm">
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-lg bg-[rgb(40,185,180)]/10 flex items-center justify-center">
								<Users className="w-6 h-6 text-[rgb(40,185,180)]" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{counts.totalPatients.toLocaleString('fr-FR')}</p>
								<p className="text-sm text-slate-500">Patients enregistrés</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bento-item-3 border-slate-200 shadow-sm">
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
								<FileText className="w-6 h-6 text-amber-500" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{activity.prescriptionsWeek}</p>
								<p className="text-sm text-slate-500">Ordonnances cette semaine</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bento-item-3 border-slate-200 shadow-sm">
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
								<TrendingDown className="w-6 h-6 text-red-500" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{stock.drugsCritical}</p>
								<p className="text-sm text-slate-500">Stock critique</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Péremptions */}
			<div className="bento-grid">
				<Card className="bento-item-4 border-slate-200 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-base font-semibold text-slate-900">Péremptions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Déjà périmés</span>
								<span className={`font-bold ${expiries.expired > 0 ? 'text-red-600' : 'text-slate-400'}`}>{expiries.expired}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">&lt; 30 jours</span>
								<span className={`font-bold ${expiries.critical30Days > 0 ? 'text-red-500' : 'text-slate-400'}`}>{expiries.critical30Days}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">&lt; 90 jours</span>
								<span className={`font-bold ${expiries.warning90Days > 0 ? 'text-amber-500' : 'text-slate-400'}`}>{expiries.warning90Days}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Activité semaine */}
				<Card className="bento-item-4 border-slate-200 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-base font-semibold text-slate-900">Cette semaine</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Dispensations</span>
								<span className="font-bold text-[rgb(25,119,119)]">{activity.dispensationsWeek}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Nouveaux patients</span>
								<span className="font-bold text-[rgb(25,119,119)]">{activity.newPatientsWeek}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Lots en stock</span>
								<span className="font-bold text-slate-700">{counts.totalBatches}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Total dispensations */}
				<Card className="bento-item-4 border-slate-200 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-base font-semibold text-slate-900">Total dispensations</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Toutes périodes</span>
								<span className="font-bold text-[rgb(25,119,119)]">{counts.totalDispensations}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Ordonnances</span>
								<span className="font-bold text-[rgb(25,119,119)]">{counts.totalPrescriptions}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Section analytique - Consommation */}
			<Card className="border-slate-200 shadow-sm">
				<CardHeader>
					<CardTitle className="text-lg font-semibold text-slate-900">Consommation récente</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
						<p className="text-sm text-slate-400">Graphique de consommation (à implémenter — besoin de données historiques)</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
