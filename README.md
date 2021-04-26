## Installation

```bash
$ npm install
$ yarn
```

## Running the app

```bash
#default
$ yarn start

# development
$ yarn start:dev
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Create a task to src
npx @nestjs/cli g module task_name
npx @nestjs/cli g controller task_name --no-spec
npx @nestjs/cli g service task_name --no-spec

## Create migration file
npx typeorm migration:create -n fileName -d src/migrations

## Query
filter = {"releaseDate":{"gte": "2020-03-01"}, "name":{"equal": "Quan"}, "email": {"like": "quan@gmail.com"}, "name":{"in": ["Quan", "Sang"]}}
orderBy = 'name,-age,email'
page = 1
perPage = 10