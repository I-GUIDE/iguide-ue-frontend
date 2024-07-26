<img src="public/images/Logo.png" alt="I-GUIDE Logo" width="40%"/>

# I-GUIDE Platform Frontend

I-GUIDE Platform Frontend is the gateway to the I-GUIDE infrastructure. This web application shows users all the elements our contributors uploaded. One of the highlights of this app is that it focuses on building a network of related elements which makes it easier for users to explore more relevant contents.

## Project Status
This project is currently under development.

## Installation
### Clone the repo from GitHub:
```bash
git clone https://github.com/I-GUIDE/iguide-ue-frontend.git
```


### Register CILogon for SSO login
CILogon website: https://www.cilogon.org/oidc

CILogon client registration: https://cilogon.org/oauth2/register

> [!TIP]
> When you add callback URLs in the form, remember to add http://localhost:3000/cilogon-callback and https://localhost:8443/cilogon-callback. With those endpoints, you will find it easier to test CILogon on your localhost environment.


### Set up the main and CILogon mini backend .env files:
```bash
cp .env.example .env
cp cilogon/.env.example cilogon cilogon/.env
```
Complete both .env files by following the in-line comments.


### Set up SSL certificate:
If you are running this app on a localhost environment, it is recommended to have a set of self-signed SSL certificates. You could follow this link to generate the .pem files. After getting fullchain.pem and privkey.pem, put them in both ./nginx-config and ./cilogon/credentials. You could visit ./Dockerfile and ./cilogon/auth_server.js to make sure their paths are correct.

In the Dockerfile:
```Dockerfile
COPY ./nginx-config/fullchain.pem /etc/nginx/ssl/fullchain.pem
COPY ./nginx-config/privkey.pem /etc/nginx/ssl/privkey.pem
```

In ./cilogon/auth_server.js:
```js
const credentials = {
    key: fs.readFileSync('credentials/privkey.pem'),
    cert: fs.readFileSync('credentials/fullchain.pem')
};
```


### Run the development server:
```bash
yarn dev
```
Open http://localhost:80 or other URL enabled by Vite to view it in your browser. The page will automatically reload when you make changes.
> [!TIP]
> This command won't enable HTTPS and is not ideal for testing CILogon.


### Run the production server:
```bash
yarn build
```


### Use docker-compose:
```bash
docker-compose up -d --build
```

Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
