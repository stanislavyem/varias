import { TInputValueTypes } from "@/interfaces"

export const scrollThreshold = 1; //in screen heights

export const screenNames = ['start','xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const

export const screenSizes: Record<typeof screenNames[number], number> = {
	xxl: 1536,
	xl: 1280,
	lg: 1024,
	md: 768,
	sm: 640,
	xs: 480,
	start: 1
}

export const linkHome = '/home'
export const linkPrivacy = '/privacy-policy'
export const linkTerms = '/terms-conditions'
export const linkAbout = '/about-us'
interface IInputFilter {
	length: {
		min: number,
		max: number
	},
	type: TInputValueTypes
} 

export const inputPolicies: Record<string, IInputFilter> = {
	name: {
		length: {
			min: 2,
			max: 60
		},
		type: 'name'
	},
	email: {
		length: {
			min: 6,
			max: 100
		},
		type: 'email'
	},
	message: {
		length: {
			min: 20,
			max: 5000
		},
		type: 'skip'
	},
	password: {
		length: {
			min: 8,
			max: 30
		},
		type: 'password'
	}
}

export const requests = {
	sendEmail: {
		url: `${process.env.NEXT_PUBLIC_URL_BACKEND}/sendInfoEmail`,
		method: 'POST'
	}
}

// z-index:

// header: 2000
// #skiper: 5000