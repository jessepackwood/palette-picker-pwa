
module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/palettepicker',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/dev'
    },
    useNullasDefault: true
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/palettepicker_test',
    useNullasDefault: true,
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/test'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: __dirname + '/db/migrations'
  },
  useNullAsDefault: true
  }
}