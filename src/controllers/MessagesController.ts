import { Request, Response } from "express";
import { MessagesService } from "../services/MessagesService";

export class MessagesController {

    async create(request: Request, response: Response): Promise<Response> {
        const service = new MessagesService();

        const entity = await service.create(request.body);
        return response.json(entity);
    }

    async fetchByUser(request: Request<{ user_id: string }>, response: Response): Promise<Response> {
        const service = new MessagesService();

        const entity = await service.listByUserId(request.params);
        return response.json(entity);
    }
}