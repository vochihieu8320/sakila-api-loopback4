import {Entity, model, property} from '@loopback/repository';

@model()
export class Customer extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    mysql:
    {
      columnName: 'customer_id',
      dataType: 'number',
    }
  })
  id?: number;

  @property({
    type: 'number',
    required: false,
  })
  store_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  first_name: string;

  @property({
    type: 'string',
  })
  last_name?: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'number',
  })
  address_id?: number;
  @property({
    type: 'number',
  })
  active?: number

  @property({
    type: 'date',
  })
  create_date?: string;

  @property({
    type: 'date',
  })
  last_update?: string;


  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
