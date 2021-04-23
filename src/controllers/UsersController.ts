import { Request, Response } from "express";
import { UsersService } from "../services/UsersService";

export class UsersController {

    async create(request: Request, response: Response): Promise<Response> {
        const service = new UsersService();

        const entity = await service.create(request.body);
        return response.json(entity);
    }

}