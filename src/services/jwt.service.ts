// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {TokenRepository} from '../repositories';


const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
    @repository(TokenRepository)
    private tokenRepository: TokenRepository

  ) {

  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decodedToken = await verifyAsync(token, this.jwtSecret);
      userProfile = Object.assign(
        {[securityId]: ''},
        {
          [securityId]: decodedToken.curtomer_id,
          customer_id: decodedToken.customer_id,
          first_name: decodedToken.first_name,
          last_name: decodedToken.last_name,
          email: decodedToken.email,

        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error}`,
      );
    }
    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<any> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }

    const userInfoForToken = {
      customer_id: userProfile.id,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      email: userProfile.email,

    };
    // Generate a JSON Web Token
    let token: string;
    let refreshToken: string;
    try {
      console.log(userInfoForToken)
      token = await signAsync(userInfoForToken, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });


      refreshToken = await signAsync(userInfoForToken, this.jwtSecret);
      const body = {
        customer_id: userInfoForToken.customer_id,
        refresh_token: refreshToken
      }
      await this.tokenRepository.create(body);


    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    return {acesstoken: token, refreshToken: refreshToken};
  };



  // async getRefreshToken(userInfo: any) {
  //   // const find_refresh = await this.tokenRepository.deleteAll({customer_id: uesrInfo.id});
  //   const find_refresh = await this.tokenRepository.findOne({where: {customer_id: userInfo.customer_id}});
  //   if (find_refresh) {
  //     let Token = await signAsync(userInfo, this.jwtSecret, {
  //       expiresIn: Number(this.jwtExpiresIn),
  //     });
  //     let refreshToken = await signAsync(userInfo, this.jwtSecret);
  //     await this.tokenRepository.updateAll(refreshToken, {customer_id: userInfo.customer_id});
  //     return {acesstoken: Token, refreshToken: refreshToken};
  //   }
  //   else {
  //     throw new HttpErrors.Unauthorized('Invalid token')
  //   }

  // }






}
