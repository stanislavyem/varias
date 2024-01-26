import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import image1 from "../../../assets/images/mobiles_1.webp" 
import './markets.scss'
import InfoMarkets from '@/components/Blocks/InfoMarkets/InfoMarkets'
import appStore from '../../../assets/images/app_store.webp'
import playMarket from '../../../assets/images/play_market.webp'


const SectionMarkets = () => {
	return (
		<section className='section_markets section_text'>
			<div className="section__content">
				<h2 className='section_markets__header'>Our Mobile App is Available!</h2>
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: image1 as unknown as string, 
							alt: '!!!',
							pos: 'rt'
						}}
					>
						<InfoMarkets
							header="Our Mobile App is Available!"
							text={[
								"Free Download Our App", 
							]}
							links={[
								{src: appStore as unknown as string, alt: 'Apple Store', href: 'https://apple.com'}, 
								{src: playMarket as unknown as string, alt: 'Play market', href: 'https://google.com'}
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionMarkets