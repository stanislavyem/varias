# Datemarks

## Install
1. Download the archive and extract it to the folder or clone it using: git clone url https://github.com/Postmaxxx/Datemarks.git
2. Check that your NodeJS version is >= 18.19.0
3. Enter the folder and install dependencies using: npm i
4. To start the app in dev mode use: npm run dev
5. To build the app use: npm run build
5. To start the app in production mode build the app and then use: npm run start

* To use CI/CD deployment to gh-pages: make pull request to the branch "prod" OR run "Build, Deploy to gh-pages" in Github actions manually. Do not forget to check your secrets: BACK_URL must point to the backend (i.e. https://mybackend.com:3000)