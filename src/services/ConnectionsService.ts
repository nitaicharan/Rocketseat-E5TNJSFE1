import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate {
    user_id: string,
    socket_id: string,
    admin_id?: string,
    id?: string,
}

export class ConnectionsService<LBU extends { user_id: string }> {
    private repository: Repository<Connection>;

    constructor() {
        this.repository = getCustomRepository(ConnectionsRepository);
    }
    
    async create({ user_id, socket_id, admin_id, id, }: IConnectionCreate) {
        const connection = new Connection();
        return await this.repository.save({ ...connection, user_id, socket_id, admin_id, id: id ?? connection.id });
    }

    async findByUserId({ user_id }: LBU) {
        return await this.repository.findOne({ user_id });
    }
}