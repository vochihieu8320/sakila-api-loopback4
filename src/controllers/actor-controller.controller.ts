import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Actor, FilmActor} from '../models';
import {ActorRepository, FilmActorRepository} from '../repositories';


@authenticate('jwt')

export class ActorControllerController {
  constructor(
    @repository(ActorRepository)
    public actorRepository: ActorRepository,
    @repository(FilmActorRepository)
    public filmActorRepository: FilmActorRepository
  ) { }

  @post('/actors')
  @response(200, {
    description: 'Actor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Actor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Actor, {
            title: 'NewActor',
            exclude: ['actor_id'],
          }),
        },
      },
    })
    actor: Omit<Actor, 'id'>,
  ): Promise<any> {
    await this.actorRepository.create(actor);
    return await this.actorRepository.find({"limit": 5, "order": ["last_update DESC"]})
  }

  @get('/actors/count')
  @response(200, {
    description: 'Actor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Actor) where?: Where<Actor>,
  ): Promise<Count> {
    return this.actorRepository.count(where);
  }

  @get('/actors')
  @response(200, {
    description: 'Array of Actor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Actor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Actor) filter?: Filter<Actor>,
  ): Promise<Actor[]> {
    return this.actorRepository.find(filter);
  }

  @patch('/actors')
  @response(200, {
    description: 'Actor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Actor, {partial: true}),
        },
      },
    })
    actor: Actor,
    @param.where(Actor) where?: Where<Actor>,
  ): Promise<Count> {
    return this.actorRepository.updateAll(actor, where);
  }

  @get('/actors/{id}')
  @response(200, {
    description: 'Actor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Actor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Actor, {exclude: 'where'}) filter?: FilterExcludingWhere<Actor>
  ): Promise<Actor> {
    return this.actorRepository.findById(id, filter);
  }


  @get('/film_actors/{id}')
  @response(200, {
    description: 'Actor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FilmActor, {includeRelations: true}),
      },
    },
  })
  async findId(
    @param.path.number('id') id: number,
    @param.filter(Actor, {exclude: 'where'}) filter?: FilterExcludingWhere<FilmActor>
  ): Promise<FilmActor> {
    return this.filmActorRepository.findById(id, filter);
  }


  @patch('/actors/{id}')
  @response(204, {
    description: 'Actor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Actor, {partial: true}),
        },
      },
    })
    actor: Actor,
  ): Promise<any> {
    await this.actorRepository.updateById(id, actor);
    return await this.actorRepository.findById(id);
  }

  @put('/actors/{id}')
  @response(204, {
    description: 'Actor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() actor: Actor,
  ): Promise<void> {
    await this.actorRepository.replaceById(id, actor);
  }

  @del('/actors/{id}')
  @response(204, {
    description: 'Actor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<any> {
    //await this.filmActorRepository.deleteById();

    const find_filmActor = await this.filmActorRepository.findOne({where: {actor_id: id}});
    if (find_filmActor) {
      await this.filmActorRepository.deleteById(id);
    }
    return await this.actorRepository.deleteById(id);


  }
}
