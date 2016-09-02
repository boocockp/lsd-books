const defineEnv  = require('./defineEnv')

const args = process.argv.slice(2)
const instanceName = args[0]
if (!instanceName) {
    let scriptName = process.argv[1].split('/').pop()
    console.error(`Usage: node ${scriptName} <env>`)
    return
}

defineEnv(instanceName).destroy().then( () => console.log(`Environment ${instanceName} destroyed`))
