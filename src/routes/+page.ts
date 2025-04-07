export async function load( {url}) {
    
    const locale = url.pathname.split('/')[1] || "en"

    return ({
        locale: locale
    })
}