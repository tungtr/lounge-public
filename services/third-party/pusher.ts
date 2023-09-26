// Essentials
import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new PusherServer({
  appId: '1673196',
  key: '6a770b974c95b9caf86b',
  secret: '970b90f5eb898a7772eb',
  cluster: 'ap1',
  useTLS: true
});

export const pusherClient = new PusherClient('6a770b974c95b9caf86b', {
  cluster: 'ap1'
});