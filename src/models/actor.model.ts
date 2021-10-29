import {Entity, model, property} from '@loopback/repository';

@model()
export class Actor extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    mysql:
    {
      columnName: 'actor_id',
      dataType: 'number',
    }
  })
  actor_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  first_name: string;

  @property({
    type: 'string',
    required: true,
  })
  last_name: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'last_update',
      dataType: 'datetime',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'N',
      default: 'CURRENT_TIMESTAMP',
    }
  })
  last_update?: string;


  constructor(data?: Partial<Actor>) {
    super(data);
  }
}

export interface ActorRelations {
  // describe navigational properties here
}

export type ActorWithRelations = Actor & ActorRelations;
