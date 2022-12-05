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

## Tech Stack

Following TypeScript tech stack is used for this application:

* **[express](https://expressjs.com/)**: Node server to provide the API
* **[jest](https://jestjs.io/)**: JavaScript testing framework for unit and integration tests
* **[prettier](https://jestjs.io/)**: Code formatter for JavaScript/TypeScript
