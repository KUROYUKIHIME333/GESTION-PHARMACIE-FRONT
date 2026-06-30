'use client';

import { useState } from 'react';
import { PatientAllergy, AllergySeverity, AllergyCreateInput } from '@/src/types';
import { ALLERGY_SEVERITY_LABELS, ALLERGY_SEVERITY_COLORS } from '@/src/lib/constants';
import { api } from '@/src/lib/api';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { AlertCircle, Plus, X } from 'lucide-react';

interface AllergyListProps {
	patientId: string;
	allergies: PatientAllergy[];
	onAllergyAdded: () => void;
}

export function AllergyList({ patientId, allergies, onAllergyAdded }: AllergyListProps) {
	const [showForm, setShowForm] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [substance, setSubstance] = useState('');
	const [reaction, setReaction] = useState('');
	const [severity, setSeverity] = useState<AllergySeverity>('MILD');
	const [confirmedBy, setConfirmedBy] = useState('');
	const [notes, setNotes] = useState('');

	const severities: AllergySeverity[] = ['MILD', 'MODERATE', 'SEVERE', 'ANAPHYLAXIS'];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const payload: AllergyCreateInput = {
				substance,
				severity,
				...(reaction && { reaction }),
				...(confirmedBy && { confirmedBy }),
				...(notes && { notes }),
			};

			await api.post(`/api/patients/${patientId}/allergies`, payload);

			setSubstance('');
			setReaction('');
			setSeverity('MILD');
			setConfirmedBy('');
			setNotes('');
			setShowForm(false);
			onAllergyAdded();
		} catch (error: any) {
			setError(error.message || "Erreur lors de l'ajout de l'allergie");
			setIsLoading(false);
		}
	};

	return (
		<Card className="border-slate-200">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-lg text-slate-900">Allergies médicamenteuses</CardTitle>
				<Button type="button" size="sm" onClick={() => setShowForm(!showForm)} className="bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90 text-white">
					{showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4 mr-1" />}
					{showForm ? 'Annuler' : 'Ajouter'}
				</Button>
			</CardHeader>
			<CardContent className="space-y-4">
				{error && (
					<div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
						<AlertCircle className="h-4 w-4 flex-shrink-0" />
						<span>{error}</span>
					</div>
				)}

				{showForm && (
					<form onSubmit={handleSubmit} className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label className="text-slate-700 text-sm">
									Substance <span className="text-red-500">*</span>
								</Label>
								<Input value={substance} onChange={(e) => setSubstance(e.target.value)} className="border-slate-200 h-9" placeholder="Ex: Pénicilline" required />
							</div>
							<div className="space-y-1">
								<Label className="text-slate-700 text-sm">
									Sévérité <span className="text-red-500">*</span>
								</Label>
								<select
									value={severity}
									onChange={(e) => setSeverity(e.target.value as AllergySeverity)}
									className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-sm"
								>
									{severities.map((s) => (
										<option key={s} value={s}>
											{ALLERGY_SEVERITY_LABELS[s]}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="space-y-1">
							<Label className="text-slate-700 text-sm">Réaction observée</Label>
							<Input value={reaction} onChange={(e) => setReaction(e.target.value)} className="border-slate-200 h-9" placeholder="Ex: Éruption cutanée" />
						</div>
						<div className="space-y-1">
							<Label className="text-slate-700 text-sm">Confirmé par</Label>
							<Input value={confirmedBy} onChange={(e) => setConfirmedBy(e.target.value)} className="border-slate-200 h-9" placeholder="Nom du praticien" />
						</div>
						<div className="space-y-1">
							<Label className="text-slate-700 text-sm">Notes</Label>
							<Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="border-slate-200 min-h-[60px]" />
						</div>
						<Button type="submit" disabled={isLoading || !substance.trim()} size="sm" className="bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90 text-white">
							{isLoading ? 'Enregistrement...' : "Enregistrer l'allergie"}
						</Button>
					</form>
				)}

				{allergies.length === 0 ? (
					<p className="text-sm text-slate-400 text-center py-4">Aucune allergie enregistrée</p>
				) : (
					<div className="space-y-2">
						{allergies.map((allergy) => (
							<div key={allergy.id} className="flex items-start justify-between p-3 rounded-lg border border-slate-200">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="font-medium text-slate-900">{allergy.substance}</span>
										<Badge variant="outline" className={ALLERGY_SEVERITY_COLORS[allergy.severity]}>
											{ALLERGY_SEVERITY_LABELS[allergy.severity]}
										</Badge>
									</div>
									{allergy.reaction && <p className="text-sm text-slate-600">Réaction: {allergy.reaction}</p>}
									{allergy.confirmedBy && <p className="text-xs text-slate-500">Confirmé par: {allergy.confirmedBy}</p>}
									{allergy.notes && <p className="text-xs text-slate-500">{allergy.notes}</p>}
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
