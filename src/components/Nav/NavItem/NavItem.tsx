'use client'
import Link from 'next/link';
import './nav-item.scss'
import { usePathname } from 'next/navigation'
import { INavItem } from '@/interfaces';
import { useAppContext } from '@/hooks/useAppContext';


const NavItem: React.FC<{item: INavItem}> = ({item}): JSX.Element => {
	const pathName: string = usePathname()
	const { lang } = useAppContext()

	return (
		<li className={`nav-item ${pathName === item.link ? 'active' : ''}`} key={item.link}>
			<Link href={`${item.link}`}>{item.title[lang]}</Link>
		</li>
	)
}


export default NavItem;