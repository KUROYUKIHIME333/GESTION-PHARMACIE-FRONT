export default function PlaceHolderPage({ pageName }: { pageName: string }) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#eff3f5]">
			<h1 className="text-2xl font-bold text-gray-800">Bienvenue sur le {pageName}</h1>
			<p className="mt-4 text-gray-600">Ceci est la page principale du {pageName}.</p>
			<p className="mt-4 text-gray-600">Il s&apos;agit d&apos;une page de substitution pendant le developpent de cette fonctionnalité.</p>
		</div>
	);
}
