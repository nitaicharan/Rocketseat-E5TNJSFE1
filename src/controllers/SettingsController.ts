import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";

export class SettingsController {

    async create(request: Request, response: Response): Promise<Response> {
        const service = new SettingsService();

        const entity = await service.create(request.body);
        return response.json(entity);
    }

}