'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, FileText, Users, BarChart3, Settings, HelpCircle, LogOut, Bell, Search, Focus, Plus, TrendingUp, AlertTriangle, MoreVertical, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

import { Button } from '@/src/components/ui/button';
import { DashboardStats as DashboardInterface } from '@/src/types';
import { DashboardStats as statsInStore } from '@/src/stores/pharmacy.store';
import { api } from '@/src/lib/api';
import Spinner from '@/src/components/layouts/Spinner';
import { useDashboardStore } from '@/src/stores/dashboard.store';

const Dashboard = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [serverError, setServerError] = useState<string | null>(null);

	const gettingStats = async () => {
		setIsLoading(true);
		setServerError(null);
		try {
		} catch (error) {
		} finally {
		}
	};

	useEffect(() => {}, []);

	return (
		<>
			{/* Main Content */}
			<main className="flex-1 overflow-y-auto">
				{isLoading ? (
					<Spinner />
				) : (
					<div className="p-8 space-y-8">
						<section className="grid grid-cols-1 md:grid-cols-4 gap-4">
							{[
								{ title: 'Drugs in Stock', value: '12,482', trend: '+2.4%' },
								{ title: 'Prescriptions Today', value: '148', trend: '+12' },
								{ title: 'Dispensations', value: '3,102', trend: 'Weekly Avg' },
								{ title: 'Dispensations', value: '3,102', trend: 'Weekly Avg' },
								{ title: 'Active Alerts', value: '09', trend: 'CRITICAL', error: true },
							].map((kpi, i) => (
								<Card key={i} className={kpi.error ? 'border-red-200' : ''}>
									<CardContent className="pt-6">
										<p className="text-xs text-slate-500 uppercase">{kpi.title}</p>
										<div className="flex justify-between items-end mt-2">
											<span className={`text-3xl font-bold ${kpi.error ? 'text-red-600' : 'text-slate-900'}`}>{kpi.value}</span>
											<span className="text-xs font-medium text-slate-600 flex items-center gap-1">
												{kpi.trend} <TrendingUp size={12} />
											</span>
										</div>
									</CardContent>
								</Card>
							))}
						</section>
						<section className="grid grid-cols-12 gap-6">
							<Card className="col-span-12 lg:col-span-6 h-[400px]">
								<CardHeader className="flex flex-row items-center justify-between">
									<CardTitle>Global Stock Summary</CardTitle>
									<MoreVertical size={16} className="text-slate-400" />
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 gap-8">
										<div>
											<p className="text-sm text-slate-500">Total Quantity</p>
											<p className="text-4xl font-bold">842k</p>
										</div>
										<div>
											<p className="text-sm text-slate-500">Inventory Value</p>
											<p className="text-4xl font-bold">$2.4M</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="col-span-12 lg:col-span-3 h-[400px]">
								<CardHeader>
									<CardTitle>Active Alerts</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="p-3 border-l-4 border-orange-500 bg-slate-50 rounded">
										<p className="text-sm font-bold">Insulin Glargine</p>
										<p className="text-xs text-slate-600">8 units remaining.</p>
									</div>
									<div className="p-3 border-l-4 border-red-500 bg-slate-50 rounded">
										<p className="text-sm font-bold">Amoxicillin 500mg</p>
										<p className="text-xs text-slate-600">Expires in 48h.</p>
									</div>
								</CardContent>
							</Card>
						</section>
					</div>
				)}
			</main>

			{/* FAB */}
			<Button className="fixed bottom-8 right-8 rounded-full h-14 w-14 shadow-xl">
				<Plus size={24} />
			</Button>
		</>
	);
};

export default Dashboard;
