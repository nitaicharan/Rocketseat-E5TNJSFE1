import { getCustomRepository, Repository } from "typeorm";
import { Setting } from "../entities/Setting";
import { SettingsRepository } from "../repositories/SettingsRepository";

interface ISettingsCreate {
    chat: boolean;
    username: string;
}

export class SettingsService {
    private repository: Repository<Setting>;

    constructor() {
        this.repository = getCustomRepository(SettingsRepository);
    }

    async create({ chat, username }: ISettingsCreate) {
        return await this.repository.findOne({ username }) ?? this.repository.save({ ...new Setting(), username, chat });
    }

}