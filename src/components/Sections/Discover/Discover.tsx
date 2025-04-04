import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import onboarding1 from "../../../assets/images/on_boarding_2.png"
import InfoText from '@/components/Blocks/InfoText/InfoText'



const SectionDiscover = () => {
	return (
		<section className='section_create section_text'>
			<h2 className='section_create__header'>Explore activities</h2>
			<div className="section__content">
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: onboarding1.src, 
							alt: 'Explore activities',
							pos: 'rt'
						}}
					>
						<InfoText 
							header="Explore Nearby"
							text={[
								"Discover last-minute plans nearby, find something that sparks your interest", 
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionDiscover