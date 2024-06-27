<img src="public/images/Logo.png" alt="I-GUIDE Logo" width="40%"/>

# I-GUIDE User Experience Frontend

An application used for displaying our resources along with their associated resources. Users will be able to access the read-only version of the notebook, download the datasets, open the notebook in the I-GUIDE Platform JupyterHub environment to run the notebook, and more...

## Project Status
This project is currently under development.

## Installation
### Clone the repo from GitHub:
```bash
git clone https://github.com/I-GUIDE/iguide-ue-frontend.git
```

### Run the development server:
```bash
yarn dev
```
Open http://localhost:80 to view it in your browser. The page will reload when you make changes.


### Run the production server:
```bash
yarn build
```
### Use docker-compose:
```bash
docker-compose up -d --build
```

Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
