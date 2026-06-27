'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AlertTriangle, Package, Pill, ShoppingCart, FileText, Users, TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardPage() {
	return (
		<div className="space-y-8">
			{/* Section principale - Bento Grid */}
			<div className="bento-grid">
				{/* Stock global - 50% */}
				<Card className="bento-item-6 border-slate-200 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
							<Package className="w-5 h-5 text-secondary" />
							Stock global
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<p className="text-3xl font-bold text-primary">1,247</p>
								<p className="text-sm text-slate-500">unités en stock</p>
							</div>
							<div className="flex items-center gap-4 text-sm">
								<div className="flex items-center gap-1 text-success">
									<TrendingUp className="w-4 h-4" />
									<span>+12% ce mois</span>
								</div>
								<div className="flex items-center gap-1 text-slate-500">
									<span>Valeur: 3,450,000 CDF</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Alertes - 25% */}
				<Card className="bento-item-3 border-slate-200 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
							<AlertTriangle className="w-5 h-5 text-accent" />
							Alertes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Critiques</span>
								<span className="text-lg font-bold text-destructive">3</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Avertissements</span>
								<span className="text-lg font-bold text-warning">7</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Infos</span>
								<span className="text-lg font-bold text-info">12</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Activité récente - 25% */}
				<Card className="bento-item-3 border-slate-200 shadow-sm">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
							<ShoppingCart className="w-5 h-5 text-secondary" />
							Aujourd'hui
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Dispensations</span>
								<span className="text-lg font-bold text-primary">24</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Ordonnances</span>
								<span className="text-lg font-bold text-primary">18</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-600">Nouveaux patients</span>
								<span className="text-lg font-bold text-primary">5</span>
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
							<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
								<Pill className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">342</p>
								<p className="text-sm text-slate-500">Médicaments référencés</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bento-item-3 border-slate-200 shadow-sm">
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
								<Users className="w-6 h-6 text-secondary" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">1,856</p>
								<p className="text-sm text-slate-500">Patients enregistrés</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bento-item-3 border-slate-200 shadow-sm">
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
								<FileText className="w-6 h-6 text-warning" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">156</p>
								<p className="text-sm text-slate-500">Ordonnances ce mois</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bento-item-3 border-slate-200 shadow-sm">
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
								<TrendingDown className="w-6 h-6 text-destructive" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">8</p>
								<p className="text-sm text-slate-500">Ruptures de stock</p>
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
						<p className="text-sm text-slate-400">Graphique de consommation (à implémenter)</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
