
const Navigation = async ({path}) => {
    return new Promise(resolve => {
        resolve(
            {
                status: 302,
                headers: {
                    map: { location: path}
                },
            }
        )
    })
    .then(response => {
        handleResponse(response)
    })
}

function handleResponse(response){
    if(response.status === 302 && response.headers.map.location){
        window.location.href = response.headers.map.location
    } else{
        console.log("Error redirecting")
    }
}

export default Navigation