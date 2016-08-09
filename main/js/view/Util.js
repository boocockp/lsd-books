module.exports = class Util {
    static parseProp(prop) {
        const parts = prop.split(/ *, */)
        const name = parts[0]
        const infoPairs = parts.slice(1).map(p => p.split(/ = /)).map( arr => arr.length == 2 ? arr : arr.concat(true) )
        const info = _.fromPairs(infoPairs)
        info.name = name
        return info
    }

}