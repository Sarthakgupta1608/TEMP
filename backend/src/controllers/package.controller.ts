import { Request, Response, NextFunction } from 'express';
import { PackageService } from '../services/package.service';
import { sendSuccess } from '../utils/response';
import { getParam } from '../utils/params';

export class PackageController {
  static async getPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const { destination, maxPrice, page, limit } = req.query;
      const result = await PackageService.getAllPackages({
        destination: destination as string,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
      return sendSuccess(res, result, 'Packages fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getPackageById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParam(req, 'id');
      const pkg = await PackageService.getPackageById(id);
      return sendSuccess(res, pkg, 'Package details fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getDestinations(req: Request, res: Response, next: NextFunction) {
    try {
      const destinations = await PackageService.getAllDestinations();
      return sendSuccess(res, destinations, 'Destinations fetched');
    } catch (error) {
      next(error);
    }
  }
}
