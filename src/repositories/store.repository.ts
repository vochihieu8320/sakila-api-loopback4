import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Store, StoreRelations} from '../models';

export class StoreRepository extends DefaultCrudRepository<
  Store,
  typeof Store.prototype.store_id,
  StoreRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Store, dataSource);
  }
}
