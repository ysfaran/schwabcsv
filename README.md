# schwabcsv

A small API to parse CSV and generate statistics.

## Commands

### Start Server

The server will listen on port `3000`.

```sh
yarn start
```

### Watch Server

Same as [Start Server](#start-server), but restarts server on file changes.

```sh
yarn dev
```

### Run Linter

Run static code analyzer. This includes checks for proper code formatting.

```sh
yarn lint
```

### Run Tests

Run all tests or decide to only run unit/integration tests.

```sh
yarn test
yarn test:unit
yarn test:integration
```

## API

The application consists of a single endpoint. It accepts a list URL's as query parameters:

> ℹ️ **INFO**
>
> Duplicate URL's will be ignored

```txt
https://localhost:8080/evaluation?url=url1&url=url2
```

Each of these URL's locate a CSV file. The CSV should have following format:

```csv
Speaker, Topic, Date, Words
Alexander Abel, Education Policy, 2012-10-30, 5310
Bernhard Belling, Coal Subsidies, 2012-11-05, 1210
Caesare Collins, Coal Subsidies, 2012-11-06, 1119
Alexander Abel, Internal Security, 2012-12-11, 911
```

Some test CSV files are served at:

```txt
http://localhost:3000/csv/csv1.csv
http://localhost:3000/csv/csv2.csv
```

If the request was successful a response with following JSON body will be returned:

```json
{
    // Speaker with most speeches in 2013
    "mostSpeeches": "Caesare Collin",
    // Speaker with most speeches of topic "Internal Security"
    "mostSecurity": "Alexander Abel",
    // Speaker with least words used during his speeches
    "leastWordy": "Bernhard Belling"
}
```

All fields can possibly be set to `null`. This can happen for example for `mostSpeeches` if two speaker have the same amount speeches in 2013.

## Tech Stack

Following TypeScript tech stack is used for this application:

- **[ExpressJS](https://expressjs.com/)**: Node server to provide the API
- **[Jest](https://jestjs.io/)**: JavaScript testing framework for unit and integration tests
- **[ESLint](https://eslint.org/)**: Static code analyzer for JavaScript/TypeScript
- **[Prettier](https://jestjs.io/)**: Code formatter for JavaScript/TypeScript
- **[GitHub Actions](https://github.com/features/actions/)**: Workflow automation through CI/CD pipelines
