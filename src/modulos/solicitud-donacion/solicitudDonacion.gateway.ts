import { OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';


@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

export class SolicitudDonacionGateway implements OnGatewayInit {

    @WebSocketServer()
    server: Server;

    afterInit() {
        console.log('Inicializado!');
    }

    emitSolicitudesPendientesCount(count: number) {
        this.server.emit('solicitudesDonacionPendientesCount', count);
    }
}