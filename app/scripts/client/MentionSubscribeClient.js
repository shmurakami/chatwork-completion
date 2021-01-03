'use strict';

import {MentionSubscribeServiceClient} from '../service/mention_grpc_web_pb';
import {MentionSubscribeRequest} from '../service/mention_pb';

export class MentionSubscribeClient {
  constructor() {
    this.mentionSubscribeClient = new MentionSubscribeServiceClient();

    this.stream = null;
  }

  subscribe(accountId, {onNext, onError, onUnsubscribe}) {
    if (!!this.stream) {
      return;
    }

    const request = new MentionSubscribeRequest();
    request.setAccountId(accountId);

    const stream = this.mentionSubscribeClient.subscribe(request, {});
    stream.on('data', onNext)
      .on('error', onError)
      .on('end', onUnsubscribe);
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
