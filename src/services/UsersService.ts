import { getCustomRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import { UsersRepository } from "../repositories/UsersRepository";

export class UsersService<U extends { email: string }> {
    private repository: Repository<User>;

    constructor() {
        this.repository = getCustomRepository(UsersRepository);
    }

    async create({ email }: U) {
        const repository = getCustomRepository(UsersRepository);
        return await repository.findOne({ email }) ?? repository.save({ ...new User(), email });

    }

}