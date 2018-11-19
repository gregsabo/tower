import makeType from './TowerType';
import { ISocket } from './Types';

const Socket = makeType('socket', [], {});

const oldCreate = Socket.create;
Socket.create = (...args: any[]): ISocket => {
  return oldCreate(...args) as ISocket;
};

export default Socket;
