import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import onboarding2 from "../../../assets/images/on_boarding_1.png"
import InfoText from '@/components/Blocks/InfoText/InfoText'
import './create.scss'

const SectionEvents = () => {
	return (
		<section className='section_create section_text'>
			<div className="section__content">
			<h2 className='section_create__header'>Create Activities</h2>
				<div className="container_page container_content">
					<BlockInfo 
						img={{
							src: onboarding2.src, 
							alt: 'Create activities',
							pos: 'lt'
						}}
					>
						<InfoText 
							header="Create Activities"
							text={[
								"Make the most of your time by creating last-minute plans and inviting others to join", 
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionEvents