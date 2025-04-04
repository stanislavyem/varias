// import LangSw from '../LangSw/LangSw'
import Link from 'next/link'
import Nav from '../Nav/Nav'
import ThemeSw from '../ThemeSw/ThemeSw'
import './header.scss'
import { linkHome } from '@/assets/js/consts'
import logo from '../../assets/images/ic_app_logo.png'
import Image from 'next/image'
import { makeImageSizes } from '@/assets/js/tools'
// import Link from 'next/link'
// import { homeLink } from '@/assets/js/consts'
import appStore from '@/assets/images/app_store_white.svg'
import playMarket from '@/assets/images/play_market_white.svg'

// const Header = () => {
// 	return (
// 		<header>
// 			<div className="container_page container_content header__content flex justify-between items-center py-2">
// 				{/* Logo & Company Name */}
// 				<Link className="header__company flex items-center gap-2" href={linkHome}>
// 					<div className="logo-wrapper relative w-[35px] sm:w-[40px] md:w-[50px] h-auto">
// 						<Image 
// 							className="header__logo"
// 							src={logo.src} 
// 							fill
// 							alt="Our logo"
// 							sizes={makeImageSizes({ start: "35px", sm: "40px", md: "50px" })}
// 							loading="lazy"
// 						/>
// 					</div>
// 					<span className="text-xl md:text-2xl font-bold">Datemarks</span>
// 				</Link>

// 				{/* App Store & Play Store Links */}
// 				<div className="flex items-center gap-3">
// 					<a href="https://apps.apple.com/ca/app/datemarks/id6496861002" target="_blank" rel="noopener noreferrer" className="flex items-center">
// 						<Image 
// 							src={appStore.src} 
// 							alt="Apple Store" 
// 							width={120} 
// 							height={40} 
// 							className="store-badge h-auto"
// 						/>
// 					</a>
// 					<a href="https://play.google.com/store/apps/details?id=com.datemarks.android" target="_blank" rel="noopener noreferrer" className="flex items-center">
// 						<Image 
// 							src={playMarket.src} 
// 							alt="Play Store" 
// 							width={120} 
// 							height={40} 
// 							className="store-badge h-auto"
// 						/>
// 					</a>
// 				</div>
// 			</div>
// 		</header>
// 	);
// };

// Simple header without store links
const Header = () => {
	return (
		<header>
			<div className="container_page container_content header__content">
				<Link className='header__company flex items-center gap-1' href={linkHome}>
					<div className="logo-wrapper relative">
						<Image 
							className='header__logo'
							src={logo.src} 
							fill
							alt='Our logo'
							sizes={makeImageSizes({start: '35px', sm: '40px', md: '50px' })}
							loading='lazy'
						/>
					</div>
					<span className="text-xl md:text-2xl font-bold">Datemarks</span>
					
				</Link>
			</div>
		</header>
	)
}

// Header with language and theme
// const Header = () => {
// 	return (
// 		<header>
// 			<div className="container_page container_content header__content">
// 				<div className="logo-wrapper mr-auto">
// 					<Link href="">
// 						<Image 
// 							className='header__logo w-10'
// 							src={logo.src} 
// 							fill
// 							alt='Our logo'
// 							sizes={makeImageSizes({start: '35px', sm: '40px', md: '50px' })}
// 							loading='lazy'
// 						/>
// 					</Link>
// 				</div>
				
// 				<Link className='header__company' href={linkHome}>datemarks</Link>

// 				{/* <Nav/> */}

// 				{/* <div className="lang-sw-wrapper me-3 h-full flex items-center">
// 					<LangSw />
// 				</div> */}
				
// 				{/* <div className="theme-sw-wrapper h-full flex items-center">
// 					<ThemeSw />
// 				</div> */}
// 			</div>
// 		</header>
// 	)
// }


export default Header