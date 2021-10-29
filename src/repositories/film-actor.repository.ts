import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {FilmActor, FilmActorRelations} from '../models';



export class FilmActorRepository extends DefaultCrudRepository<
  FilmActor,
  typeof FilmActor.prototype.actor_id,
  FilmActorRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(FilmActor, dataSource);
  }
}
