'use client'
import { useAppContext } from '@/hooks/useAppContext'
import './about.scss'
import BlockInfo from '@/components/Blocks/Info/BlockInfo'
import image1 from "../../../assets/images/social_interaction_2.svg"
import InfoText from '@/components/Blocks/InfoText/InfoText'

const SectionAbout = () => {
	const { lang } = useAppContext()

	return (
		<section className='section_about section_text'>
			<div className="section__content">
				<div className="container_page container_content">
					<h1>{lang === 'en' ? 'About Datemarks' : 'FR About Us'}</h1>
					<BlockInfo 
						img={{
							src: image1, 
							alt: 'Two people use their smartphones for social interaction',
							pos: 'rt'
						}}
					>
						<InfoText
							text={[
								"Datemarks is your go-to event-based app designed to seamlessly connect people through shared experiences. Discover and create meaningful events, effortlessly bringing individuals together for memorable moments. Whether it's social gatherings, meetups, or special occasions, Datemarks fosters connections and enriches lives, making every event a chance to create lasting memories.", 
								"Datemarks is a dynamic platform, managed by an independent subsidiary of private company. Our team is fuelled by passion, dedicated to our craft, and collectively excited about exploring new horizons alongside our users."
							]}
						/>
					</BlockInfo>
				</div>
			</div>
		</section>
	)
}

export default SectionAbout