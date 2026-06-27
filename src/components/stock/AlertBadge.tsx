'use client';

import { Badge } from '@/src/components/ui/badge';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface AlertBadgeProps {
	type: 'critical' | 'warning' | 'info';
	message: string;
	className?: string;
}

export function AlertBadge({ type, message, className }: AlertBadgeProps) {
	const config = {
		critical: {
			icon: AlertTriangle,
			className: 'bg-red-100 text-red-700 border-red-200',
			iconClass: 'text-red-600',
		},
		warning: {
			icon: AlertCircle,
			className: 'bg-amber-100 text-amber-700 border-amber-200',
			iconClass: 'text-amber-600',
		},
		info: {
			icon: Info,
			className: 'bg-sky-100 text-sky-700 border-sky-200',
			iconClass: 'text-sky-600',
		},
	};

	const { icon: Icon, className: badgeClass, iconClass } = config[type];

	return (
		<Badge variant="outline" className={cn(badgeClass, 'font-normal', className)}>
			<Icon className={cn('h-3 w-3 mr-1.5', iconClass)} />
			{message}
		</Badge>
	);
}
