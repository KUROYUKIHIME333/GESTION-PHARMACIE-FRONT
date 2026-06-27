'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	onConfirm: () => void;
	isLoading?: boolean;
	confirmText?: string;
	cancelText?: string;
	variant?: 'destructive' | 'default';
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	onConfirm,
	isLoading = false,
	confirmText = 'Confirmer',
	cancelText = 'Annuler',
	variant = 'destructive',
}: ConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
							<AlertTriangle className="h-5 w-5 text-red-600" />
						</div>
						<div>
							<DialogTitle className="text-lg font-semibold text-slate-900">{title}</DialogTitle>
							<DialogDescription className="text-sm text-slate-500 mt-1">{description}</DialogDescription>
						</div>
					</div>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="border-slate-200">
						{cancelText}
					</Button>
					<Button
						variant={variant === 'destructive' ? 'destructive' : 'default'}
						onClick={onConfirm}
						disabled={isLoading}
						className={variant !== 'destructive' ? 'bg-[rgb(25,119,119)] hover:bg-[rgb(25,119,119)]/90' : ''}
					>
						{isLoading ? 'Suppression...' : confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
