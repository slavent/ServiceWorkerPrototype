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

        $photo.addEventListener( "change", this.readFile.bind( this ) )
    }

    readFile() {
        const reader = new FileReader()
        const file = document.getElementById( "file" ).files[0]

        reader.onloadend = () => {
            const dataUrl = reader.result

            this.sendRequest( dataUrl )
        }

        reader.readAsDataURL( file )
    }

    sendRequest( dataUrl ) {
        const config = {
            url: "api/tasks",
            method: "post",
            data: {
                image: dataUrl
            }
        }

        axios( config )
            .then( response => console.log( response.data ) )
            .catch( error => console.error( error ) )
    }
}

const app = new App()

app.init()