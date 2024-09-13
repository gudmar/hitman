const wait = async (t, name) => {
    const promise = new Promise((res) => {
        setTimeout(() => res(`Timer ${name || ''} expired`), t)
    })
    const result = await promise;
    return result
}