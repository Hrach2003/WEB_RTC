import { connect } from "mongoose"
import consola from "consola"

export const connectToDB = (DB_uri: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const DB = DB_uri || 'mongodb://localhost:27017/webrtc' as string
      const DB_connection = await connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      consola.success({ message: 'connected to DB', badge: true })
      resolve(DB_connection)
    } catch(error) {
      reject(error.message)
    }
  }) 
}