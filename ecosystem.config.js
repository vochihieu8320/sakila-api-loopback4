module.exports = {
  apps: [{
    script: 'dist/index.js',
    watch: false,
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G',
    env:
    {
      "PORT": 3000,
      "HOST": "localhost",
      "NODE_ENV": 'development',
      "DATA_SRC_NAME": "mysql",
      "DATA_CONNECTOR": "mysql",
      "DATA_URL": "",
      "DATA_HOST": "localhost",
      "DATA_PORT": 3306,
      "DATA_USER": "root",
      "DATA_PASS": "",
      "DATA_DB_NAME": "sakila",
      "DOMAIN_NAME": "http://localhost:3000",
      "TOKEN_SECRET": "vochihieu",
      "TOKEN_EXPIRES_IN": "120"
    },
    env_production:
    {

    },
    error_file: 'err.log',
    out_file: 'out.log',
    log_file: 'combined.log',
    time: true


  }]
};
