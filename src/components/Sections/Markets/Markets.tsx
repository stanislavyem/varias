import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import image1 from "../../../assets/images/market.png" 
import './markets.scss'
import InfoMarkets from '@/components/Blocks/InfoMarkets/InfoMarkets'
import appStore from '../../../assets/images/app_store_white.svg'
import playMarket from '../../../assets/images/play_market_white.svg'


const SectionMarkets = () => {
	return (
		<section className='section_markets section_text'>
			<div className="section__content">
				<h2 className='section_markets__header'>Let the unexpected unfold</h2>
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: image1 as unknown as string, 
							alt: '!!!',
							pos: 'rt'
						}}
					>
						<InfoMarkets
							header="Let the unexpected unfold"
							text={[
								"The best moments are often unplanned", 
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

export default SectionMarkets