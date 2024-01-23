'use client'
import Link from "next/link"
import { usePathname } from 'next/navigation'

const NotFound = () => {
	const pathName = usePathname()
	return (
		<div>
			<h2>Not Found</h2>
			<p>Could not find requested resource: {pathName}</p>
			<Link href='/'>Return Home</Link>
		</div>
	)
}

export default NotFound