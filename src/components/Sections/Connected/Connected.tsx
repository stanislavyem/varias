import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import image1 from "../../../assets/images/connected_1.svg"
import './connected.scss'
import InfoText from '@/components/Blocks/InfoText/InfoText'


const SectionConnected = () => {
	return (
		<section className='section_connected section_text'>
			<div className="section__content">
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: image1, 
							alt: '!!!',
							pos: 'rt'
						}}
					>
						<InfoText
							header="Header"
							text={[
								"Stay connected with fellow event-goers through our real-time messaging feature. Discuss event details, share recommendations, and build a vibrant community around your shared interests.", 
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionConnected