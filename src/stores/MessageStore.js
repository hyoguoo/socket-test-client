import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { messageService } from '../services/MessageService';
import { baseUrl, bearerToken, roomIndices, subPrefix } from '../config';
import { chatType } from '../type/ChatType';

class MessageStore {
  constructor() {
    this.listeners = new Set();

    this.socket = null;
    this.client = null;
    this.connected = false;

    this.roomIndices = roomIndices;

    this.currentRoomShortUuid = 0;
    this.messageEntered = '';

    this.messageLogs = [];
  }

  connect(roomShortUuid) {
    this.socket = new SockJS(`${baseUrl}`);
    this.client = Stomp.over(this.socket);

    this.currentRoomShortUuid = roomShortUuid;

    this.subscribeMessageBroker(this.currentRoomShortUuid);

    this.connected = true;
    this.publish();
  }

  subscribeMessageBroker(roomShortUuid) {
    this.client.connect(
      {
        Authorization: bearerToken,
      },
      () => {
        this.client.subscribe(
          `${subPrefix}/${roomShortUuid}`,
          (messageReceived) => this.receiveMessage(messageReceived),
          {
            Authorization: bearerToken,
          },
        );

        this.sendMessage({ type: chatType.ENTER });
      },
    );
  }

  disconnect() {
    this.sendMessage({ type: chatType.QUIT });

    this.client.unsubscribe();
    this.client.disconnect();

    this.connected = false;
    this.currentRoomShortUuid = null;
    this.messageEntered = '';
    this.messageLogs = [];
    this.publish();
  }

  changeInput(value) {
    this.messageEntered = value;
    this.publish();
  }

  sendMessage({ type }) {
    const message = type === chatType.MESSAGE ? this.messageEntered : '';

    messageService.sendMessage({
      client: this.client,
      type,
      messageToSend: {
        roomShortUuid: this.currentRoomShortUuid,
        message,
      },
    });

    this.messageEntered = '';
    this.publish();
  }

  receiveMessage(messageReceived) {
    const message = JSON.parse(messageReceived.body);
    this.messageLogs = [...this.messageLogs, this.formatMessage(message)];
    this.publish();
  }

  formatMessage(message) {
    if (message.type === chatType.ENTER) {
      return {
        id: message.id,
        value: `User ${message.memberId} Enter (${message.timestamp})`,
      };
    }
    if (message.type === chatType.QUIT) {
      return {
        id: message.id,
        value: `User ${message.memberId} Quit (${message.timestamp})`,
      };
    }
    if (message.type === chatType.MESSAGE) {
      return {
        id: message.id,
        value: `${message.memberId}: ${message.value} (${message.timestamp})`,
      };
    }
    return {
      id: message.id,
      value: 'Unknown Type Message',
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
  }

  unsubscribe(listener) {
    this.listeners.delete(listener);
  }

  publish() {
    this.listeners.forEach((listener) => listener());
  }
}

export const messageStore = new MessageStore();
