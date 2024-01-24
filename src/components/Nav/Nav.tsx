import './nav.scss'
import { INavItem } from '@/interfaces';
import NavItem from './NavItem/NavItem';
import NavLogin from './NavLogin/NavLogin';
import { linkAbout, linkHome, linkPrivacy, linkTerms } from '@/assets/js/consts';


export const navItems: INavItem[] = [
	{
		title: {
			en: 'Home',
			fr: 'FR Home',
		},
		link: linkHome,
		
	},
	{
		title: {
			en: 'Privacy',
			fr: 'FR Privacy',
		},
		link: linkPrivacy
	},
	{
		title: {
			en: 'Terms',
			fr: 'FR Terms',
		},
		link: linkTerms
	},
	{
		title: {
			en: 'About Us',
			fr: 'FR About Us',
		},
		link: linkAbout
	},
	// {
	// 	title: {
	// 		en: 'Login',
	// 		fr: 'FR Login',
	// 	},
	// 	link: '/login'
	// },
	// {
	// 	title: {
	// 		en: 'Register',
	// 		fr: 'FR Register',
	// 	},
	// 	link: '/register'
	// },

]

const Nav = (): JSX.Element => {
	return (
		<nav>
			<ul className='nav-list_desktop' role='navigation'>
				{navItems.map(item => (
					<NavItem key={item.link} item={item}/>
				))}
				{/* <NavLogin /> */}
			</ul>
		</nav>
	)
}


export default Nav;