import { getCustomRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import { UsersRepository } from "../repositories/UsersRepository";

export class UsersService {
    private repository: Repository<User>;

    constructor() {
        this.repository = getCustomRepository(UsersRepository);
    }

    async create({ email }) {
        return await this.repository.findOne({ email }) ?? this.repository.save({ ...new User(), email });
    }

    async findByEmail({ email }) {
        return await this.repository.findOne({ email });
    }
}