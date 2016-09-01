const defineEnv  = require('./defineEnv')

const args = process.argv.slice(2)
const envName = args[0]
if (!envName) {
    let scriptName = process.argv[1].split('/').pop()
    console.error(`Usage: node ${scriptName} <env>`)
    return
}

defineEnv(envName).create().then( () => console.log(`Environment ${envName} created`))
