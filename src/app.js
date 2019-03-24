import axios from "axios"

const WORKER = "serviceWorker"

class App {
    init() {
        this.registerWorker()
        this.bindDomElements()
    }

    registerWorker() {
        if ( !( WORKER in navigator ) ) {
            console.warn( "Your browser isn't support Service Workers" )

            return
        }

        navigator.serviceWorker
                 .register( "ServiceWorker.js" )
                 .then( data => console.log( "Registration succeeded. Scope is " + data.scope ) )
                 .catch( error => console.error( "Registration failed with " + error ) )
    }

    bindDomElements() {
        const $photo = document.getElementById( "file" )

        $photo.addEventListener( "change", this.sendRequest.bind( this ) )
    }

    sendRequest() {
        const file = document.getElementById( "file" ).files[0]
        const data = new FormData()

        data.set("file", file )
        data.set("typeId", "123" )

        const config = {
            url: "api/tasks",
            method: "post",
            data
        }

        axios( config )
            .then( response => console.log( response.data ) )
            .catch( error => console.error( error ) )
    }
}

const app = new App()

app.init()