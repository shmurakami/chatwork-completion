'use strict';

import {MentionSubscribeServiceClient} from '../service/mention_grpc_web_pb';
import {MentionSubscribeRequest} from '../service/mention_pb';
import {baseUrl} from "./base_url";

export class MentionSubscribeClient {
  constructor() {
    this.mentionSubscribeClient = new MentionSubscribeServiceClient(
      baseUrl,
      {},
      {});

    this.stream = null;
  }

  subscribe(credential, {onNext, onError, onUnsubscribe}) {
    if (!!this.stream) {
      return;
    }

    const request = new MentionSubscribeRequest();
    request.setAccountId(credential.account_id);

    const metadata = {
      deadline: new Date().getTime() + 60 * 1000,
      'X-Authorization': credential.token,
    };

    const stream = this.mentionSubscribeClient.subscribe(request, metadata);
    stream.on('data', onNext)
      .on('error', onError)
      .on('end', () => {
        this.stream = null;
        onUnsubscribe();
      });
    this.stream = stream;
  }

  unsubscribe() {
    if (!this.stream) {
      return;
    }

    this.stream.cancel();
    this.stream = null;
  }
}
