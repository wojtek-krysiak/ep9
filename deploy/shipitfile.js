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
    await shipit.remote(`cd ${shipit.config.deployTo} && NODE_ENV=production forever start current/server.js`)
  })

  shipit.blTask('server:restart', async () => {
    await shipit.remote(`cd ${shipit.config.deployTo} && forever restartall`)
  })

  shipit.on('updated', () => {
    shipit.start('npm:install')
  })

  shipit.on('published', () => {
    shipit.start('server:restart')
  })
}