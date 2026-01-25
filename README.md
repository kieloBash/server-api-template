<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
# Configure .env
$ npm install
$ npm run docker:build
$ npm run db:dev
```

## Running project locally
```bash
# Run both server and db in docker
$ npm run docker:build
$ npm run docker:dev
```

## Running db when with changes
```bash
$ npm run migrate dev --name ""
$ npm run db:dev
$ npm run db:prod
```

## Running project in prod
```bash
# Run and connect to supabase
# Reset the database
$ npm run prisma:reset:prod

# Push the database 
$ npm run prisma:push:prod

# Apply the seed
$ npm run prisma:seed:prod
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker
```bash
# Start containers
$ docker compose up --build

# Rebuild
$ docker compose down
$ docker compose up --build

# Shutdown
$ docker compose down

# Reset Database
$ docker compose down -v

# Start 
$ docker compose up

# Query
$ docker compose exec api sh
```

## Deployment

### On Render

1. Create a Supabase Database
2. Click 'connect' and get the DATABASE_URL and DIRECT_URL
3. Configure the environment variables as needed in the .env.example
4. Select Docker and Leave Build Command and Start Command empty

```bash
NODE_ENV=production
DATABASE_URL=postgresql://postgres:<PASSWORD>@aws-1-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.<PASSWORD>:@aws-1-<region>pooler.supabase.com:5432/postgres
NODE_ENV=production
CONTEXT_PATH="/api/v1"
```

5. (optional) for first time prisma setup
 - open Render Shell
 - run `npx prisma generate` and `npx prisma db push`

## Stay in touch

- Author - [Kielo Bash Mercado](https://github.com/kieloBash)
- Website - [https://server-api-template.onrender.com/api/v1](https://server-api-template.onrender.com/api/v1)

## Creating Google Authentication
1. Go to google console [Google Console](https://console.cloud.google.com/)
2. Create a project if you haven't. [New Project](https://console.cloud.google.com/projectcreate?previousPage=%2Fwelcome%3F_gl%3D1*1amjhlo*_up*MQ..%26gclid%3DCj0KCQiA-NHLBhDSARIsAIhe9X3YoMVBVKXgjV5z600GxnbSXeMKkSGgfFJrpWg5bdSA9KYsiDuc0WgaAq6WEALw_wcB%26gclsrc%3Daw.ds%26project%3Dinfra-bedrock-384800&organizationId=0)
3. Go to `APIs & Services` [API & Services](https://console.cloud.google.com/apis/dashboard)
4. Go to Credentials and setup an `OAuth client ID` [Credentials](https://console.cloud.google.com/apis/credentials). 
```bash
# Application type
Web application

# Authorized JavaScript origins
http://localhost:3000
http://localhost:8080

# Authorized redirect URIs
http://localhost:3000/auth/callback
https://developers.google.com/oauthplayground
```
5. Configure consent screen and project configurations. Add `External` and add all the test email users that can access the app.
6. Save the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## Testing in Google Authentication
1. Go to [OAuth Playground](https://developers.google.com/oauthplayground)
2. Configure to YOUR client id, click on the Settings Icon and select `Use your own OAuth credentials`
3. Select `Google OAuth2 API v2` and check all the details
4. Proceed to Step2 and click on `Exchange authorization code for tokens`