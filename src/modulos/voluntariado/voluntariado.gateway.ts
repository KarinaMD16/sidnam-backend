import { WebSocketGateway, WebSocketServer, OnGatewayInit } from "@nestjs/websockets";
import {Server} from 'socket.io'
import { Repository } from "typeorm";
import { SolicitudPendiente } from "./entities/solicitudPendiente.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { SolicitudPendienteNotificacion } from "./interfaces/SolicitudPendienteNotificacion";

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

    emitSolicitudesPendientesCount(count: number, solicitudPendiente: SolicitudPendienteNotificacion,) {
        const nombreCompleto = [
        solicitudPendiente.nombre,
        solicitudPendiente.apellido1,
        solicitudPendiente.apellido2,
        ]
        .filter(Boolean)
        .join(' ');

        this.server.emit('solicitudesPendientesCount', {
        totalPendientes: count,
        solicitud: {
            id: solicitudPendiente.id,
            nombre: nombreCompleto,
            email: solicitudPendiente.email,
            fecha: new Date().toISOString(),
        },
        mensaje: `${solicitudPendiente.nombre} envió una nueva solicitud`,
        });
    }
    
    emitirNomasSolicitudesPendientes() {
        this.server.emit('nomasSolicitudesPendientes', {
            totalPendientes: 0,
            mensaje: 'No hay más solicitudes pendientes por revisar',
            fecha: new Date().toISOString(),
        });
    }
}