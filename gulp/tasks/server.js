import config from '../config.js';

function server(instance) {
  instance.init({
    server: {
      baseDir: config.dest.root,
    },
    logLevel: 'info',
    cors: true,
    notify: false,
    open: false,
    reloadOnRestart: true,
    port: 3000,
  });
};

export default server;
