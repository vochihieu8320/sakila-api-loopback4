import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings, UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
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
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response,
  SchemaObject
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {Customer} from '../models';
import {CustomerRepository, PaymentRepository, RentalRepository, TokenRepository} from '../repositories';


const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);




const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class CustomerControllerController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
    @repository(RentalRepository)
    public rentalRepository: RentalRepository,
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(TokenRepository)
    private tokenRepository: TokenRepository
  ) { }

  @authenticate('jwt')
  @post('/customers')
  @response(200, {
    description: 'Customer model instance',
    content: {'application/json': {schema: getModelSchemaRef(Customer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {
            title: 'NewCustomer',
            exclude: ['id'],
          }),
        },
      },
    })
    customer: Omit<Customer, 'id'>,
  ): Promise<any> {
    await this.customerRepository.create(customer);
    return await this.customerRepository.find({"limit": 5, "order": ["last_update DESC"]})
  }

  @post('/customers/login')
  @response(200, {
    description: 'Customer login',
    content: {'application/json': {schema: getModelSchemaRef(Customer)}},
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<any> {
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return token;
  }

  @post('/customers/refreshToken')
  @response(200, {
    description: 'Customer login',
    content: {'application/json': {schema: getModelSchemaRef(Customer)}},
  })
  async refreshTOkenm(
    @requestBody({
      description: "get new token",
      content: {
        'application/json':
        {
          schema: {
            type: 'object',
            properties: {
              refreshToken: {type: 'string'}
            }
          }
        }
      }
    }) body: any,
  ): Promise<any> {
    const userInfo = await this.jwtService.verifyToken(body.refreshToken)
    // return await this.jwtService.revokeToken
    const find_refresh = await this.tokenRepository.findOne({where: {customer_id: userInfo.customer_id, refresh_token: body.refreshToken}});
    if (find_refresh) {
      let Token = await signAsync(userInfo, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });
      let refreshToken = await signAsync(userInfo, this.jwtSecret);

      const result = await this.tokenRepository.deleteAll({customer_id: userInfo.customer_id});
      const body =
      {
        refresh_token: refreshToken,
        customer_id: userInfo.customer_id
      }
      await this.tokenRepository.create(body);
      return {acesstoken: Token, refreshToken: refreshToken};
    }
    else {
      throw new HttpErrors.Unauthorized('Invalid token')
    }

  }


  @authenticate('jwt')
  @get('/customers/count')
  @response(200, {
    description: 'Customer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {
    return this.customerRepository.count(where);
  }


  @authenticate('jwt')
  @get('/customers')
  @response(200, {
    description: 'Array of Customer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Customer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Customer) filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return this.customerRepository.find(filter);
  }

  @authenticate('jwt')

  @patch('/customers')
  @response(200, {
    description: 'Customer PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {
    return this.customerRepository.updateAll(customer, where);
  }

  @authenticate('jwt')
  @get('/customers/{id}')
  @response(200, {
    description: 'Customer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Customer, {exclude: 'where'}) filter?: FilterExcludingWhere<Customer>
  ): Promise<Customer> {
    return this.customerRepository.findById(id, filter);
  }


  @authenticate('jwt')

  @patch('/customers/{id}')
  @response(204, {
    description: 'Customer PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
  ): Promise<Customer> {
    await this.customerRepository.updateById(id, customer);
    return await this.customerRepository.findById(id);
  }

  @authenticate('jwt')
  @put('/customers/{id}')
  @response(204, {
    description: 'Customer PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() customer: Customer,
  ): Promise<void> {
    await this.customerRepository.replaceById(id, customer);
  }

  @authenticate('jwt')
  @del('/customers/{id}')
  @response(204, {
    description: 'Customer DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<any> {
    try {
      await this.paymentRepository.deleteAll({customer_id: id});
      await this.rentalRepository.deleteAll({customer_id: id});
      await this.customerRepository.deleteById(id);
      return 1;
    } catch (error) {
      console.log(error);
      return 1;
    }
  }

}
