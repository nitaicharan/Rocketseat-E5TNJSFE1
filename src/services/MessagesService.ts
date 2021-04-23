import { getCustomRepository, Repository } from "typeorm";
import { Message } from "../entities/Message";
import { MessagesRepository } from "../repositories/MessagesRepository";

interface IMessageCreate {
    admin_id?: string,
    text: string,
    user_id: string,
}

export class MessagesService<LBU extends { user_id: string }> {
    private repository: Repository<Message>;

    constructor() {
        this.repository = getCustomRepository(MessagesRepository);
    }

    async create({ admin_id, text, user_id, }: IMessageCreate) {
        return await this.repository.save({ ...new Message(), admin_id, text, user_id });
    }

    async listByUser({ user_id }: LBU) {
        return await this.repository.find({
            where: { user_id },
            relations: ['user'],
        })
    }
}