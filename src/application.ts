import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  MyUserService, TokenServiceBindings, UserServiceBindings
} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {JWTService} from './services/jwt.service';
import {UserService} from './services/user.service';

export {ApplicationConfig};

export class SakilaApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);

    this.setUpBindings()




  }
  setUpBindings(): void {

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(UserService);


    // // Use JWT secret from JWT_SECRET environment variable if set
    // // otherwise create a random string of 64 hex digits
    const secret = process.env.TOKEN_SECRET || "vochihieu";
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(secret);
    const expiresIn = process.env.TOKEN_EXPIRES_IN ?? "300" // 5 p
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(expiresIn);
  }

}
