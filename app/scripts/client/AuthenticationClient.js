'use strict';

import {AuthenticationServicePromiseClient} from '../service/authentication_grpc_web_pb';
import {AuthenticationRequest} from '../service/authentication_pb';

import {baseUrl} from "./base_url";

export class AuthenticationClient {
  constructor() {
    this.authenticationServicePromiseClient = new AuthenticationServicePromiseClient(
      baseUrl,
      {},
      {})
  }

  authentication(accountId, token) {

    const request = new AuthenticationRequest();
    request.setAccountId(accountId);
    request.setToken(token);

    return this.authenticationServicePromiseClient
      .auth(request, {});
  }

}

