'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Patient } from '@/src/types';
import { api } from '@/src/lib/api';
import { PatientForm } from '@/src/components/forms/PatientForm';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditPatientPage() {
	const params = useParams();
	const router = useRouter();
	const [patient, setPatient] = useState<Patient | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadPatient = async () => {
			try {
				const response = await api.get(`/api/patients/${params.id}`);
				if (response.success) {
					setPatient(response.data);
				}
			} catch (err: any) {
				if (err.status === 401) {
					router.push('/login');
					return;
				}
				setError(err.message || 'Erreur lors du chargement du patient');
			} finally {
				setIsLoading(false);
			}
		};

		loadPatient();
	}, [params.id, router]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="w-8 h-8 border-4 border-[rgb(25,119,119)] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (error || !patient) {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
					<AlertCircle className="h-5 w-5 flex-shrink-0" />
					<span>{error || 'Patient non trouvé'}</span>
				</div>
				<Button variant="outline" className="border-slate-200">
					<Link href="/patients">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Retour
					</Link>
				</Button>
			</div>
		);
	}

	return <PatientForm patient={patient} mode="edit" />;
}
