/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false

let assetPrefix = '.'
let basePath = ''

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')
 	//unlock for ghpages 
  	//assetPrefix = `/${repo}/` 
  	//basePath = `/${repo}`
  	
	//unlock for domain
	assetPrefix = `.`
  	basePath = ``

}


// const mode = process.env.NODE_ENV?.trim() || 'development';

// const pathToEnv = `.env.${mode}`.trim()
// require('dotenv').config({
//     path: pathToEnv,
// })
// console.log('ENV mode: ', pathToEnv);
// console.log('Port: ', process.env.PORT);



const nextConfig = {
	// images: {
	// 	deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
	// },
	assetPrefix: assetPrefix,
	basePath: basePath,
	output: "export",
	images: {
		unoptimized: true,
	},
	// reactStrictMode: true,
	// trailingSlash: true,
	// redirects: async () => {
	// 	return [
	// 	  {
	// 		source: '/',
	// 		destination: '/login',
	// 		permanent: true,
	// 	  },
	// 	];
	//   },
}

module.exports = nextConfig
