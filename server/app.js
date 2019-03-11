const express = require( "express" )
const bodyParser = require( "body-parser" )

const app = express()
const port = process.env.PORT || 3000

app.use( bodyParser.urlencoded( { extended: true } ) )
app.use( bodyParser.json() )

app.route( "/tasks" )
    .post( ( request, response ) => {
            console.log( request.body )

            response.send("test")
        })

app.listen( port, () => console.log( "[SERVER]: REST API server started on: " + port ) )
