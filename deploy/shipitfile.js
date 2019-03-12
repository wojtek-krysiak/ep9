// shipitfile.js
module.exports = shipit => {
  // Load shipit-deploy tasks
  require('shipit-deploy')(shipit)
  require('shipit-shared')(shipit)

  shipit.initConfig({
    default: {
      deployTo: '/var/www/ep9',
      repositoryUrl: 'git@github.com:wojtek-krysiak/ep9.git',
      shared: {
        overwrite: true,
        dirs: ['node_modules']
      }
    },
    staging: {
      servers: 'root@104.248.220.114',
    },
  })

  shipit.blTask('npm:install', async () => {
    await shipit.remote(`cd ${shipit.releasePath} && npm i --production`)
  })

  shipit.blTask('server:start', async () => {
    const currentPath = path.join(shipit.config.deployTo, '/current')
    await shipit.remote(`cd ${currentPath} && NODE_ENV=production forever start server.js`)
  })

  shipit.blTask('server:restart', async () => {
    await shipit.remote(`cd ${shipit.currentPath} && NODE_ENV=production forever restart server.js`)
  })

  shipit.on('updated', () => {
    shipit.start('npm:install')
  })

  shipit.on('published', () => {
    shipit.start('server:restart')
  })
}