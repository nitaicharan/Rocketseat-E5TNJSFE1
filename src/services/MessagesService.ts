import { getCustomRepository, Repository } from "typeorm";
import { Message } from "../entities/Message";
import { MessagesRepository } from "../repositories/MessagesRepository";

interface IMessageCreate {
    admin_id?: string,
    text: string,
    user_id: string,
}

export class MessagesService {
    private repository: Repository<Message>;

    constructor() {
        this.repository = getCustomRepository(MessagesRepository);
    }

    async create({ admin_id, text, user_id, }: IMessageCreate) {
        return await this.repository.save({ ...new Message(), admin_id, text, user_id });
    }

    async listByUserId({ user_id }) {
        return await this.repository.find({
            where: { user_id },
            relations: ['user'],
        })
    }
}