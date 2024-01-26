import "./svgs.scss";

//addClass - additional class for icon

export const svgs = (addClass?: string): Record<string, JSX.Element> => {
	return {
		iconClose: (
			<svg
				className={`svg icon_close ${addClass}`}
				width="32"
				height="32"
				viewBox="0 0 32 32"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					stroke="#FFF"
					clipRule="evenodd"
					d="M16 31C24.2843 31 31 24.2843 31 16C31 7.71573 24.2843 1 16 1C7.71573 1 1 7.71573 1 16C1 24.2843 7.71573 31 16 31Z"
					strokeWidth="2"
				/>
				<path d="M9 9L24 24" strokeWidth="2" strokeLinecap="square" />
				<path
					d="M8.49512 23.4586L24.5049 9.54144"
					strokeWidth="2"
					strokeLinecap="square"
				/>
			</svg>
		),
		iconExclamation: (
			<svg
				className={`svg icon_exclamation ${addClass}`}
				width="26"
				height="26"
				viewBox="0 0 26 26"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clipPath="url(#clip0_2_167)">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M13 0C5.824 0 0 5.824 0 13C0 20.176 5.824 26 13 26C20.176 26 26 20.176 26 13C26 5.824 20.176 0 13 0ZM13 14.3C12.285 14.3 11.7 13.715 11.7 13V7.8C11.7 7.085 12.285 6.5 13 6.5C13.715 6.5 14.3 7.085 14.3 7.8V13C14.3 13.715 13.715 14.3 13 14.3ZM14.3 19.5H11.7V16.9H14.3V19.5Z"
						fill="#D50404"
					/>
				</g>
				<defs>
					<clipPath id="clip0_2_167">
						<rect width="26" height="26" fill="white" />
					</clipPath>
				</defs>
			</svg>
		),
		iconHomer: (
			<svg className={`svg icon_homer ${addClass}`} width="16" height="25" viewBox="0 0 16 25" xmlns="http://www.w3.org/2000/svg">
				<path d="M7.31719 23.7322C7.71856 24.1116 8.35148 24.0937 8.73084 23.6924L14.9129 17.1516C15.2923 16.7502 15.2745 16.1173 14.8731 15.7379C14.4717 15.3586 13.8388 15.3764 13.4594 15.7778L7.96424 21.5918L2.15022 16.0966C1.74885 15.7172 1.11593 15.7351 0.73657 16.1365C0.357206 16.5378 0.375048 17.1707 0.776422 17.5501L7.31719 23.7322ZM6.36655 0.404461L7.00449 23.0336L9.00369 22.9773L8.36576 0.348102L6.36655 0.404461Z"/>
			</svg>
		),
		iconFb: (
			<svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M23.7333 31H9.26667C4.72 31 1 27.4 1 23V9C1 4.6 4.72 1 9.26667 1H23.7333C28.28 1 32 4.6 32 9V23C32 27.4 28.28 31 23.7333 31Z" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
				<path d="M24 15H19V12.2C19 11.5 19.5 11 20.2 11H23V6H19C16.2 6 14 8.2 14 11V15H10V20H14V30H19V20H22L24 15Z" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
			</svg>
		),
		iconInstagram: (
		<svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="31" height="31" fill="#F5F5F5"/>
			<rect width="1440" height="3642" transform="translate(-223 -3041)" fill="white"/>
			<rect x="-223" y="-42" width="1440" height="219" fill="black"/>
			<mask id="path-2-inside-1_0_1" fill="white">
			<path fillRule="evenodd" clipRule="evenodd" d="M9.09797 0.19023C6.57475 0.304078 4.38776 0.920973 2.62182 2.67946C0.849702 4.44719 0.240469 6.64284 0.126338 9.13982C0.0553914 10.6983 -0.359467 22.4724 0.843535 25.5601C1.65479 27.6432 3.25258 29.2449 5.35475 30.0588C6.33566 30.4403 7.45541 30.6986 9.09797 30.774C22.8322 31.3955 27.9234 31.0571 30.0703 25.5601C30.4512 24.5816 30.7134 23.4629 30.7859 21.8244C31.4136 8.0549 30.6841 5.07028 28.2905 2.67946C26.3919 0.785581 24.1586 -0.503627 9.09797 0.19023ZM9.22441 28.0047C7.72065 27.937 6.90478 27.6864 6.36035 27.4757C4.99078 26.9434 3.96206 25.9189 3.43305 24.5573C2.51692 22.2111 2.82077 11.0678 2.90251 9.26469C2.98271 7.4985 3.34052 5.88432 4.5867 4.63816C6.12901 3.09966 8.12166 2.34565 21.6894 2.95798C23.4599 3.03797 25.0778 3.39506 26.3271 4.63816C27.8694 6.17664 28.6344 8.18462 28.0113 21.7003C27.9434 23.2003 27.6921 24.0142 27.4808 24.5573C26.085 28.1343 22.8738 28.6309 9.22441 28.0047ZM21.839 7.26892C21.839 8.28741 22.6672 9.1156 23.6898 9.1156C24.7123 9.1156 25.5421 8.28741 25.5421 7.26892C25.5421 6.25044 24.7123 5.42299 23.6898 5.42299C22.6672 5.42299 21.839 6.25044 21.839 7.26892ZM7.53713 15.4813C7.53713 19.8445 11.0829 23.382 15.4569 23.382C19.8309 23.382 23.3767 19.8445 23.3767 15.4813C23.3767 11.1182 19.8309 7.583 15.4569 7.583C11.0829 7.583 7.53713 11.1182 7.53713 15.4813ZM10.3164 15.4813C10.3164 12.6505 12.6175 10.3538 15.4569 10.3538C18.2963 10.3538 20.5974 12.6505 20.5974 15.4813C20.5974 18.3137 18.2963 20.6112 15.4569 20.6112C12.6175 20.6112 10.3164 18.3137 10.3164 15.4813Z"/>
			</mask>
			<path fillRule="evenodd" clipRule="evenodd" d="M9.09797 0.19023C6.57475 0.304078 4.38776 0.920973 2.62182 2.67946C0.849702 4.44719 0.240469 6.64284 0.126338 9.13982C0.0553914 10.6983 -0.359467 22.4724 0.843535 25.5601C1.65479 27.6432 3.25258 29.2449 5.35475 30.0588C6.33566 30.4403 7.45541 30.6986 9.09797 30.774C22.8322 31.3955 27.9234 31.0571 30.0703 25.5601C30.4512 24.5816 30.7134 23.4629 30.7859 21.8244C31.4136 8.0549 30.6841 5.07028 28.2905 2.67946C26.3919 0.785581 24.1586 -0.503627 9.09797 0.19023ZM9.22441 28.0047C7.72065 27.937 6.90478 27.6864 6.36035 27.4757C4.99078 26.9434 3.96206 25.9189 3.43305 24.5573C2.51692 22.2111 2.82077 11.0678 2.90251 9.26469C2.98271 7.4985 3.34052 5.88432 4.5867 4.63816C6.12901 3.09966 8.12166 2.34565 21.6894 2.95798C23.4599 3.03797 25.0778 3.39506 26.3271 4.63816C27.8694 6.17664 28.6344 8.18462 28.0113 21.7003C27.9434 23.2003 27.6921 24.0142 27.4808 24.5573C26.085 28.1343 22.8738 28.6309 9.22441 28.0047ZM21.839 7.26892C21.839 8.28741 22.6672 9.1156 23.6898 9.1156C24.7123 9.1156 25.5421 8.28741 25.5421 7.26892C25.5421 6.25044 24.7123 5.42299 23.6898 5.42299C22.6672 5.42299 21.839 6.25044 21.839 7.26892ZM7.53713 15.4813C7.53713 19.8445 11.0829 23.382 15.4569 23.382C19.8309 23.382 23.3767 19.8445 23.3767 15.4813C23.3767 11.1182 19.8309 7.583 15.4569 7.583C11.0829 7.583 7.53713 11.1182 7.53713 15.4813ZM10.3164 15.4813C10.3164 12.6505 12.6175 10.3538 15.4569 10.3538C18.2963 10.3538 20.5974 12.6505 20.5974 15.4813C20.5974 18.3137 18.2963 20.6112 15.4569 20.6112C12.6175 20.6112 10.3164 18.3137 10.3164 15.4813Z" fill="white" stroke="white" strokeWidth="2" mask="url(#path-2-inside-1_0_1)"/>
		</svg>
		),
		iconLinkedIn: (
			<svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M3.22917 0.5H27.7708C29.2753 0.5 30.5 1.72475 30.5 3.22917V27.7708C30.5 29.2753 29.2753 30.5 27.7708 30.5H3.22917C1.72475 30.5 0.5 29.2753 0.5 27.7708V3.22917C0.5 1.72475 1.72475 0.5 3.22917 0.5ZM27.7708 30.2083C29.1152 30.2083 30.2083 29.1152 30.2083 27.7708V3.22917C30.2083 1.88482 29.1152 0.791667 27.7708 0.791667H3.22917C1.88482 0.791667 0.791667 1.88482 0.791667 3.22917V27.7708C0.791667 29.1152 1.88482 30.2083 3.22917 30.2083H27.7708Z" fill="white" stroke="white"/>
				<path d="M5.81251 12.4167H5.31251V12.9167V25.1875V25.6875H5.81251H8.39584H8.89584V25.1875V12.9167V12.4167H8.39584H5.81251ZM9.18751 12.125V25.9792H5.02084V12.125H9.18751Z" fill="white" stroke="white"/>
				<path d="M4.375 7.10417C4.375 5.59975 5.59975 4.375 7.10417 4.375C8.60859 4.375 9.83333 5.59975 9.83333 7.10417C9.83333 8.60859 8.60859 9.83333 7.10417 9.83333C5.59975 9.83333 4.375 8.60859 4.375 7.10417ZM4.66667 7.10417C4.66667 8.44852 5.75982 9.54167 7.10417 9.54167C8.44852 9.54167 9.54167 8.44852 9.54167 7.10417C9.54167 5.75982 8.44852 4.66667 7.10417 4.66667C5.75982 4.66667 4.66667 5.75982 4.66667 7.10417Z" fill="white" stroke="white"/>
				<path d="M16.2917 12.2166V13.0032L17.0039 12.6693C17.779 12.306 18.5722 12.125 19.375 12.125C23.3723 12.125 26.625 15.3777 26.625 19.375V25.9792H22.4583V19.375C22.4583 17.6741 21.0759 16.2917 19.375 16.2917C17.6741 16.2917 16.2917 17.6741 16.2917 19.375V25.9792H12.125V12.125H16.2917V12.2166ZM25.8333 25.6875H26.3333V25.1875V19.375C26.3333 15.5377 23.2123 12.4167 19.375 12.4167C18.285 12.4167 17.2248 12.7736 16.2279 13.4481L16.2278 13.4482L16 13.6024V12.9167V12.4167H15.5H12.9167H12.4167V12.9167V25.1875V25.6875H12.9167H15.5H16V25.1875V19.375C16 17.5141 17.5141 16 19.375 16C21.2359 16 22.75 17.5141 22.75 19.375V25.1875V25.6875H23.25H25.8333Z" fill="white" stroke="white"/>
			</svg>
		),

	};
};
