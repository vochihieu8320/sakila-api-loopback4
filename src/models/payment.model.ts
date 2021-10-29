import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Payment extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  payment_id?: number;

  @property({
    type: 'number',
    required: true,
  })
  customer_id: number;

  @property({
    type: 'number',
    required: true,
  })
  staff_id: number;

  @property({
    type: 'number',
    required: true,
  })
  rental_id: number;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'date',
  })
  payment_date?: string;

  @property({
    type: 'date',
  })
  last_update?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Payment>) {
    super(data);
  }
}

export interface PaymentRelations {
  // describe navigational properties here
}

export type PaymentWithRelations = Payment & PaymentRelations;
