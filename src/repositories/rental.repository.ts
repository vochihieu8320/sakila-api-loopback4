import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Rental, RentalRelations} from '../models';

export class RentalRepository extends DefaultCrudRepository<
  Rental,
  typeof Rental.prototype.rental_id,
  RentalRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Rental, dataSource);
  }
}
