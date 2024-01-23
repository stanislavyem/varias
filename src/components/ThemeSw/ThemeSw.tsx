'use client'
import { useEffect, useRef,useMemo } from "react";
import cloud from "./theme_day__cloud.svg";
import star from "./theme_nigth__star.svg";
import "./theme-sw.scss";
import React from 'react'
import { useAppContext } from "../../hooks/useAppContext";

type ICloud = {
    width: number
    gap: number
    top: number
    speed: number
    opacity: number
}


interface IParams {
	width: number
	height: number
	circleSize: number
	duration: number
	numberOfStars: number
	clouds: ICloud[]
	isChanging: boolean
	saveState: string
	typesOfBlink: number
}

const ThemeSw: React.FC = (): JSX.Element => {

	const {lang, theme, setTheme} = useAppContext()

	const _themeSwitcher = useRef<HTMLButtonElement>(null);
	const _contentSwitcher = useRef<HTMLDivElement>(null);


	const state = useRef({
		isChanging: false,
	}) 

	const params: IParams = useMemo(() => (
		{
			width: 70,
			height: 40,
			circleSize: 14,
			duration: 2000,
			numberOfStars: 30,
			saveState: "theme",
			typesOfBlink: 6,
			isChanging: false,
			clouds: [ //default styles for clouds
				{
					width: 30, //px
					gap: 15, //px
					top: 0, //in percent of height
					speed: 7, //sec for 1 cycle, less -> faster
					opacity: 1, //transparent for line
				},
				{
					width: 25,
					gap: 20,
					top: 25,
					speed: 4,
					opacity: 0.85,
				},
				{
					width: 20,
					gap: 20,
					top: 40,
					speed: 5,
					opacity: 0.7,
				},
			]
		}
	), [])



	useEffect(() => {
		state.current.isChanging = true;
		if (theme === "light") {
			classSwitcher("", "theme_light_1", 0)
			.then(() => classSwitcher("theme_light_1", "theme_light_2", (params.duration || 1)/ 4))
			.then(() => {classSwitcher("theme_light_2", "theme_light", 30)})
			.then(() => {state.current.isChanging = false});
		} 
		if (theme === 'dark') {
			classSwitcher("theme_light", "theme_light_back_1", 0)
			.then(() => classSwitcher("theme_light_back_1", "theme_light_back_2", (params.duration || 1) / 4))
			.then(() => {classSwitcher("theme_light_back_2", "", 30)})
			.then(() => {state.current.isChanging = false});
		} 
	},[theme])




	const classSwitcher = (classRemove: string, classAdd: string, delay: number): Promise<void> => { //class +/- for _contentSwitcher using delay
		return new Promise((res) => {
			setTimeout((): void => {
				classRemove && _contentSwitcher.current?.classList.remove(classRemove);
				classAdd && _contentSwitcher.current?.classList.add(classAdd);
				res();
			}, delay);
		});
	};

	
	const onThemeClick = () => {
		if (state.current.isChanging) return
		setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
	};
 

	const stars = useMemo(() => {
		return new Array(params.numberOfStars).fill('').map((item,index)=> {
			let size = Math.floor(Math.random()*20 + 1);
			size = size > 13 ? Math.floor(size / 3) : size; //to create more small stars than big
			const x = Math.floor(Math.random() * (params.width as number))
			const y = Math.floor(Math.random() * (params.height as number))
			const typeOfBlink = Math.floor(Math.random() * (params.typesOfBlink as number))//different duration of blinking
			return (
				<img 
					className={`theme_dark__star-${typeOfBlink}`} 
					key={index}
					alt="" 
					aria-hidden
					src={star.src}
					style={{
						left: `${x}px`, 
						top: `${y}px`, 
						width: `${size}px`, 
					}}/>
			)
		})
	}, [])
	



	const clouds = useMemo(() => {
		const listOfClouds: string[] = new Array(Math.ceil((params.width) / (params.clouds[params.clouds.length - 1].width + params.clouds[params.clouds.length - 1].gap) + 2)).fill(""); //list of clouds in a cloud-raw, depends on the cloud size and gap between clouds + some reserve
		return params.clouds?.map((line, index: number) => (
			<div className={`clouds-${index}`} key={index}>
				{listOfClouds.map((item,index) => <img className="cloud" aria-hidden src={cloud.src} alt="" key={index}/>)}
			</div>
		))
	}, [])
	



	const themeSwitcherMemo = useMemo(() => {
		return (
			<>
				<button 
					ref={_themeSwitcher}
					className="switcher_theme button_nostyle"
					onClick={onThemeClick}
					aria-label={lang === 'en' ? `Switch the site theme` : `FRFRFR`}
				>
					<div className={`switcher_theme__content ${theme !== "dark" ? "theme_light" : ""}`} ref={_contentSwitcher}>
						<div className="dark" aria-hidden>{stars}</div>
						<div className="light" aria-hidden>{clouds}</div>
					</div>
				</button>
			</>
		)
	}, [lang])



	return themeSwitcherMemo;
};


  
export default ThemeSw

