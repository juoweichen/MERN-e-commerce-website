# MERN E-commerce website ![Travis CI](https://travis-ci.com/pootitan/worldwidev3.svg?token=Vumo1u1aLNVgz9Ws1bs8&branch=master)
 
[Heroku project link](https://worldwidev3.herokuapp.com/)
 
## Project objectives
The demo project for MERN full-stack website practicing.
The goal of this project is to create a robust modern website utilizing different tech and combine those with harmony.

## Tech introduce
### Full-stack app — MERN
MERN is an abbreviation that goes to MongoDB, Express, React, and Nodejs. It’s a popular tech stack that allows javascript developer to develop a full-stack web app using all javascript language.
 
### CI/CD — Travis CI
Easy applied CI/CD tool which allows developers to build and test repositories hosted from GitHub or Bitbucket.
 
### Deployment — Heroku
A Cloud platform with a free version for open-source repositories, capable of cooperating CI/CD and automatic deploy GitHub project.
 
### E2E testing — Cypress
End-to-end testing library builds on top of Mocha. Cypress includes some awesome testing features like browser preview, time travel, etc.
 
## Setting up
git clone to anywhere you like in the local
```
https://github.com/pootitan/worldwidev3.git
cd worldwidev3
```
install all the package
```
npm run install:all
```
Before running the website, 2 environment variables is required.<br>
1. JWT_PRIVATE_KEY: it works for server credential.<br>
2. DB_URL: you need to apply a free MongoDB Atlas account.<br>
For more detail please check: [Get Started with Atlas](https://docs.atlas.mongodb.com/getting-started/)
```
export JWT_PRIVATE_KEY=<your_favorite_key>
export DB_URL=<your_mongodb_connect_url>
```
## Starting
To start a default(development) version with concurrently(run server and client at one command).
```
npm run start:con
```
To start a production version, build first and start the server to serve a react single page application.
```
npm start
```
## Testing
Run the server unit & integration test
```
npm run test:server
```
Run the client unit & integration test
```
npm run test:client
```
Run e2e test
```
npm run test:e2e
```
Run all test together
```
npm test
```
For more detail usage of custom command lines, I recommend checking the package.json file at the root directory

## Test code coverage
server coverage: 92%<br>
<img src="https://github.com/pootitan/worldwidev3/blob/master/README_img/server-coverage.png" height="50%" width="50%"><br>
client coverage: 77%. NOTE: Many testing code from e2e test overlay with client-side testing<br>
<img src="https://github.com/pootitan/worldwidev3/blob/master/README_img/client-coverage.png" height="50%" width="50%"><br>

