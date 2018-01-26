
module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/palettepicker',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullasDefault: true
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/palettepicker_test',
    useNullasDefault: true,
    migrations: {
      directory: __dirname + 'db/migrations'
    },
    seeds: {
      directory: './db/test'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations'
  },
  useNullAsDefault: true
  }
}