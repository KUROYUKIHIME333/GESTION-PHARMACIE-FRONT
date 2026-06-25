import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../providers/auth.provider';
import { QueryProvider } from '../providers/query.provider';
import './globals.css';

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
});

export const metadata: Metadata = {
	title: 'Pharmacie Hospitalière',
	description: 'Système de gestion de pharmacie hospitalière',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr" className={inter.variable}>
			<body className="font-sans">
				<QueryProvider>
					<AuthProvider>{children}</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
