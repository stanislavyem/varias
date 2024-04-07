import type { Metadata } from "next";
import '../assets/css/global.scss'
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Context } from "@/providers/Context";
import ModalWrapper from "@/components/ModalWrapper/ModalWrapper";
import Homer from "@/components/Homer/Homer";



export const metadata: Metadata = {
	title: {
		default: 'DateMarks',
		template: '%s | DateMarks'
	},
	
	description: "Datemarks - Invite The Experience",
	keywords: ['Datemarks', 'dates', 'events'],
	authors: [{ name: 'Max', url: 'https://postnikov.dev' }],
	creator: 'Max Postnikov | https://postnikov.dev',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<head>
				<link rel="apple-touch-icon" sizes="57x57" href="./apple-icon-57x57.png" />
				<link rel="apple-touch-icon" sizes="60x60" href="./apple-icon-60x60.png" />
				<link rel="apple-touch-icon" sizes="72x72" href="./apple-icon-72x72.png" />
				<link rel="apple-touch-icon" sizes="76x76" href="./apple-icon-76x76.png" />
				<link rel="apple-touch-icon" sizes="114x114" href="./apple-icon-114x114.png" />
				<link rel="apple-touch-icon" sizes="120x120" href="./apple-icon-120x120.png" />
				<link rel="apple-touch-icon" sizes="144x144" href="./apple-icon-144x144.png" />
				<link rel="apple-touch-icon" sizes="152x152" href="./apple-icon-152x152.png" />
				<link rel="apple-touch-icon" sizes="180x180" href="./apple-icon-180x180.png" />
				<link rel="icon" type="image/png" sizes="192x192"  href="./android-icon-192x192.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="96x96" href="./favicon-96x96.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png" />
				<link rel="manifest" crossOrigin="use-credentials" href="./manifest.json" />
				<link rel="mask-icon" href="./safari-pinned-tab.svg" color="#0e7040" />
				<meta name="msapplication-TileColor" content="#0e7040" />
				<meta name="theme-color" content="#0e7040" />
				{/* <link rel="preload" href="..assets/fonts/Inter-Regular.woff2" as="font" type="font/woff2" />
				<link rel="preload" href="./assets/fonts/Inter-SemiBold.woff2" as="font" type="font/woff2" />
				<link rel="preload" href="./assets/fonts/Inter-Bold.woff2" as="font" type="font/woff2" /> */}
			</head>
			<body className="flex flex-col min-h-dvh">
				<div id="skiper"><a href="#maincontent" role='button'>Skip to main content</a></div>
				<Context> 
					<Homer />
					<ModalWrapper />
					<Header />
					<main id='#maincontent'>
						{children}
					</main>
					<Footer />
				</Context>
			</body>
		</html>
	);
}
