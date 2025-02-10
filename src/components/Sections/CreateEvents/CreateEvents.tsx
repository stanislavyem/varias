import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import demo from "../../../assets/images/demo.webp"
import './_create-events.scss'

import Image from 'next/image'
import appStore from '../../../assets/images/app_store.webp'
import playMarket from '../../../assets/images/play_market.webp'

const SectionCreateEvents = () => {
	return (
		<section className='section_create-events section_text'>
			<div className="section__content">
				<div className="container_page container_content">
					<BlockInfo
						img={{
							src: demo as unknown as string,
							alt: '!!!',
							pos: 'rt'
						}}
					>
						<DownloadButtons />
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

const DownloadButtons = () => {
	return (
		<div className="text-center space-y-20">
			<h3 className="text-3xl font-semibold">Invite The Experience - because amazing moments can't always be planned.</h3>
			<div className="flex justify-center gap-4">
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
				<a href="https://play.google.com/store/apps/details?id=com.datemarks.android" target="_blank" aria-label='Open the link in a new window'>
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
		</div>
	)
}

export default SectionCreateEvents