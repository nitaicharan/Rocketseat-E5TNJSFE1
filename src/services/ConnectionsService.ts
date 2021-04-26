import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate {
    user_id: string,
    socket_id: string,
    admin_id?: string,
    id?: string,
}

export class ConnectionsService {
    private repository: Repository<Connection>;

    constructor() {
        this.repository = getCustomRepository(ConnectionsRepository);
    }

    async create({ user_id, socket_id, admin_id, id, }: IConnectionCreate) {
        const connection = new Connection();
        return await this.repository.save({ ...connection, user_id, socket_id, admin_id, id: id ?? connection.id });
    }

    async findByUserId({ user_id }) {
        return await this.repository.findOne({ user_id });
    }

    async findAllWithoutAdmin() {
        return await this.repository.find({
            where: { admin_id: null },
            relations: ['user']
        });
    }

    async findBySocketId({ socket_id }) {
        return this.repository.findOne({ socket_id });
    }

    async updateAdminId({ user_id, admin_id }) {
        await this.repository.createQueryBuilder().createQueryBuilder()
            .update(Connection)
            .set({ admin_id })
            .where('user_id = :user_id', { user_id })
            .execute();
    }
}