import "./src/Config/env.js";

import App from './src/App.js'
import Database from './src/Config/Databse.js'

Database()




App.listen(3000,()=>{
    console.log('Server is running on port 3000 🔍')
})