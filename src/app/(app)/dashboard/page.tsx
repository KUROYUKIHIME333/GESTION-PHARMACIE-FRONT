'use client';

import { useEffect } from 'react';
import { Package, AlertTriangle, Banknote, CalendarX2, Pill, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { useDashboardStore } from '@/src/stores/dashboard.store';
import Pulser from '@/src/components/ui/pulser';

const Dashboard = () => {
	const { stats, isLoading, isError, lastError, fetchStats } = useDashboardStore();

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	if (isLoading) return <Pulser />;

	return (
		<>
			{/* Main Content */}

			{/* perhaps bg-[#eff7e4] */}
			<main className="flex-1 overflow-y-auto bg-[#F9F9FA] w-full">
				<div className="p-8 space-y-8">
					{isLoading ? (
						<Pulser />
					) : (
						<>
							<section className="grid grid-cols-1  md:grid-cols-3 lg:grid-col-4 gap-4">
								{[
									{ title: 'Médicaments en stock', value: stats?.stock.drugsInStock || '---', icon: Package, others: [] },
									{ title: 'Valeur du stock', value: `${stats?.stock.totalValueCDF} CDF ` || '---', icon: Banknote, others: [`${stats?.stock.totalValueUSD} USD`] },

									{ title: 'Dispensations', value: stats?.activity.dispensationsToday || '---', icon: Pill, others: [`Cette semaine : ${stats?.activity.dispensationsWeek}`] },
									{
										title: 'Périmés',
										value: stats?.expiries.expired || '---',
										icon: CalendarX2,
										others: [`Dans 30 jours: ${stats?.expiries.critical30Days}` || '---', `Dans 90 jours: ${stats?.expiries.warning90Days}`],
									},
									{
										title: 'Alertes',
										value: stats?.alerts.totalActive || '---',
										icon: AlertTriangle,
										others: [`Critique: ${stats?.alerts.critical}`, `Attention: ${stats?.alerts.warning}`],
										titleColour: '#FF0000',
										valueColour: 'red-500',
										colours: ['#FF8800', '#FF0000'],
									},
								].map((kpi, i) => {
									const Icon = kpi.icon;
									const title = kpi.title || '';
									const value = kpi.value || '';
									const others = kpi.others || [];
									return (
										<Card key={`${i}-${title}`} className={`rounded-[2px] ring-0 border-1 border-[#C1C7CB] bg-white`}>
											<CardContent className="pt-6">
												<div className="flex gap-2">
													<Icon
														className={`w-5 h-5 ${(value && title === 'Alertes') || title === 'Alerts' || title === 'Warning' || title === 'Périmés' || title === 'Rerime' || title === 'Spoiled' ? 'text-red-800' : 'text-slate-500'} mb-2`}
													/>
													<p
														className={`text-xs ${(value && title === 'Alertes') || title === 'Alerts' || title === 'Warning' || title === 'Périmés' || title === 'Rerime' || title === 'Spoiled' ? 'text-red-800' : 'text-slate-500'} uppercase font-bold`}
													>
														{title}
													</p>
												</div>
												<p
													className={`text-xl font-bold mt-1 ${(value && title === 'Alertes') || title === 'Alerts' || title === 'Warning' || title === 'Périmés' || title === 'Rerime' || title === 'Spoiled' ? 'text-red-500' : 'text-slate-900'} `}
												>
													{value}
												</p>
												{others.length > 0 && (
													<div className="text-md mt-2 flex flex-col justify-between">
														{others.map((el: string, i: number) => (
															<span
																key={i}
																className={`
																	${
																		others[i].startsWith('Critique:') ||
																		others[i].startsWith('Dans 30 jours:') ||
																		others[i].startsWith('In 30 days:') ||
																		others[i].startsWith('Within 30 days:') ||
																		others[i].startsWith('Critical:')
																			? 'text-red-800'
																			: others[i].startsWith('Attention:') ||
																				  others[i].startsWith('Warning:') ||
																				  others[i].startsWith('In 90 days') ||
																				  others[i].startsWith('Dans 90 jours:') ||
																				  others[i].startsWith('Within 90 days:')
																				? 'text-orange-500'
																				: 'text-slate-400'
																	}
																		`}
															>
																{el}
															</span>
														))}
													</div>
												)}
											</CardContent>
										</Card>
									);
								})}
							</section>
							<section className="grid grid-cols-12 gap-6">
								<Card className="col-span-12 lg:col-span-8 rounded-[2px] ring-0 border-1 border-[#C1C7CB] bg-white">
									<CardHeader>
										<CardTitle>Activité Récente</CardTitle>
									</CardHeader>
									<CardContent className="grid lg:grid-cols-3 grid-cols-1 gap-4">
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

								<Card className="col-span-12 lg:col-span-4 rounded-[2px] ring-0 border-1 border-[#C1C7CB] bg-white">
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
							</section>{' '}
						</>
					)}
				</div>
			</main>

			{/* FAB */}

			<div className="flex">
				{(isError || lastError) && (
					<div className="fixed bottom-8 left-8 bg-red-100 text-red-700 px-4 py-2 rounded shadow-md flex items-center gap-2">
						<AlertTriangle size={16} />

						{lastError || 'Erreur de connexion au server distant'}
					</div>
				)}

				<Button className="bg-[#eff7e4] hover:bg-[#4B866B] opacity-80 fixed bottom-8 right-8 rounded-full h-14 w-14 shadow-xl">
					<Plus size={24} />
				</Button>
			</div>
		</>
	);
};

export default Dashboard;
