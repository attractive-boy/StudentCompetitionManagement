import mysql from 'mysql2/promise'
import config from '../config/default'

async function dbConnect() {
  const dbUri = config.dbUri
  const dbUser = config.dbUser
  const dbPassword = config.dbPassword
  const dbAuthSource = config.dbAuthSource

  try {
    const connection = await mysql.createConnection({
      host: dbUri,
      user: dbUser,
      password: dbPassword,
      database: dbAuthSource,
    })

    return connection
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

export default dbConnect
