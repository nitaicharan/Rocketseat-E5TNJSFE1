import { getCustomRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import { UsersRepository } from "../repositories/UsersRepository";

export class UsersService<U extends { email: string }> {
    private repository: Repository<User>;

    constructor() {
        this.repository = getCustomRepository(UsersRepository);
    }

    async create({ email }: U) {
        return await this.repository.findOne({ email }) ?? this.repository.save({ ...new User(), email });
    }

    async findByEmail({ email }: U) {
        return await this.repository.findOne({ email });
    }
}