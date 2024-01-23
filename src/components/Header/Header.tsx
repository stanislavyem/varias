// import LangSw from '../LangSw/LangSw'
import Link from 'next/link'
import Nav from '../Nav/Nav'
// import ThemeSw from '../ThemeSw/ThemeSw'
import './header.scss'
import { homeLink } from '@/assets/js/consts'
// import logo from '@/assets/images/logo.png'
// import Image from 'next/image'
// import { makeImageSizes } from '@/assets/js/tools'
// import Link from 'next/link'
// import { homeLink } from '@/assets/js/consts'

const Header = () => {
	return (
		<header>
			<div className="container_page container_content header__content">
				<Link className='header__company' href={homeLink}>Datemarks</Link>
				{/* <div className="logo-wrapper mr-auto relative">
					<Link href={homeLink}>
						<Image 
							className='header__logo w-10'
							src={logo.src} 
							fill
							alt='Our logo'
							sizes={makeImageSizes({start: '35px', sm: '40px', md: '50px' })}
							loading='lazy'
						/>
					</Link>
				</div> */}
				
				<Nav/>

				{/* <div className="lang-sw-wrapper me-3 h-full flex items-center">
					<LangSw />
				</div> */}
				
				{/* <div className="theme-sw-wrapper h-full flex items-center">
					<ThemeSw />
				</div> */}
			</div>
		</header>
	)
}


export default Header