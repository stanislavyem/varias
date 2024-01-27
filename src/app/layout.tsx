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
	
	description: "Datemarks - app for create and attend events",
	keywords: ['DateMarks', 'meetings', 'events'],
	authors: [{ name: 'Stas Yem', url: 'https://StasYem.com' }, { name: 'Max', url: 'https://postnikov.dev' }],
	creator: 'Max Postnikov | https://postnikov.dev',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<head>
				<link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png" />
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
