class Component {
    constructor () {
        this.root = ''
        this.path = ''
        this.routeName = ''
        this.routeObjectName = ''
        this.selector = ''
        this.prefixClassesName = ''
        this.namespace = ''
        this.appPath = ''
        this.parentsPath = '../'
        this.componentTestFileContent = require('./component.spec.file')
        this.componentFileContent = require('./component.file')
        this.componentRoutesFileContent = require('./component-routes.file')
        this.componentRoutesRootFileContent = require('./component-routes-root.file')
    }

    init () {
        this.setRouteName()
    }

    setRouteName () {
        process.stdout.write('Choose a route name for your component : (only alphanumeric, "/", ":" and "-" characters)' + '\n')
        process.stdin.setEncoding('utf8')
        process.stdin.on('readable', () => {
            let text = process.stdin.read()
            if (text !== null) {
                text = text.replace(/(\n|\r)*/g, '')
                if (/^[a-z0-9]+(\-[a-z0-9]+)*((\/\:|\/)[a-z0-9]+[-a-z0-9]*)*$/.test(text)) {
                    this.routeName = text
                    this.getNames()
                } else {
                    process.stdout.write('Invalid route (ex: "my-route/with/:parameter1/and/:parameter2")' + '\n')
                }
            }
        })
    }

    getNames () {
        this.path = this.routeName.split('/:')[0]

        let primaryRoute = this.path.split('/')

        this.root = primaryRoute[0]

        let rootParts = this.root.split('-')
        rootParts.forEach((part) => {
            this.namespace += part.substring(0, 1).toUpperCase() + part.substring(1)
        })

        this.selector = primaryRoute[primaryRoute.length - 1]

        let parts = this.selector.split('-')
        parts.forEach((part) => {
            this.prefixClassesName += part.substring(0, 1).toUpperCase() + part.substring(1)
        })

        this.routeObjectName = this.prefixClassesName.substring(0, 1).toLowerCase() + this.prefixClassesName.substring(1) + 'Route'

        for (let i = 0; i < primaryRoute.length; i++) {
            this.parentsPath += '../'
        }

        this.appPath =  this.parentsPath + 'app'

        this.writeFiles()
    }

    writeFiles () {
        let sourcesPath = __dirname
        if (sourcesPath.lastIndexOf('/bin/component') > -1) {
            sourcesPath = sourcesPath.substring(0, sourcesPath.lastIndexOf('/bin/component')) + '/sources'
        } else {
            sourcesPath = sourcesPath.substring(0, sourcesPath.lastIndexOf('\\bin\\component')) + '\\sources'
        }

        let fs = require('fs')
        let path = require('path')

        let parents = ''
        this.path
            .split('/')
            .forEach(row => {
                if (!fs.existsSync(sourcesPath + '/components/' + parents + row)) {
                    fs.mkdirSync(sourcesPath + '/components/' + parents + row)
                }

                parents += row + '/'
            })
        
        fs.mkdirSync(sourcesPath + '/components/' + this.path + '/_tests')
        this.componentTestFileContent = this.componentTestFileContent.replace(/\{\{mockPath\}\}/g, this.parentsPath + '../mocks')
        this.componentTestFileContent = this.componentTestFileContent.replace(/\{\{componentClassName\}\}/g, this.prefixClassesName + 'Component')
        this.componentTestFileContent = this.componentTestFileContent.replace(/\{\{selector\}\}/g, this.selector)
        fs.writeFileSync(path.resolve(sourcesPath, 'components/' + this.path + '/_tests/' + this.selector + '.component.spec.ts'), this.componentTestFileContent)

        this.componentFileContent = this.componentFileContent.replace(/\{\{selector\}\}/g, this.selector)
        this.componentFileContent = this.componentFileContent.replace(/\{\{appPath\}\}/g, this.appPath)
        this.componentFileContent = this.componentFileContent.replace(/\{\{componentClassName\}\}/g, this.prefixClassesName + 'Component')

        fs.writeFileSync(path.resolve(sourcesPath, 'components/' + this.path + '/' + this.selector + '.component.ts'), this.componentFileContent)

        this.componentRoutesFileContent = this.componentRoutesFileContent.replace(/\{\{selector\}\}/g, this.selector)
        this.componentRoutesFileContent = this.componentRoutesFileContent.replace(/\{\{appPath\}\}/g, this.appPath)
        this.componentRoutesFileContent = this.componentRoutesFileContent.replace(/\{\{componentClassName\}\}/g, this.prefixClassesName + 'Component')
        this.componentRoutesFileContent = this.componentRoutesFileContent.replace(/\{\{resolverClassName\}\}/g, this.prefixClassesName + 'Resolver')
        this.componentRoutesFileContent = this.componentRoutesFileContent.replace(/\{\{componentRoute\}\}/g, this.routeName)
        this.componentRoutesFileContent = this.componentRoutesFileContent.replace(/\{\{routeObjectName\}\}/g, this.routeObjectName)

        fs.writeFileSync(path.resolve(sourcesPath, 'components/' + this.path + '/' + this.selector + '.routes.ts'), this.componentRoutesFileContent)

        let content = ''
        let routesFileRelativePath = './' + this.path.replace(this.root + '/', '') + '/' + this.selector + '.routes'

        if (this.path !== this.root) {
            if (!fs.existsSync(path.resolve(sourcesPath, 'components/' + this.root + '/' + this.root + '.routes.ts'))) {
                content = this.componentRoutesRootFileContent
            } else {
                content = fs.readFileSync(path.resolve(sourcesPath, 'components/' + this.root + '/' + this.root + '.routes.ts'), 'utf8')
            }

            content = content
                .replace('export { ' + this.routeObjectName + ' } from \'' + routesFileRelativePath + '\'' + '\n', '')
                .replace('import { ' + this.prefixClassesName + 'Resolver' + ' } from \'' + routesFileRelativePath + '\'' + '\n', '')
                .replace('/// ROUTE EXPORTATION END', 'export { ' + this.routeObjectName + ' } from \'' + routesFileRelativePath + '\'\n' + '/// ROUTE EXPORTATION END')
                .replace('/// RESOLVERS IMPORTATION END', 'import { ' + this.prefixClassesName + 'Resolver' + ' } from \'' + routesFileRelativePath + '\'\n' + '/// RESOLVERS IMPORTATION END')
        } else {
            content = fs.readFileSync(path.resolve(sourcesPath, 'components/' + this.root + '/' + this.root + '.routes.ts'), 'utf8')
            content += '\n\n' + this.componentRoutesRootFileContent
        }

        let providersExportation = ''
        let providersExportationToReplace = ']' + '\n' + '/// PROVIDERS EXPORTATION END'
        if (content.indexOf('/// PROVIDERS EXPORTATION START\n/// PROVIDERS EXPORTATION END') > -1) {
            providersExportationToReplace = '/// PROVIDERS EXPORTATION END'

            providersExportation = 'export const ' + this.root.toLocaleUpperCase() +'_ROUTE_PROVIDERS = [' + '\n'
        }

        providersExportation += '    ' + this.prefixClassesName + 'Resolver' +','
        providersExportation += '\n' + ']'
        providersExportation += '\n' + '/// PROVIDERS EXPORTATION END'

        content = content
            .replace(providersExportationToReplace, providersExportation)
        
        fs.writeFileSync(path.resolve(sourcesPath, 'components/' + this.root + '/' + this.root + '.routes.ts'), content)

        // Index file
        let indexContent = ''
        if (fs.existsSync(path.resolve(sourcesPath, 'components/' + this.root + '/index.ts'))) {
            indexContent = fs.readFileSync(path.resolve(sourcesPath, 'components/' + this.root + '/index.ts'), 'utf8')
        }

        let componentFileRelativePath = './' + this.path.replace(this.root + '/', '') + '/' + this.selector + '.component'
        indexContent += 'export { ' + this.prefixClassesName + 'Component' + ' } from \'' + componentFileRelativePath + '\'' + '\n\n'
        fs.writeFileSync(path.resolve(sourcesPath, 'components/' + this.root + '/index.ts'), indexContent)

        let appRoutesContent = fs.readFileSync(path.resolve(sourcesPath, 'app/app.routes.ts'), 'utf8')

        if (appRoutesContent.indexOf('} from \'../components/' + this.root + '/' + this.root + '.routes\'' + '\n' + '/// ROUTE IMPORTATION END') > -1) {
            let routeImportation = '    ' + this.root.toLocaleUpperCase()  + '_ROUTE_PROVIDERS,' + '\n'
            routeImportation += '    ' + this.routeObjectName + ',' + '\n'
            routeImportation += '} from \'../components/' + this.root + '/' + this.root + '.routes\'' + '\n'
            routeImportation += '/// ROUTE IMPORTATION END'

            appRoutesContent = appRoutesContent
                .replace(new RegExp('    ' + this.root.toLocaleUpperCase()  + '_ROUTE_PROVIDERS,' + '\n', 'g'), '')
                .replace(new RegExp('    ' + this.routeObjectName + ',' + '\n', 'g'), '')
                .replace('} from \'../components/' + this.root + '/' + this.root + '.routes\'' + '\n' + '/// ROUTE IMPORTATION END', routeImportation)
        } else {
            let routeImportation = '\n' + 'import {' + '\n'
            routeImportation += '    ' + this.root.toLocaleUpperCase()  + '_ROUTE_PROVIDERS,' + '\n'
            routeImportation += '    ' + this.routeObjectName + ',' + '\n'
            routeImportation += '} from \'../components/' + this.root + '/' + this.root + '.routes\'' + '\n'
            routeImportation += '/// ROUTE IMPORTATION END'

            appRoutesContent = appRoutesContent
                .replace('/// ROUTE IMPORTATION END', routeImportation)
        }

        appRoutesContent = appRoutesContent
            .replace(']' + '\n' + '/// APP ROUTER EXPORTATION END', '    ' + this.root.toLocaleUpperCase()  + '_ROUTE_PROVIDERS,' + '\n' + ']'+ '\n' + '/// APP ROUTER EXPORTATION END')
            .replace(']' + '\n' + '/// ROUTES DEFINITION END', '    ' + this.routeObjectName + ',' + '\n' + ']' + '\n' + '/// ROUTES DEFINITION END')
        
        fs.writeFileSync(path.resolve(sourcesPath, 'app/app.routes.ts'), appRoutesContent)

        // NgModules
        let appModulesContent = fs.readFileSync(path.resolve(sourcesPath, 'app/app.module.ts'), 'utf8')
        appModulesContent = appModulesContent
            .replace('import * as ' + this.namespace + ' from \'../components/' + this.root + '\'' + '\n', '')
            .replace('    ' + this.namespace + '.' + this.prefixClassesName + 'Component,' + '\n', '')
            .replace('/// COMPONENTS IMPORTATION END', 'import * as ' + this.namespace + ' from \'../components/' + this.root + '\'' + '\n' + '/// COMPONENTS IMPORTATION END')
            .replace(/\](\r\n|\r|\n)\/\/\/ COMPONENTS DEFINITION END/, '    ' + this.namespace + '.' + this.prefixClassesName + 'Component,' + '\n' + ']'+ '\n' + '/// COMPONENTS DEFINITION END')

        fs.writeFileSync(path.resolve(sourcesPath, 'app/app.module.ts'), appModulesContent)

        process.stdout.write('Component created!' + '\n')
        process.exit()
    }
}

module.exports = new Component()