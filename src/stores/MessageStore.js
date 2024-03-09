import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { messageService } from '../services/MessageService';
import { baseUrl, bearerToken, chatType, subPrefix } from '../config';

class MessageStore {
  constructor() {
    this.listeners = new Set();

    this.memberId = 1;

    this.socket = null;
    this.client = null;
    this.connected = false;

    this.roomIndices = ['room1', 'room2', 'room3'];

    this.currentRoomId = 0;
    this.messageEntered = '';

    this.messageLogs = [];
  }

  connect(roomId) {
    this.socket = new SockJS(`${baseUrl}`);
    this.client = Stomp.over(this.socket);

    this.currentRoomId = roomId;

    this.subscribeMessageBroker(this.currentRoomId);

    this.connected = true;
    this.publish();
  }

  subscribeMessageBroker(roomId) {
    this.client.connect(
      {
        Authorization: bearerToken,
      },
      () => {
        this.client.subscribe(
          `${subPrefix}/chat/room/${roomId}`,
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
    this.currentRoomId = null;
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
        roomId: this.currentRoomId,
        memberId: this.memberId,
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
    if (message.type === chatType.READY) {
      return {
        id: message.id,
        value: `User ${message.memberId} Ready (${message.timestamp})`,
      };
    }
    if (message.type === chatType.UNREADY) {
      return {
        id: message.id,
        value: `User ${message.memberId} Unready (${message.timestamp})`,
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
