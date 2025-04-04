import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import demo from "../../../assets/images/demo.png"
import Image from 'next/image'
import appStore from '../../../assets/images/app_store.svg'
import playMarket from '../../../assets/images/play_market.svg'
import InfoMarkets from '@/components/Blocks/InfoMarkets/InfoMarkets'

const SectionHero = () => {
	return (
		<section className='section_create section_text'>
			<div className="section__content">
				<h2 className='section_create__header'>Invite The Experience</h2>
				<div className="container_page container_content">
					<BlockInfo
						img={{
							src: demo as unknown as string,
							alt: '!!!',
							pos: 'rt'
						}}
					>
						<InfoMarkets
							header="Invite The Experience"
							text={[
								"Amazing moments can't always be planned", 
							]}
							links={[
								{src: appStore as unknown as string, alt: 'Apple Store', href: 'https://apps.apple.com/ca/app/datemarks/id6496861002'}, 
								{src: playMarket as unknown as string, alt: 'Play market', href: 'https://play.google.com/store/apps/details?id=com.datemarks.android'}
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionHero