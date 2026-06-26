'use client';

import { useState } from 'react';
import {
	ChevronDown,
	Circle,
	Copy,
	Check,
	Search,
	Filter,
	Tag,
	Layers,
	Shield,
	FileJson,
	Code,
	Globe,
	Minus,
	Plus,
	Activity,
	Pill,
	Package,
	Database,
	Users,
	FileText,
	HandHeart,
	Bell,
	BarChart3,
	HeartPulse,
	Zap,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { cn } from '../../../lib/utils';

// OpenAPI Spec Embedded──────────────────────────────────────────────

const OPENAPI_SPEC = {
	openapi: '3.0.3',
	info: { title: 'API Documentation', version: '1.0.0' },
	components: {
		securitySchemes: {
			bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
		},
		schemas: {},
	},
	paths: {
		'/api/auth/register': {
			post: {
				tags: ['Auth'],
				description: "Inscription d'un nouvel utilisateur",
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									employeeId: { type: 'string' },
									firstName: { type: 'string' },
									lastName: { type: 'string' },
									email: { type: 'string', format: 'email' },
									phone: { type: 'string' },
									password: { type: 'string', minLength: 8 },
									role: {
										type: 'string',
										enum: ['SUPERADMIN', 'PHARMACIST', 'PHARMACY_TECH', 'DOCTOR', 'NURSE', 'CASHIER', 'STOCK_MANAGER', 'AUDITOR'],
									},
									serviceId: { type: 'string' },
								},
								required: ['firstName', 'lastName', 'email', 'password', 'role'],
							},
						},
					},
				},
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/auth/login': {
			post: {
				tags: ['Auth'],
				description: 'Connexion utilisateur',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									email: { type: 'string', format: 'email' },
									password: { type: 'string', minLength: 1 },
								},
								required: ['email', 'password'],
							},
						},
					},
				},
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/auth/me': {
			get: { responses: { '200': { description: 'Default Response' } } },
		},
		'/api/drugs/': {
			get: { responses: { '200': { description: 'Default Response' } } },
			post: { responses: { '200': { description: 'Default Response' } } },
		},
		'/api/drugs/{id}': {
			get: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
			put: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
			delete: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/batches/': {
			get: { responses: { '200': { description: 'Default Response' } } },
			post: { responses: { '200': { description: 'Default Response' } } },
		},
		'/api/batches/{id}': {
			get: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/batches/{id}/quarantine': {
			put: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/stock/': {
			get: { responses: { '200': { description: 'Default Response' } } },
		},
		'/api/stock/{drugId}': {
			get: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'drugId',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/patients/': {
			get: { responses: { '200': { description: 'Default Response' } } },
			post: { responses: { '200': { description: 'Default Response' } } },
		},
		'/api/patients/{id}': {
			get: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
			put: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/patients/{id}/allergies': {
			get: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
			post: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/prescriptions/': {
			get: { responses: { '200': { description: 'Default Response' } } },
			post: { responses: { '200': { description: 'Default Response' } } },
		},
		'/api/prescriptions/{id}': {
			get: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/prescriptions/{id}/lines': {
			post: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/prescriptions/{id}/status': {
			put: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/dispensations/': {
			get: { responses: { '200': { description: 'Default Response' } } },
			post: { responses: { '200': { description: 'Default Response' } } },
		},
		'/api/dispensations/{id}': {
			get: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/alerts/': {
			get: { responses: { '200': { description: 'Default Response' } } },
		},
		'/api/alerts/{id}/acknowledge': {
			post: {
				parameters: [
					{
						schema: { type: 'string' },
						in: 'path',
						name: 'id',
						required: true,
					},
				],
				responses: { '200': { description: 'Default Response' } },
			},
		},
		'/api/dashboard/stats': {
			get: { responses: { '200': { description: 'Default Response' } } },
		},
		'/health': {
			get: { responses: { '200': { description: 'Default Response' } } },
		},
	},
};

// Helpers───

const METHOD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
	GET: {
		bg: 'bg-emerald-50',
		text: 'text-emerald-700',
		border: 'border-emerald-200',
	},
	POST: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
	PUT: {
		bg: 'bg-amber-50',
		text: 'text-amber-700',
		border: 'border-amber-200',
	},
	PATCH: {
		bg: 'bg-violet-50',
		text: 'text-violet-700',
		border: 'border-violet-200',
	},
	DELETE: {
		bg: 'bg-rose-50',
		text: 'text-rose-700',
		border: 'border-rose-200',
	},
};

const TAG_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
	Auth: Shield,
	Drugs: Pill,
	Batches: Package,
	Stock: Database,
	Patients: Users,
	Prescriptions: FileText,
	Dispensations: HandHeart,
	Alerts: Bell,
	Dashboard: BarChart3,
	Health: HeartPulse,
	default: Zap,
};

function getTagFromPath(path: string): string {
	if (path.startsWith('/api/auth')) return 'Auth';
	if (path.startsWith('/api/drugs')) return 'Drugs';
	if (path.startsWith('/api/batches')) return 'Batches';
	if (path.startsWith('/api/stock')) return 'Stock';
	if (path.startsWith('/api/patients')) return 'Patients';
	if (path.startsWith('/api/prescriptions')) return 'Prescriptions';
	if (path.startsWith('/api/dispensations')) return 'Dispensations';
	if (path.startsWith('/api/alerts')) return 'Alerts';
	if (path.startsWith('/api/dashboard')) return 'Dashboard';
	if (path.startsWith('/health')) return 'Health';
	return 'Autres';
}

type DescriptionNode = string | { [key: string]: DescriptionNode | string };

function inferDescription(method: string, path: string): string {
	const descriptions: { [key: string]: DescriptionNode } = {
		'api/auth': {
			default: {
				POST: 'Authentification',
				GET: 'Profil utilisateur',
			},
			register: { POST: 'Inscription nouvel utilisateur' },
			login: { POST: 'Connexion utilisateur' },
			me: { GET: "Récupérer l'utilisateur connecté" },
		},
		'api/drugs': {
			default: { GET: 'Lister les médicaments', POST: 'Créer un médicament' },
			id: {
				GET: "Détail d'un médicament",
				PUT: 'Modifier un médicament',
				DELETE: 'Supprimer un médicament',
			},
		},
		'api/batches': {
			default: { GET: 'Lister les lots', POST: 'Réceptionner un lot' },
			id: { GET: "Détail d'un lot", quarantine: { PUT: 'Mettre en quarantaine' } },
		},
		'api/stock': {
			default: { GET: 'Vue agrégée du stock' },
			drugId: { GET: 'Stock par médicament' },
		},
		'api/patients': {
			default: { GET: 'Lister les patients', POST: 'Créer un patient' },
			id: {
				GET: "Détail d'un patient",
				PUT: 'Modifier un patient',
				allergies: { GET: 'Lister les allergies', POST: 'Ajouter une allergie' },
			},
		},
		'api/prescriptions': {
			default: { GET: 'Lister les ordonnances', POST: 'Créer une ordonnance' },
			id: {
				GET: "Détail d'une ordonnance",
				lines: { POST: 'Ajouter une ligne' },
				status: { PUT: 'Changer le statut' },
			},
		},
		'api/dispensations': {
			default: {
				GET: 'Historique des dispensations',
				POST: 'Créer une dispensation',
			},
			id: { GET: "Détail d'une dispensation" },
		},
		'api/alerts': {
			default: { GET: 'Lister les alertes' },
			acknowledge: { POST: 'Acquitter une alerte' },
		},
		'api/dashboard': { stats: { GET: 'Statistiques' } },
		health: { default: { GET: "Santé de l'API" } },
	};

	// Nettoyage des segments (on ignore les IDs numériques ou UUID pour matcher la config)
	const segments = path
		.split('/')
		.filter(Boolean)
		.map((s) => (/^\d+$/.test(s) || /^[0-9a-f-]{36}$/i.test(s) ? 'id' : s));

	// Fonction de parcours de l'arbre
	function search(node: any, index: number): string {
		// Si on a épuisé les segments, on cherche dans le 'default' du dernier nœud atteint
		if (index >= segments.length) {
			return node.default?.[method] || '';
		}

		const segment = segments[index];
		const nextNode = node[segment];

		// Si le segment existe, on descend dans l'arbre
		if (nextNode) {
			// Si on a atteint une feuille qui contient la méthode, on retourne la valeur
			if (typeof nextNode === 'object' && nextNode[method]) {
				return nextNode[method];
			}
			// Sinon, on continue de descendre
			return search(nextNode, index + 1);
		}

		// Si on ne trouve pas le segment, on tente de voir si la méthode est définie dans le 'default' courant
		return node.default?.[method] || '';
	}

	return search(descriptions, 0);
}

interface Endpoint {
	path: string;
	method: string;
	description: string;
	parameters: any[];
	requestBody: any;
	responses: Record<string, any>;
	tag: string;
}

function parseSpec(spec: any): Endpoint[] {
	const endpoints: Endpoint[] = [];
	for (const [path, methods] of Object.entries(spec.paths || {})) {
		for (const [method, details] of Object.entries(methods as Record<string, any>)) {
			if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
				const tag = (details as any).tags?.[0] || getTagFromPath(path);
				const desc = (details as any).description || inferDescription(method.toUpperCase(), path);
				endpoints.push({
					path,
					method: method.toUpperCase(),
					description: desc,
					parameters: (details as any).parameters || [],
					requestBody: (details as any).requestBody || null,
					responses: (details as any).responses || {},
					tag,
				});
			}
		}
	}
	return endpoints;
}

function groupByTag(endpoints: Endpoint[]): Record<string, Endpoint[]> {
	const groups: Record<string, Endpoint[]> = {};
	for (const ep of endpoints) {
		if (!groups[ep.tag]) groups[ep.tag] = [];
		groups[ep.tag].push(ep);
	}
	return groups;
}

function renderSchemaExample(schema: any, depth = 0): string {
	if (!schema) return '{}';
	if (schema.type === 'object' && schema.properties) {
		const lines: string[] = ['{'];
		for (const [key, val] of Object.entries(schema.properties as Record<string, any>)) {
			const isRequired = schema.required?.includes(key);
			const prefix = '  '.repeat(depth + 1);
			const example = renderSchemaExample(val, depth + 1);
			lines.push(`${prefix}"${key}": ${example}${isRequired ? ' (required)' : ''},`);
		}
		lines.push('  '.repeat(depth) + '}');
		return lines.join('\n');
	}
	if (schema.type === 'array' && schema.items) {
		return `[\n${'  '.repeat(depth + 1)}${renderSchemaExample(schema.items, depth + 1)}\n${'  '.repeat(depth)}]`;
	}
	if (schema.enum) return `"${schema.enum[0]}"`;
	if (schema.type === 'string') {
		if (schema.format === 'email') return `"user@example.com"`;
		if (schema.format === 'date-time') return `"2026-06-25T00:00:00Z"`;
		return `"string"`;
	}
	if (schema.type === 'integer' || schema.type === 'number') return '0';
	if (schema.type === 'boolean') return 'true';
	return `"value"`;
}

function buildCurlCommand(endpoint: Endpoint, baseUrl: string): string {
	const url = `${baseUrl}${endpoint.path}`;
	let cmd = `curl -X ${endpoint.method} \\\n  "${url}"`;

	if (endpoint.method !== 'GET' && endpoint.requestBody) {
		const schema = endpoint.requestBody.content?.['application/json']?.schema;
		if (schema) {
			const example = renderSchemaExample(schema);
			cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${example}'`;
		}
	}

	cmd += ` \\\n  -H "Cookie: token=<votre_token>" \\\n  --cookie-jar -`;
	return cmd;
}

// Components

function MethodBadge({ method }: { method: string }) {
	const colors = METHOD_COLORS[method] || METHOD_COLORS.GET;
	return (
		<span className={cn('inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-bold tracking-wider uppercase', colors.bg, colors.text, colors.border, 'border')}>
			{method}
		</span>
	);
}

function EndpointCard({ endpoint, baseUrl }: { endpoint: Endpoint; baseUrl: string }) {
	const [expanded, setExpanded] = useState(false);
	const [copied, setCopied] = useState(false);
	const colors = METHOD_COLORS[endpoint.method] || METHOD_COLORS.GET;

	const curlCommand = buildCurlCommand(endpoint, baseUrl);

	const handleCopy = () => {
		navigator.clipboard.writeText(curlCommand);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className={cn('rounded-xl border bg-surface transition-all duration-200', expanded ? 'shadow-md' : 'shadow-sm hover:shadow-md', colors.border)}>
			<button onClick={() => setExpanded(!expanded)} className="flex w-full items-center gap-3 px-5 py-4 text-left">
				<MethodBadge method={endpoint.method} />
				<code className="flex-1 truncate font-mono text-sm text-foreground">{endpoint.path}</code>
				{endpoint.description && <span className="hidden text-sm text-muted-foreground md:block md:max-w-xs lg:max-w-md truncate">{endpoint.description}</span>}
				<ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200', expanded && 'rotate-180')} />
			</button>

			{expanded && (
				<div className="border-t border-border px-5 py-5 space-y-5">
					{endpoint.description && (
						<div>
							<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
							<p className="text-sm text-foreground">{endpoint.description}</p>
						</div>
					)}

					{endpoint.parameters.length > 0 && (
						<div>
							<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Paramètres</h4>
							<div className="rounded-lg border border-border overflow-hidden">
								<table className="w-full text-sm">
									<thead className="bg-muted/50">
										<tr>
											<th className="px-4 py-2 text-left font-medium text-muted-foreground">Nom</th>
											<th className="px-4 py-2 text-left font-medium text-muted-foreground">Type</th>
											<th className="px-4 py-2 text-left font-medium text-muted-foreground">Requis</th>
											<th className="px-4 py-2 text-left font-medium text-muted-foreground">Emplacement</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-border">
										{endpoint.parameters.map((param: any, i: number) => (
											<tr key={i}>
												<td className="px-4 py-2.5 font-mono text-xs">{param.name}</td>
												<td className="px-4 py-2.5 text-xs">{param.schema?.type || 'string'}</td>
												<td className="px-4 py-2.5">
													{param.required ? (
														<Badge variant="default" className="text-[10px] h-5">
															Oui
														</Badge>
													) : (
														<Badge variant="secondary" className="text-[10px] h-5">
															Non
														</Badge>
													)}
												</td>
												<td className="px-4 py-2.5 text-xs capitalize">{param.in}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{endpoint.requestBody && (
						<div>
							<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Corps de la requête (JSON)</h4>
							<div className="rounded-lg bg-muted/30 border border-border p-4 overflow-x-auto">
								<pre className="text-xs font-mono text-foreground">
									{(() => {
										const schema = endpoint.requestBody.content?.['application/json']?.schema;
										return schema ? renderSchemaExample(schema) : '{}';
									})()}
								</pre>
							</div>
						</div>
					)}

					<div>
						<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Réponses</h4>
						<div className="space-y-2">
							{Object.entries(endpoint.responses).map(([code, resp]: [string, any]) => (
								<div key={code} className="flex items-center gap-3 text-sm">
									<Badge variant={code.startsWith('2') ? 'default' : code.startsWith('4') ? 'destructive' : 'secondary'} className="min-w-[3rem] justify-center">
										{code}
									</Badge>
									<span className="text-muted-foreground">{resp.description}</span>
								</div>
							))}
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between mb-2">
							<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exemple cURL</h4>
							<Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 gap-1.5 text-xs">
								{copied ? (
									<>
										<Check className="h-3.5 w-3.5" />
										Copié
									</>
								) : (
									<>
										<Copy className="h-3.5 w-3.5" />
										Copier
									</>
								)}
							</Button>
						</div>
						<div className="rounded-lg bg-primary/5 border border-primary/10 p-4 overflow-x-auto">
							<pre className="text-xs font-mono text-primary whitespace-pre">{curlCommand}</pre>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function TagSection({ tag, endpoints, baseUrl, expanded, onToggle }: { tag: string; endpoints: Endpoint[]; baseUrl: string; expanded: boolean; onToggle: () => void }) {
	const Icon = TAG_ICONS[tag] || TAG_ICONS.default;

	return (
		<div className="rounded-2xl border border-border bg-surface overflow-hidden">
			<button onClick={onToggle} className="flex w-full items-center gap-4 px-6 py-5 text-left hover:bg-muted/30 transition-colors">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
					<Icon className="h-5 w-5 text-primary" />
				</div>
				<div className="flex-1">
					<h3 className="text-h4 font-semibold text-foreground">{tag}</h3>
					<p className="text-small text-muted-foreground mt-0.5">
						{endpoints.length} endpoint{endpoints.length > 1 ? 's' : ''}
					</p>
				</div>
				<Badge variant="secondary" className="hidden sm:inline-flex">
					{endpoints.length}
				</Badge>
				<ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200', expanded && 'rotate-180')} />
			</button>

			{expanded && (
				<div className="border-t border-border px-5 py-5 space-y-3">
					{endpoints.map((ep, i) => (
						<EndpointCard key={`${ep.method}-${ep.path}-${i}`} endpoint={ep} baseUrl={baseUrl} />
					))}
				</div>
			)}
		</div>
	);
}

// Main Page─

export default function ApiDocsPage() {
	const [search, setSearch] = useState('');
	const [methodFilter, setMethodFilter] = useState<string | null>(null);
	const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set(['Auth']));
	const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

	const endpoints = parseSpec(OPENAPI_SPEC);
	const grouped = groupByTag(endpoints);

	const filteredEndpoints = endpoints.filter((ep) => {
		const matchesSearch =
			search === '' || ep.path.toLowerCase().includes(search.toLowerCase()) || ep.description.toLowerCase().includes(search.toLowerCase()) || ep.tag.toLowerCase().includes(search.toLowerCase());
		const matchesMethod = !methodFilter || ep.method === methodFilter;
		return matchesSearch && matchesMethod;
	});

	const filteredGrouped = groupByTag(filteredEndpoints);
	const sortedTags = Object.keys(filteredGrouped).sort();

	const toggleTag = (tag: string) => {
		setExpandedTags((prev) => {
			const next = new Set(prev);
			if (next.has(tag)) next.delete(tag);
			else next.add(tag);
			return next;
		});
	};

	const expandAll = () => setExpandedTags(new Set(sortedTags));
	const collapseAll = () => setExpandedTags(new Set());

	const totalEndpoints = endpoints.length;
	const filteredCount = filteredEndpoints.length;

	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-40 glass border-b border-border">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-col sm:flex-row sm:items-center gap-4">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
								<FileJson className="h-5 w-5 text-primary-foreground" />
							</div>
							<div>
								<h1 className="text-h4 font-bold text-foreground">Documentation API</h1>
								<p className="text-small text-muted-foreground">Pharmacie Hospitalière — v1.0.0</p>
							</div>
						</div>

						<div className="flex-1" />

						<div className="flex items-center gap-2">
							<Globe className="h-4 w-4 text-muted-foreground shrink-0" />
							<Input value={baseUrl} onChange={(e: any) => setBaseUrl(e.target.value)} className="h-9 w-full sm:w-64 text-xs font-mono" placeholder="API Base URL" />
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input value={search} onChange={(e: any) => setSearch(e.target.value)} placeholder="Rechercher un endpoint, une route, une description..." className="pl-10 h-11" />
					</div>

					<div className="flex items-center gap-1.5 flex-wrap">
						{['GET', 'POST', 'PUT', 'DELETE'].map((m) => {
							const colors = METHOD_COLORS[m];
							const active = methodFilter === m;
							return (
								<button
									key={m}
									onClick={() => setMethodFilter(active ? null : m)}
									className={cn(
										'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold uppercase transition-colors border',
										active ? `${colors.bg} ${colors.text} ${colors.border}` : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80',
									)}
								>
									<Circle className={cn('h-2 w-2 fill-current', colors.text)} />
									{m}
								</button>
							);
						})}
					</div>
				</div>

				<div className="mt-4 flex items-center gap-4 text-small text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<Layers className="h-4 w-4" />
						<span>
							{filteredCount} / {totalEndpoints} endpoint
							{totalEndpoints > 1 ? 's' : ''}
						</span>
					</div>
					<Separator orientation="vertical" className="h-4" />
					<div className="flex items-center gap-1.5">
						<Tag className="h-4 w-4" />
						<span>
							{sortedTags.length} groupe{sortedTags.length > 1 ? 's' : ''}
						</span>
					</div>
					<div className="flex-1" />
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" onClick={expandAll} className="h-8 text-xs">
							<Plus className="h-3.5 w-3.5 mr-1" />
							Tout déplier
						</Button>
						<Button variant="ghost" size="sm" onClick={collapseAll} className="h-8 text-xs">
							<Minus className="h-3.5 w-3.5 mr-1" />
							Tout replier
						</Button>
					</div>
				</div>
			</div>

			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
				<div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 flex items-start gap-3">
					<Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
					<div>
						<h3 className="text-sm font-semibold text-primary">Authentification par Cookie</h3>
						<p className="text-small text-muted-foreground mt-1">
							L'API utilise des cookies HttpOnly pour l'authentification. Le navigateur envoie automatiquement le cookie{' '}
							<code className="bg-primary/10 px-1.5 py-0.5 rounded text-xs font-mono">token=&lt;JWT&gt;</code> avec chaque requête. Pas besoin de header Authorization.
						</p>
					</div>
				</div>
			</div>

			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">
				{sortedTags.length === 0 ? (
					<div className="text-center py-16">
						<Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-h4 font-semibold text-foreground">Aucun résultat</h3>
						<p className="text-small text-muted-foreground mt-2">Aucun endpoint ne correspond à votre recherche.</p>
					</div>
				) : (
					sortedTags.map((tag) => <TagSection key={tag} tag={tag} endpoints={filteredGrouped[tag]} baseUrl={baseUrl} expanded={expandedTags.has(tag)} onToggle={() => toggleTag(tag)} />)
				)}
			</main>

			<footer className="border-t border-border bg-surface">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between text-small text-muted-foreground">
					<div className="flex items-center gap-2">
						<Activity className="h-4 w-4" />
						<span>API Pharmacie Hospitalière — OpenAPI 3.0.3</span>
					</div>
					<div className="flex items-center gap-4">
						<span>{totalEndpoints} endpoints</span>
						<span>•</span>
						<span>Cookie JWT</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
