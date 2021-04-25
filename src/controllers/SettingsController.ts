import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";

export class SettingsController {
    async create(request: Request, response: Response): Promise<Response> {
        const service = new SettingsService();

        const entity = await service.create(request.body);
        return response.json(entity);
    }

    async findByUsername(request: Request, response: Response): Promise<Response> {
        const service = new SettingsService();
        const { username } = request.params;

        const entity = await service.findByUsername({ username });
        return response.json(entity);
    }


    async update(request: Request, response: Response): Promise<Response> {
        const service = new SettingsService();
        const { chat } = request.body;
        const { username } = request.params;

        const entity = await service.update({ username, chat });
        return response.json(entity);
    }
}