export const pagination = (limit: string | undefined, offset: string | undefined) => {
    const regex = /\d+/
    let offsetClean;
    let limitClean;
    if (offset && limit && regex.test(offset) && regex.test(limit)) {
        offsetClean = Number(offset)
        limitClean = Number(limit)
    }
    return { offsetClean, limitClean}
}