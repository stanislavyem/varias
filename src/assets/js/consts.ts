import { TInputTypes } from "@/interfaces"

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
	type: TInputTypes
} 

export const inputFilters: Record<string, IInputFilter> = {
	name: {
		length: {
			min: 2,
			max: 60
		},
		type: 'letters+'
	},
	email: {
		length: {
			min: 6,
			max: 90
		},
		type: 'email'
	},
	message: {
		length: {
			min: 20,
			max: 5000
		},
		type: 'any'
	}
}

// z-index:
// header: 2000