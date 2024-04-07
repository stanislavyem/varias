import Image from 'next/image'
import './footer.scss'
import { svgs } from '@/assets/icons/svgs'
import appStore from '../../assets/images/app_store.webp'
import playMarket from '../../assets/images/play_market.webp'
import Link from 'next/link'
import { linkAbout, linkHome, linkPrivacy, linkTerms } from '@/assets/js/consts'

const Footer = () => {
	return (
		<footer>
			<div className="container_page container_content">
				{/* <div className="links">
					<div className="socials">
						<a href="https://www.facebook.com" target="_blank" aria-label="Open the link to the Facebook profile in a new window">
							<div className="img-wrapper">
								{svgs().iconFb}
							</div>
						</a>
						<a href="https://www.instagram.com" target="_blank" aria-label="Open the link to the Instagram profile in a new window">
							<div className="img-wrapper">
								{svgs().iconInstagram}
							</div>
						</a>
						<a href="https://www.linkedin.com" target="_blank" aria-label="Open the link to the LinkedIn profile in a new window">
							<div className="img-wrapper">
								{svgs().iconLinkedIn}
							</div>
						</a>
					</div>
					<div className="markets">
						<a href="https://www.apple.com" target="_blank" aria-label='Open the link in a new window'>
							<div className="img-wrapper">
								<Image 
									src={appStore.src}
									height={45}
									width={155}
									alt='App store'
								/>
							</div>
						</a>
						<a href="https://www.google.com" target="_blank" aria-label='Open the link in a new window'>
							<div className="img-wrapper">
								<Image 
									src={playMarket.src}
									height={45}
									width={155}
									alt='Play market'
								/>
							</div>
						</a>
					</div>
				</div> */}
				<div className="disclaimer">
					<p>By accessing this website, you agree to the Datemarks <Link href={linkTerms}>Terms of Service</Link> and <Link href={linkPrivacy}>Privacy Policy</Link>.</p>
					<div role='navigation'>
						<Link href={linkAbout}>About Us </Link> | <Link href={linkPrivacy}> Privacy Policy </Link> | <Link href={linkTerms}> Terms and Conditions </Link>
					</div>
				</div>
				<div className="copyright">
					<p>Copyright © 2024 <Link href={linkHome}>Datemarks</Link></p>
				</div>
			</div>
		</footer>
	)
}


export default Footer