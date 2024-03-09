import { bearerToken, pubPrefix } from '../config';

class MessageService {
  sendMessage({ client, type, messageToSend }) {
    client.send(
      `${pubPrefix}/chat/${type}`,
      {
        Authorization: bearerToken,
      },
      JSON.stringify(messageToSend),
    );
  }
}

export const messageService = new MessageService();
