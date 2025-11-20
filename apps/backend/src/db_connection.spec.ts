const mongoose = require('mongoose')
describe('Connection do mongo', ()=>{
  it('should connect', async()=>{
    const mongouri = 'mongodb://admin:password@localhost:27017/'
    await mongoose.connect(mongouri)
    expect(mongoose.connection.readyState).toBe(1)
    await mongoose.disconnect
  })
})