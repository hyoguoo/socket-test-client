import { bearerToken, pubPrefix } from '../config';

class MessageService {
  sendMessage({ client, type, messageToSend }) {
    client.send(
      `${pubPrefix}/${type}`,
      {
        Authorization: bearerToken,
      },
      JSON.stringify(messageToSend),
    );
  }
}

export const messageService = new MessageService();
