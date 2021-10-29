import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Actor, ActorRelations} from '../models';


export class ActorRepository extends DefaultCrudRepository<
  Actor,
  typeof Actor.prototype.actor_id,
  ActorRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Actor, dataSource);
  }
}
