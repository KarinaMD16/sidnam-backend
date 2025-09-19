import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { Area } from './entities/area.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateFacturaDto } from './dto/createFacturaDto';
import { CreateAreaDto } from './dto/createAreaDto';
import { CreateProveedor } from './dto/createProveedorDto';
import { MostrarAreasActivas } from './dto/mostrarAreasDto';
import { plainToInstance } from 'class-transformer';
import { Estado_Area } from 'src/common/enums/estadoArea.enum';
import { MostrarProveedores } from './dto/mostrarProveedoresDto';
import { MostrarFacturaDto } from './dto/mostrarFacturaDto';
import { Estado_Factura, FacturaOpts, getEstadoFactura } from 'src/common/enums/estadoFactura.enum';
import { ActualizarFacturaDto } from './dto/actualizarFacturaDto';
import { Estado_Proveedor } from 'src/common/enums/estadoProveedor.enum';
import { MostrarProveedoresSelect } from './dto/mostrarProveedorSelectDto';
import { UpdateProveedorDto } from './dto/updateProveedorDto';



@Injectable()
export class FacturasProveedoresService {


    constructor(
        @InjectRepository(Factura)
        private readonly facturaRepository: Repository<Factura>,
        @InjectRepository(Proveedor)
        private readonly proveedorRepository: Repository<Proveedor>,
        @InjectRepository(Area)
        private readonly areaRepository: Repository<Area>,
    ) {}

    async createArea(area: CreateAreaDto): Promise<{message: string}> {
        
        const areaRepetida = await this.areaRepository.findOneBy({ nombre: area.nombre.toLowerCase()});
        if (areaRepetida) {
            throw new BadRequestException('El área ya existe');
        }

        const nuevaArea = this.areaRepository.create({ nombre: area.nombre });
        this.areaRepository.save(nuevaArea);

        return {message: 'Area creada con exito'}
    }

    async getAreas(){
        return this.areaRepository.find()
    }

    async getAreasActivas(page?: number, limit?: number): Promise<{ data: MostrarAreasActivas[]; total: number }>{
        const [data, total] = await this.areaRepository.findAndCount({
            where: {estado: Estado_Area.activo},
            skip: page && limit ? (page - 1) * limit : 0,
            take: limit,
            order: { id_area: 'DESC' }, 
        })

        const dtos = plainToInstance(MostrarAreasActivas, data, { excludeExtraneousValues: true });

        return { data: dtos, total };
    }

    async createProveedor(createProveedor: CreateProveedor): Promise<{message: string}>{
        
        const areaExistente = await this.areaRepository.findOneBy({id_area: createProveedor.id_area})

        if(!areaExistente){
            throw new NotFoundException('Arae no registrada')
        }

        const proveedorNuevo = this.proveedorRepository.create({
            nombre: createProveedor.nombre,
            numero: createProveedor.numero_proveedor,
            correo: createProveedor.email,
            direccion: createProveedor.direccion,
            area: areaExistente,
        })

        this.proveedorRepository.save(proveedorNuevo)

        return {message: 'Proveedor agregado con exito'}
    }

    async getProveedores(){
        return this.proveedorRepository.find()
    }

    async buscarProveedoresPorNombre(filtro: string): Promise<MostrarProveedores[]> {
        const filtroNormalizado = filtro.toLowerCase().replace(/\s+/g, '');

        const proveedores = await this.proveedorRepository
            .createQueryBuilder('proveedor')
            .leftJoinAndSelect('proveedor.area', 'area')
            .where(`
            REPLACE(LOWER(COALESCE(proveedor.nombre, '')), ' ', '') LIKE :filtro
            `, { filtro: `%${filtroNormalizado}%` })
            .andWhere('proveedor.estado = :estado', { estado: Estado_Proveedor.activo })
            .getMany();

        return plainToInstance(MostrarProveedores, proveedores, { excludeExtraneousValues: true });
    }

    async getProveedoresPorArea(idArea: number): Promise<MostrarProveedores[]>{
        
        const area = await this.areaRepository.findOne({
            where: {id_area: idArea}
        })

        if(!area){
            throw new NotFoundException('Area no encontrada')
        }

        const proveedorPorArea = await this.proveedorRepository.find({
            where: {area: {id_area: idArea},
            estado: Estado_Proveedor.activo},
            relations: ['area']
        })

        if(!proveedorPorArea){
            return []
        }

        const dto = plainToInstance(MostrarProveedores, proveedorPorArea, {excludeExtraneousValues: true})

        return dto
    }

    async getAreaByID(id_area: number): Promise<MostrarAreasActivas>{

        const area = await this.areaRepository.findOne({
            where: {id_area}
        })

        if(!area){
            throw new NotFoundException('Area no encontrada')
        }

        const dto = plainToInstance(MostrarAreasActivas, area, {excludeExtraneousValues: true})

        return dto

    }


    async createFactura(createFactura: CreateFacturaDto): Promise<{message: string}> {
        
        const proveedor = await this.proveedorRepository.findOneBy({ id_proveedor: createFactura.proveedor_id });
        if (!proveedor) {
            throw new NotFoundException('Proveedor no encontrado');
        }

        const factura = this.facturaRepository.create({
            numero_factura: createFactura.numero_factura,
            fecha_emitida: createFactura.fecha_emision,
            fecha_pago: createFactura.fecha_pago,
            monto: createFactura.monto,
            proveedor
        });

        this.facturaRepository.save(factura);

        return {message: 'Factura creada con exito'}
    }

    async getFacturasPorProveedor(id_proveedor: number, page?: number, limit?: number): Promise<{ data: MostrarFacturaDto[]; total: number }> {

        const proveedorExistente = await this.proveedorRepository.findOne({
            where: {id_proveedor: id_proveedor}
        })

        if(!proveedorExistente){
            throw new NotFoundException('Proveedor inexistente')
        }

        const [data, total] = await this.facturaRepository.findAndCount({
            where: {proveedor: {id_proveedor: id_proveedor}},
            skip: page && limit ? (page - 1) * limit : 0,
            take: limit,
            order: { id_factura: 'DESC' }, 
            relations: ['proveedor', 'proveedor.area'],
        });

        const dtos = plainToInstance(MostrarFacturaDto, data, { excludeExtraneousValues: true });

        return { data: dtos, total };
    }

    async getProveedoresActivos(){
        
        const proveedores = await this.proveedorRepository.find({
            where: {estado: Estado_Proveedor.activo}
        })

        return plainToInstance(MostrarProveedoresSelect, proveedores, { excludeExtraneousValues: true });
    }

    async getFacturasPorNumero(numeroFactura: number): Promise<MostrarFacturaDto>{

        const facturaNumero = await this.facturaRepository.findOne({
            where: {numero_factura: numeroFactura},
            relations: ['proveedor', 'proveedor.area']
        })

        if(!facturaNumero){
            throw new NotFoundException('Numero de factura no encontrado')
        }

        const dto = plainToInstance(MostrarFacturaDto, facturaNumero, {excludeExtraneousValues: true})

        return dto
    }

    getEstadosFacturas() {
        return FacturaOpts.map(opt => ({
          id: opt.id,
          nombre: opt.nombre, 
        }));
    }

    async getFacturasPorEstado(idEstadoFactura: number, page?: number, limit?: number): Promise<{ data: MostrarFacturaDto[]; total: number }>{

        const estadoExistente = getEstadoFactura(idEstadoFactura)

        if(!estadoExistente){
            throw new NotFoundException('Estado no encontrado')
        }

        const [data, total] = await this.facturaRepository.findAndCount({
            where: {estado: estadoExistente},
            skip: page && limit ? (page - 1) * limit : 0,
            take: limit,
            order: { id_factura: 'DESC' }, 
        });

        const dto = plainToInstance(MostrarFacturaDto, data, {excludeExtraneousValues: true})

        return {data: dto, total}
    }

    async actualizarFactura(idFactura: number, actualizarFactura: ActualizarFacturaDto): Promise<{message: string}>{

        const factura = await this.facturaRepository.findOne({
            where: {id_factura: idFactura}
        })

        if(!factura){
            throw new NotFoundException('No se encontro la factura')
        }

        if(actualizarFactura.numero_factura){
            factura.numero_factura = actualizarFactura.numero_factura
        }

        if(actualizarFactura.fecha_emitida){
            factura.fecha_emitida = actualizarFactura.fecha_emitida
        }

        if(actualizarFactura.fecha_pago){
            factura.fecha_pago = actualizarFactura.fecha_pago
        }

        if(actualizarFactura.monto){
            factura.monto = actualizarFactura.monto
        }


        if(actualizarFactura.id_proveedor){
            
            const proveedor = await this.proveedorRepository.findOne({
                where: {id_proveedor: actualizarFactura.id_proveedor}
            })

            if(!proveedor){
                throw new NotFoundException('Proveedor no encontrado')
            }

            factura.proveedor = proveedor;
        }

        this.facturaRepository.save(factura)

        return {message: 'Factura actualizada con exito'}


    }


    async actualizarEstadoFactura(id: number) {

        const factura = await this.facturaRepository.findOne({
           where: { id_factura: id },
        });

        if (!factura) {
           throw new NotFoundException(`Factura con id ${id} no encontrada`);
        }

        factura.estado = Estado_Factura.pagada;

        return await this.facturaRepository.save(factura);
    }

    async toggleArchivadoProveedor(id: number) {

        const proveedor = await this.proveedorRepository.findOne({
            where: { id_proveedor: id },
            relations: ['facturas'],
        });

        if (!proveedor) {
          throw new NotFoundException(`Proveedor con id ${id} no encontrado`);
        }

        if (proveedor.estado === Estado_Proveedor.activo) {
           const tienePendientes = proveedor.facturas.some(
           (f) => f.estado === Estado_Factura.pendiente,
        );

        if (tienePendientes) {
           throw new BadRequestException(`No se puede archivar al proveedor con id ${id} porque tiene facturas pendientes.`);
        }

        proveedor.estado = Estado_Proveedor.inactivo;
        } else {
    
        proveedor.estado = Estado_Proveedor.activo;
       }

       return await this.proveedorRepository.save(proveedor);
    }

    async getProveedoresArchivados(id: number) {

      const where: FindOptionsWhere<Proveedor> = {
      estado: Estado_Proveedor.inactivo,
      area: { id_area: id } as FindOptionsWhere<Area>,
    };

    return await this.proveedorRepository.find({
       where,
       relations: ['area'],
       select: {
         id_proveedor: true,
         nombre: true,
         numero: true,
         correo: true,
         direccion: true,
         area: {
          id_area: true,
          nombre: true,
        },
       },
     });
    }


    async updateProveedor(idProveedor: number, dto: UpdateProveedorDto): Promise<{ message: string }> {

        const proveedor = await this.proveedorRepository.findOne({
        where: { id_proveedor: idProveedor },
        relations: { area: true },
        });

        if (!proveedor) {
           throw new NotFoundException('Proveedor no encontrado');
        }

        if (
        dto.nombre === undefined &&
        dto.numero === undefined &&
        dto.correo === undefined &&
        dto.direccion === undefined 
       ) {
          throw new BadRequestException('No hay campos para actualizar');
        }

        let touched = false;

        if (dto.nombre !== undefined) {
           proveedor.nombre = dto.nombre;
           touched = true;
        }

        if (dto.numero !== undefined) {
           proveedor.numero = dto.numero;
           touched = true;
        }

        if (dto.correo !== undefined) {
           proveedor.correo = dto.correo;
           touched = true;
        }

        if (dto.direccion !== undefined) {
           proveedor.direccion = dto.direccion;
           touched = true;
        }

        if (touched) {
          await this.proveedorRepository.save(proveedor);
        }

      return { message: 'Proveedor actualizado exitosamente' };
    }

    async getFacturas(page?: number, limit?: number, estado?: number): Promise<{ data: MostrarFacturaDto[]; total: number }> {

        const estadoExistente = estado ? getEstadoFactura(estado) : undefined;

        if (estado && !estadoExistente) {
            throw new NotFoundException('Estado no encontrado');
        }

        const [data, total] = await this.facturaRepository.findAndCount({
            where: estadoExistente !== undefined ? { estado: estadoExistente } : undefined,
            skip: page && limit ? (page - 1) * limit : 0,
            take: limit,
            order: { id_factura: 'DESC' },
        });


        const dto = plainToInstance(MostrarFacturaDto, data, { excludeExtraneousValues: true })

        return { data: dto, total }

    }
}
