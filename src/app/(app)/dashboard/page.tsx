'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, TrendingDown, Package, Users, FileText, Pill, Snowflake, Activity, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { useDashboardStore } from '@/src/stores/dashboard.store';
import { useAlertStore } from '@/src/stores/alert.store';
import { useStockStore } from '@/src/stores/stock.store';
import Pulser from '@/src/components/ui/pulser';
import Link from 'next/link';

interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: React.ReactNode;
	accent?: boolean;
	critical?: boolean;
	href?: string;
}

const StatCard = ({ title, value, subtitle, icon, accent, critical, href }: StatCardProps) => {
	const content = (
		<Card className={`border-none ring-0 rounded-[2px] transition-all duration-200 hover:shadow-md cursor-pointer h-full ${critical ? 'bg-red-50' : accent ? 'bg-[#eff7e4]' : 'bg-white'}`}>
			<CardContent className="p-5 flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<div className={`p-2 rounded-[2px] ${critical ? 'bg-red-100' : accent ? 'bg-[rgb(40,185,180)]/10' : 'bg-slate-100'}`}>{icon}</div>
					{href && <ArrowRight size={16} className="text-slate-400" />}
				</div>
				<div>
					<p className="text-2xl font-bold text-slate-900">{value}</p>
					<p className="text-sm font-medium text-slate-600">{title}</p>
					{subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
				</div>
			</CardContent>
		</Card>
	);

	if (href) {
		return (
			<Link href={href} className="block h-full">
				{content}
			</Link>
		);
	}
	return content;
};

const ALERT_CONFIGS = {
	critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: <AlertTriangle size={18} /> },
	warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: <AlertCircle size={18} /> },
	info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: <AlertCircle size={18} /> },
};

const AlertRow = ({ severity, message, drugName, drugCode, createdAt }: { severity: string; message: string; drugName: string; drugCode: string; createdAt: string }) => {
	const router = useRouter();
	const config = ALERT_CONFIGS[severity as keyof typeof ALERT_CONFIGS] || ALERT_CONFIGS.info;

	return (
		<div onClick={() => router.push('/alerts')} className={`flex items-start gap-3 p-4 rounded-[2px] border ${config.bg} ${config.border} cursor-pointer hover:shadow-sm transition-all`}>
			<div className={`mt-0.5 ${config.text}`}>{config.icon}</div>
			<div className="flex-1 min-w-0">
				<p className={`text-sm font-semibold ${config.text}`}>{message}</p>
				<p className="text-xs text-slate-500 mt-0.5">
					{drugName} ({drugCode}) · {new Date(createdAt).toLocaleDateString('fr-FR')}
				</p>
			</div>
		</div>
	);
};

const DashboardPage = () => {
	const { stats, isLoading, isFetched, fetchDashboard } = useDashboardStore();
	const { alerts, fetchAlerts } = useAlertStore();
	const { stockItems, fetchStock } = useStockStore();

	useEffect(() => {
		if (!isFetched) {
			fetchDashboard();
		}
		fetchAlerts();
		if (!stockItems) {
			fetchStock();
		}
	}, [fetchDashboard, fetchAlerts, fetchStock, isFetched, stockItems]);

	if (isLoading && !stats) {
		return (
			<main className="flex-1 flex items-center justify-center min-h-screen">
				<Pulser />
			</main>
		);
	}

	const s = stats;

	return (
		<main className="flex-1 flex flex-col gap-6 overflow-y-auto p-3 md:p-6 lg:p-8">
			{/* Header */}
			<div>
				<h1 className="text-xl sm:text-2xl font-bold text-slate-900">Tableau de bord</h1>
				<p className="text-sm text-slate-500 mt-1">Vue d&apos;ensemble de la pharmacie hospitalière</p>
			</div>

			{/* Bento Grid — KPIs principaux */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<StatCard
					title="Alertes critiques"
					value={s?.alerts.critical || 0}
					subtitle="nécessitent une action"
					icon={<AlertTriangle size={20} className="text-red-600" />}
					critical={(s?.alerts.critical || 0) > 0}
					href="/alerts"
				/>
				<StatCard
					title="Stock bas"
					value={s?.stock.drugsLow || 0}
					subtitle="sous le seuil d'alerte"
					icon={<TrendingDown size={20} className="text-amber-600" />}
					accent={(s?.stock.drugsLow || 0) > 0}
					href="/stock"
				/>
				<StatCard
					title="Péremptions 30j"
					value={s?.expiries.critical30Days || 0}
					subtitle="lots à surveiller"
					icon={<Snowflake size={20} className="text-blue-600" />}
					accent={(s?.expiries.critical30Days || 0) > 0}
					href="/reports?tab=expiry"
				/>
				<StatCard title="Dispensations auj." value={s?.activity.dispensationsToday || 0} subtitle="aujourd'hui" icon={<Activity size={20} className="text-[rgb(25,119,119)]" />} accent />
			</div>

			{/* Deuxième rangée */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<StatCard title="Médicaments" value={s?.counts.totalDrugs || 0} subtitle="dans le référentiel" icon={<Pill size={20} className="text-[rgb(25,119,119)]" />} href="/drugs" />
				<StatCard title="Patients" value={s?.counts.totalPatients || 0} subtitle="dossiers actifs" icon={<Users size={20} className="text-[rgb(25,119,119)]" />} href="/patients" />
				<StatCard title="Ordonnances" value={s?.counts.totalPrescriptions || 0} subtitle="créées" icon={<FileText size={20} className="text-[rgb(25,119,119)]" />} href="/prescriptions" />
				<StatCard
					title="Valeur stock"
					value={`${(s?.stock.totalValueCDF || 0).toLocaleString('fr-FR')} Fc`}
					subtitle="estimation totale"
					icon={<Package size={20} className="text-[rgb(25,119,119)]" />}
					accent
				/>
			</div>

			{/* Section Alertes récentes */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-bold text-slate-900">Alertes actives</h2>
						<Link href="/alerts">
							<Button variant="ghost" className="text-[rgb(25,119,119)] font-bold text-sm hover:bg-[#eff7e4] rounded-[2px]">
								Voir tout <ArrowRight size={14} className="ml-1" />
							</Button>
						</Link>
					</div>

					<div className="flex flex-col gap-2">
						{alerts && alerts.length > 0 ? (
							alerts
								.filter((a) => a.status === 'ACTIVE')
								.slice(0, 6)
								.map((alert) => (
									<AlertRow key={alert.id} severity={alert.severity} message={alert.message} drugName={alert.drugName} drugCode={alert.drugCode} createdAt={alert.createdAt} />
								))
						) : (
							<div className="flex flex-col items-center justify-center py-12 gap-3 bg-white rounded-[2px] border border-[#C1C7CB]/30">
								<CheckCircle2 size={40} className="text-green-400" />
								<p className="text-slate-500 font-medium">Aucune alerte active</p>
								<p className="text-sm text-slate-400">Le stock est sous contrôle.</p>
							</div>
						)}
					</div>
				</div>

				{/* Activité récente */}
				<div className="flex flex-col gap-4">
					<h2 className="text-lg font-bold text-slate-900">Activité récente</h2>
					<Card className="border-none ring-0 rounded-[2px] bg-white h-full">
						<CardContent className="p-5 flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Dispensations (7j)</span>
								<span className="text-lg font-bold text-[rgb(25,119,119)]">{s?.activity.dispensationsWeek || 0}</span>
							</div>
							<div className="h-px bg-[#C1C7CB]/30" />
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Ordonnances (7j)</span>
								<span className="text-lg font-bold text-[rgb(25,119,119)]">{s?.activity.prescriptionsWeek || 0}</span>
							</div>
							<div className="h-px bg-[#C1C7CB]/30" />
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Nouveaux patients (7j)</span>
								<span className="text-lg font-bold text-[rgb(25,119,119)]">{s?.activity.newPatientsWeek || 0}</span>
							</div>
							<div className="h-px bg-[#C1C7CB]/30" />
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Lots en stock</span>
								<span className="text-lg font-bold text-[rgb(25,119,119)]">{s?.counts.totalBatches || 0}</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</main>
	);
};

export default DashboardPage;
