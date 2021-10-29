import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: process.env.DATA_SRC_NAME || "mysql",
  connector: process.env.DATA_CONNECTOR || "mysql",
  url: process.env.DATA_URL || "",
  host: process.env.DATA_HOST || "localhost",
  port: process.env.DATA_PORT || 3306,
  user: process.env.DATA_USER || "root",
  password: process.env.DATA_PASS || "",
  database: process.env.DATA_DB_NAME || "sakila"
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MysqlDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mysql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mysql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
