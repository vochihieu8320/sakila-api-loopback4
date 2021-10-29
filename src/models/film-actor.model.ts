import {Entity, model, property} from '@loopback/repository';

@model({settings: {mysql: {schema: 'film_actor', table: 'film_actor'}}})
export class FilmActor extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  actor_id: number;

  @property({
    type: 'number',
    required: true,

  })
  film_id: number;

  @property({
    type: 'date',
  })
  last_update?: string;


  constructor(data?: Partial<FilmActor>) {
    super(data);
  }
}

export interface FilmActorRelations {
  // describe navigational properties here
}

export type FilmActorWithRelations = FilmActor & FilmActorRelations;
