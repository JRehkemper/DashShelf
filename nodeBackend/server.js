const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')


app.listen(3000, () => { console.log("listening on Port 3000")})

app.get("/", (req,res) => {
    axios.get("https://heise.de")
    .then(resp => {
        //console.log(resp.data)
        var html = resp.data.split('\n')
        for(var i = 0; i < html.length; i++) {
            if(html[i].includes('rel="icon"')) {
                console.log(html[i])
                console.log("icon in line "+i)
                var linkline = i
                var l = linkline
                while(!html[l].includes('<link')) {
                    l--
                }
                console.log("link in line "+l)
                var h = l
                while(!html[h].includes('href="http')) {
                    h++
                }
                console.log(html[h])
            }
        }
        console.log("End of loop")
    })

})