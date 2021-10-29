// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {UserService as UserServiceRoot} from '@loopback/authentication';
import {User} from '@loopback/authentication-jwt';
import {
  repository
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import bcrypt from "bcrypt";
import {CustomerRepository, TokenRepository} from '../repositories';



export interface input {
  email: string
  password: string
}



export class UserService implements UserServiceRoot<User, input> {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(TokenRepository)
    public tokenRepository: TokenRepository,
    // public hashpass: hashPassword
  ) { }

  async verifyCredentials(credentials: input): Promise<any> {

    const {email, password} = credentials;
    const invalidCredentialsError = 'Invalid email or password.';

    if (!email) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const found_user = <any>await this.customerRepository.findOne({where: {email: email}});
    //find user
    if (found_user) {
      // check pass
      const check_password = await this.comparepass(password, found_user.password);
      if (check_password) {
        return found_user;
      }
      else {
        throw new HttpErrors.Unauthorized(invalidCredentialsError)
      }
    }

    else {
      throw new HttpErrors.Unauthorized(invalidCredentialsError)
    }

  };






  convertToUserProfile(user: User): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided
    return {
      [securityId]: `${user.id}`,
      first_name: user.first_name,
      last_name: user.first_name,
      id: user.id,
      email: user.email,

    };
  };


  // async hashPass(password: string) {
  //   return await this.passwordHasher.hashPassword(password);
  // }

  async comparepass(password: string, hasspass: string): Promise<boolean> {
    if (await bcrypt.compare(password, hasspass)) {
      return true;
    }
    return false;
  }

  async hashpass(password: string) {
    const password_hash = await bcrypt.hash(password, 10);
    return password_hash;
  }

}
