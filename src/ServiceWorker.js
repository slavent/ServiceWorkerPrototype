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
    file = null

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

            request.clone().formData().then( data => {
                this.file = data.get( "file" )
                this.typeId = data.get( "typeId" )
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
        if ( response.status === 200 ) {
            return response
        }

        this.dataBase.simple.clear()
        this.dataBase.simple.add( this.file, 1 )
        this.dataBase.simple.get( 1, file => {
            const body = new FormData()

            body.set( "file", file )
            body.set( "typeId", "123" )

            const request = new Request( "http://localhost:8081/api/tasks", {
                method: "POST",
                body
            } )

            const intervalId = setInterval( () => {
                console.log( "Connection is " + ( navigator.onLine ? "success" : "fail." ) )

                if ( navigator.onLine ) {
                    fetch( request )
                        .then( response => console.log( response ) )
                        .catch( error => console.error( error ) )

                    clearInterval( intervalId )
                }
            }, 3000 )
        } )
    }

    onFail = error => console.error( error )
}

const worker = new FileLoadWorker()

worker.listen()

const convertHeadersToArray = request => {
    const headers = []

    for ( let header of request.headers ) {

        headers.push( header )
    }

    return headers
}