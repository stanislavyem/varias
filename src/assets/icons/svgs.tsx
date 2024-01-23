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
					stroke="#979797"
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
	};
};
