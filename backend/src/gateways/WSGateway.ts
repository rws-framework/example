import {
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { RWSJSONMessage, RWSGateway, RWSFillService } from '@rws-framework/server';
import { ConfigService } from '@nestjs/config';

import { IWSData, IWSResponse } from './response-types/IWSGateWay';
import { WebsocketManagerService } from '@rws-framework/nest-interconnectors/src/backend/services/WebsocketManagerService';
import { Injectable } from '@rws-framework/server/nest';


@Injectable()
export class WSGateway extends RWSGateway {
  constructor(
    public appConfigService: ConfigService,
    public rwsFillService: RWSFillService,    
    public wsManagerService: WebsocketManagerService  
  ) {
    super(appConfigService, rwsFillService);
  }

  @SubscribeMessage('ws_message_event_name')
  async handleChat(
    @MessageBody() dataString: string,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const jsonData: RWSJSONMessage = this.getJson(dataString);    
    const payload: IWSData = jsonData.msg;
    const wsId: string | null | undefined = payload.wsId;

    if(!wsId){
      return;
    }

    try {  
      // Send response
      this.emitMessage<IWSResponse>('ws_response_event_name' + wsId, socket, {
        success: true,
        data: {
          wsId: wsId
        }
      });      
    } catch (error) {
      console.error('Error in gateway message:', error);
      this.throwError('ws_response_error_' + wsId, socket, error);
    }
  }

  sendFile(): void
  {

  }

  handleConnection(socket: Socket): void {
    this.wsManagerService.addClient(socket);    
  }

  handleDisconnect(socket: Socket): void {   
  }
}  