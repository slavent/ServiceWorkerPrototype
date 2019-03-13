importScripts( "https://cdnjs.cloudflare.com/ajax/libs/dexie/2.0.4/dexie.js" )

const EVENTS = {
    FETCH: "fetch"
}

const METHODS = {
    POST: "POST"
}

/**
 * Worker для "доката" файлов при нестабильном соединении
 */
class FileLoadWorker {
    dataBase = new Dexie( "keys" )
    image = null

    createStore = () => {
        this.dataBase.version( 1 ).stores( {
            simple: ""
        } )
    }

    listen = () => {
        self.addEventListener( EVENTS.FETCH, event => {
            const { request } = event

            if ( request.method !== METHODS.POST ) {
                return
            }

            request.clone().json().then( json => {
                this.image = json.image
            } )

            this.createStore()

            event.respondWith(
                fetch( request )
                    .then( this.onSuccess )
                    .catch( this.onFail )
            )
        } )
    }

    onSuccess = response => {
        if ( response.status >= 500 ) {
            this.dataBase.simple.clear()
            this.dataBase.simple.add( this.image, 1 )
            this.dataBase.simple.get( 1, image => this.sendTimeoutRequest( image ) )
        }

        return response
    }

    onFail = error => console.error( error )

    sendTimeoutRequest( image ) {
        setTimeout( () => {
            const request = new Request( "http://localhost:8080/api/tasks", {
                method: "POST",
                body: JSON.stringify( { image } )
            } )

            fetch( request )
                .then()
                .catch()

        }, 10000 )
    }
}

const worker = new FileLoadWorker()

worker.listen()