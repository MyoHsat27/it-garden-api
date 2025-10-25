import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: { origin: true },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger(NotificationsGateway.name);

  private readonly userSockets = new Map<number, Set<string>>();

  handleConnection(client: Socket) {
    this.logger.log(`Socket connected: ${client.id}`);
    client.on('identify', (payload: { userId: number }) => {
      if (!payload?.userId) return;
      const set = this.userSockets.get(payload.userId) ?? new Set<string>();
      set.add(client.id);
      this.userSockets.set(payload.userId, set);
      this.logger.log(
        `User ${payload.userId} associated with socket ${client.id}`,
      );
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket disconnected: ${client.id}`);
    for (const [userId, set] of this.userSockets.entries()) {
      if (set.has(client.id)) {
        set.delete(client.id);
        if (set.size === 0) this.userSockets.delete(userId);
        else this.userSockets.set(userId, set);
        break;
      }
    }
  }

  emitToUser(userId: number, event: string, payload: any) {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;
    for (const socketId of sockets) {
      this.server.to(socketId).emit(event, payload);
    }
  }

  emitToUsers(userIds: number[], event: string, payload: any) {
    userIds.forEach((id) => this.emitToUser(id, event, payload));
  }
}
