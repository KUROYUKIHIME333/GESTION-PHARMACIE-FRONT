'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, AlertTriangle, AlertCircle } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { useAlertStore } from '@/src/stores/alert.store';
import DataTable, { Column } from '@/src/components/ui/data-table';
import { Pagination } from '@/src/components/ui/pagination';
import { ConfirmDialog } from '@/src/components/ui/confirm-dialog';
import type { Alert, AlertStatus } from '@/src/schemas/alert.schemas';
import { alertTypeLabels } from '@/src/schemas/alert.schemas';
import { PersonnalDateFormatter } from '@/src/lib/dates';

const severityConfig = {
	critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: <AlertTriangle size={14} /> },
	warning: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertCircle size={14} /> },
	info: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: <AlertCircle size={14} /> },
};

const statusLabels: Record<AlertStatus, string> = {
	ACTIVE: 'Active',
	ACKNOWLEDGED: 'Prise en charge',
	RESOLVED: 'Résolue',
	IGNORED: 'Ignorée',
};

export default function AlertsPage() {
	const { alerts, isLoading, fetchAlerts, acknowledgeAlert, summaryCritical, summaryWarning, summaryInfo, lastError } = useAlertStore();
	const [search, setSearch] = useState('');
	const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
	const [filterStatus, setFilterStatus] = useState<'all' | AlertStatus>('all');
	const [page, setPage] = useState(1);
	const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
	const [showAckDialog, setShowAckDialog] = useState(false);
	const [ackComment, setAckComment] = useState('');
	const LIMIT = 20;

	useEffect(() => {
		fetchAlerts();
	}, [fetchAlerts]);

	const filtered = useMemo(() => {
		if (!alerts) return [];
		let result = alerts;
		if (search.trim()) {
			const q = search.toLowerCase();
			result = result.filter((a) => a.drugName.toLowerCase().includes(q) || a.drugCode.toLowerCase().includes(q) || a.message.toLowerCase().includes(q));
		}
		if (filterSeverity !== 'all') result = result.filter((a) => a.severity === filterSeverity);
		if (filterStatus !== 'all') result = result.filter((a) => a.status === filterStatus);
		return result;
	}, [alerts, search, filterSeverity, filterStatus]);

	const paginated = useMemo(() => {
		const start = (page - 1) * LIMIT;
		return filtered.slice(start, start + LIMIT);
	}, [filtered, page]);

	const totalPages = Math.ceil(filtered.length / LIMIT) || 1;

	const handleAcknowledge = async () => {
		if (!selectedAlert) return;
		await acknowledgeAlert(selectedAlert.id, {
			status: 'ACKNOWLEDGED',
			comment: ackComment || null,
		});
		setShowAckDialog(false);
		setAckComment('');
		setSelectedAlert(null);
	};

	const columns: Column<Alert>[] = [
		{
			key: 'severity',
			header: '',
			align: 'center',
			render: (a) => <div className={`inline-flex items-center justify-center p-1.5 rounded-full ${severityConfig[a.severity].bg}`}>{severityConfig[a.severity].icon}</div>,
		},
		{
			key: 'type',
			header: 'Type',
			render: (a) => <span className="text-xs font-semibold text-slate-600 uppercase">{alertTypeLabels[a.type as keyof typeof alertTypeLabels] || a.type}</span>,
		},
		{
			key: 'drug',
			header: 'Médicament',
			render: (a) => (
				<div className="flex flex-col gap-0.5">
					<span className="font-semibold text-sm text-slate-900">{a.drugName}</span>
					<span className="font-mono text-xs text-slate-500">{a.drugCode}</span>
				</div>
			),
		},
		{
			key: 'message',
			header: 'Message',
			hidden: 'md',
			render: (a) => <span className="text-sm text-slate-600 line-clamp-2">{a.message}</span>,
		},
		{
			key: 'value',
			header: 'Valeur',
			align: 'center',
			hidden: 'lg',
			render: (a) => (
				<span className="font-mono text-sm text-slate-600">
					{a.currentValue ?? '—'}
					{a.threshold !== null && a.threshold !== undefined ? ` / ${a.threshold}` : ''}
				</span>
			),
		},
		{
			key: 'status',
			header: 'Statut',
			align: 'center',
			render: (a) => (
				<span
					className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
						a.status === 'ACTIVE'
							? 'bg-red-100 text-red-700'
							: a.status === 'ACKNOWLEDGED'
								? 'bg-blue-100 text-blue-700'
								: a.status === 'RESOLVED'
									? 'bg-green-100 text-green-700'
									: 'bg-gray-100 text-gray-600'
					}`}
				>
					{statusLabels[a.status]}
				</span>
			),
		},
		{
			key: 'date',
			header: 'Date',
			hidden: 'md',
			render: (a) => <span className="text-xs text-slate-500">{PersonnalDateFormatter.toLongDate(a.createdAt)}</span>,
		},
	];

	return (
		<main className="flex-1 flex flex-col gap-6 overflow-y-auto p-3 md:p-6 lg:p-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-slate-900">Alertes</h1>
					<p className="text-sm text-slate-500 mt-1">Gestion des alertes de stock et de péremption</p>
				</div>
			</div>

			{/* Summary cards */}
			<div className="grid grid-cols-3 gap-4">
				<CardSummary value={summaryCritical} label="Critiques" color="red" onClick={() => setFilterSeverity('critical')} active={filterSeverity === 'critical'} />
				<CardSummary value={summaryWarning} label="Avertissements" color="amber" onClick={() => setFilterSeverity('warning')} active={filterSeverity === 'warning'} />
				<CardSummary value={summaryInfo} label="Infos" color="blue" onClick={() => setFilterSeverity('info')} active={filterSeverity === 'info'} />
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
					<Input
						placeholder="Rechercher par médicament ou message..."
						className="pl-10 text-gray-800 placeholder:text-gray-400 border-0 border-b rounded-none transition-all duration-200 focus-visible:ring-0 border-gray-300 focus-visible:bg-gray-100 focus-visible:border-[rgb(25,119,119)]"
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
					/>
				</div>
				<div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
					{[
						{ key: 'all' as const, label: 'Tous' },
						{ key: 'ACTIVE' as AlertStatus, label: 'Actives' },
						{ key: 'ACKNOWLEDGED' as AlertStatus, label: 'Prises en charge' },
						{ key: 'RESOLVED' as AlertStatus, label: 'Résolues' },
					].map((f) => (
						<button
							key={f.key}
							onClick={() => setFilterStatus(f.key)}
							className={`px-4 py-2 rounded-[2px] text-sm font-medium whitespace-nowrap transition-all ${
								filterStatus === f.key ? 'bg-[rgb(25,119,119)] text-white' : 'bg-white text-slate-600 border border-[#C1C7CB]/50 hover:bg-[#eff7e4]'
							}`}
						>
							{f.label}
						</button>
					))}
				</div>
			</div>

			{/* Table */}
			<DataTable
				data={paginated}
				columns={columns}
				isLoading={isLoading}
				error={lastError}
				emptyMessage="Aucune alerte trouvée"
				actions={{ canView: false, canEdit: true, canDelete: false }}
				onEdit={(alert) => {
					if (alert.status === 'ACTIVE') {
						setSelectedAlert(alert);
						setShowAckDialog(true);
					}
				}}
				// editLabel="Acquitter"
			/>

			<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} itemsPerPage={LIMIT} />

			{/* Acknowledge Dialog */}
			<ConfirmDialog
				open={showAckDialog}
				onOpenChange={setShowAckDialog}
				title="Acquitter l'alerte"
				description={selectedAlert ? `Prendre en charge l'alerte : ${selectedAlert.message} (${selectedAlert.drugName})` : ''}
				onConfirm={handleAcknowledge}
				confirmText="Acquitter"
				cancelText="Annuler"
				variant="default"
			>
				<div className="mt-3">
					<label className="text-sm text-slate-600">Commentaire (optionnel)</label>
					<Input
						value={ackComment}
						onChange={(e) => setAckComment(e.target.value)}
						placeholder="Motif de la prise en charge..."
						className="mt-1 border-0 border-b rounded-none focus-visible:ring-0 border-gray-300 focus-visible:border-[rgb(25,119,119)]"
					/>
				</div>
			</ConfirmDialog>
		</main>
	);
}

function CardSummary({ value, label, color, onClick, active }: { value: number; label: string; color: 'red' | 'amber' | 'blue'; onClick: () => void; active: boolean }) {
	const colors = {
		red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', active: 'ring-2 ring-red-400' },
		amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', active: 'ring-2 ring-amber-400' },
		blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', active: 'ring-2 ring-blue-400' },
	};

	return (
		<button
			onClick={onClick}
			className={`flex flex-col items-center justify-center p-4 rounded-[2px] border transition-all ${colors[color].bg} ${colors[color].border} ${active ? colors[color].active : 'hover:shadow-sm'}`}
		>
			<span className={`text-2xl font-bold ${colors[color].text}`}>{value}</span>
			<span className={`text-xs font-medium ${colors[color].text} opacity-80`}>{label}</span>
		</button>
	);
}
