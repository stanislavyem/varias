import './discover.scss'
import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import image1 from "../../../assets/images/discover_1.svg"
import InfoText from '@/components/Blocks/InfoText/InfoText'



const SectionDiscover = () => {
	return (
		<section className='section_discover section_text'>
			<div className="section__content">
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: image1, 
							alt: 'Man is swiping image right',
							pos: 'rt'
						}}
					>
						<InfoText 
							header="Header"
							text={[
								"Easily discover  exciting events by swiping  right to express interest or left to explore more options", 
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionDiscover