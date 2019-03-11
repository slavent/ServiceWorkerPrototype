import axios from "axios"

axios.get("api/tasks")
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.error(error)
    })