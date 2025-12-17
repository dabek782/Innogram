import express from 'express'
import connect_to_Mongo from './db_config'
import * as dotenv from 'dotenv'
dotenv.config({path:'./.env'})

const app = express()
app.get('/',(req,res)=>{
  res.send(`works `)

})
const uri = process.env.DATABASE_URL
if(!uri){
  throw new Error('Uri not set')
}
else{
  connect_to_Mongo(uri)
}

app.listen(3002,()=>{
  console.log('Working ')
})