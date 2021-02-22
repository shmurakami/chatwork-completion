'use strict';

import {MentionServicePromiseClient} from '../service/mention_grpc_web_pb';
import {MentionListRequest} from '../service/mention_pb';
import {baseUrl} from "./base_url";

export class MentionListClient {

  constructor() {
    this.mentionServiceClient = new MentionServicePromiseClient(
      baseUrl,
      {},
      {});
  }

  fetch(credential) {
    const request = new MentionListRequest();
    request.setAccountId(credential.account_id);

    const metadata = {'X-Authorization': credential.token};

    return this.mentionServiceClient.list(request, metadata);
  }

}
