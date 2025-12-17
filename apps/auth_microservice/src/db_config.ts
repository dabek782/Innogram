import mongoose, {Schema , model ,connect} from 'mongoose'

export default async function connect_to_Mongo(uri:string) {
  await connect(uri)   
}
