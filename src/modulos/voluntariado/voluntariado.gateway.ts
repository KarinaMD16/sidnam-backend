import { WebSocketGateway, WebSocketServer, OnGatewayInit } from "@nestjs/websockets";
import {Server} from 'socket.io'

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

export class VoluntariadoGateway implements OnGatewayInit{

    @WebSocketServer()
    server: Server;

    afterInit(){
        console.log('Esta corriendo crack')
    }

    emitSolicitudesPendientesCount(count: number){
        this.server.emit('solicitudesPendientesCount', count);
    }

}