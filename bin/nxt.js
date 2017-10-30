switch (process.argv[2]) {
    case 'component':
        let component = require('./component/component')
        component.init()
        break
    case 'module':
        process.stdout.write(process.argv[2] + '\n')
        break
    default:
        process.stdout.write('Warning: invalid argument, please choose between: "component" or "module"' + '\n')
}
