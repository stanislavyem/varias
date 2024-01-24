'use client'
import { useAppContext } from '@/hooks/useAppContext'
import './about.scss'


const SectionAbout = () => {
	const { lang } = useAppContext()

	return (
		/* eslint-disable quotes */
		<section className='section_about'>
			<div className="section__content section_text">
				<div className="container_page container_content">
					<h1>{lang === 'en' ? 'About Us' : 'FR About Us'}</h1>
					<p>{lang === 'en' ? "Datemarks is your go-to event-based app designed to seamlessly connect people through shared experiences. Discover and create meaningful events, effortlessly bringing individuals together for memorable moments. Whether it's social gatherings, meetups, or special occasions, Datemarks fosters connections and enriches lives, making every event a chance to create lasting memories." : "FR text"}</p>
					<p>{lang === 'en' ? "Datemarks is a dynamic platform, managed by an independent subsidiary of private company. Our team is fuelled by passion, dedicated to our craft, and collectively excited about exploring new horizons alongside our users." : "FR text"}</p>
				</div>
			</div>
		</section>
	)
}

export default SectionAbout