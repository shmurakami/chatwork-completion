'use strict';

import {AuthenticationServicePromiseClient} from '../service/authentication_grpc_web_pb';
import {AuthenticationRequest} from '../service/authentication_pb';

import {baseUrl} from "./base_url";

export class AuthenticationClient {
  constructor() {
    this.authenticationServicePromiseClient = new AuthenticationServicePromiseClient(
      baseUrl,
      {},
      {
        suppressCorsPreflight: true,
      })
  }

  authentication(accountId, token) {

    return this.authenticationServicePromiseClient
      .auth(
        new AuthenticationRequest([
          accountId,
          token,
        ])
        , {})
  }

}

