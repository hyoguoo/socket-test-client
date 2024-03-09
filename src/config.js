export const baseUrl = 'http://localhost:8080/ws-stomp';
export const chatType = {
  ENTER: 'enter',
  QUIT: 'quit',
  MESSAGE: 'message',
  READY: 'ready',
  UNREADY: 'unready',
  CHANGE_HOST: 'change-host',
  START_CODING: 'start-coding',
  END_CODING: 'end-coding',
};
export const pubPrefix = '/publication';
export const subPrefix = '/subscription';
export const bearerToken = 'Bearer your.token'; // Type your token here
