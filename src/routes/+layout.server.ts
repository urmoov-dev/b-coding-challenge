export async function load() {

    const response = await fetch("https://mempool.space/api/v1/lightning/nodes/rankings/connectivity")
    const data = await response.json()

    return ({
        nodes: data
    })

}