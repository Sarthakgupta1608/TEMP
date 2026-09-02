import { Router } from 'express';
import { PackageController } from '../controllers/package.controller';

const router = Router();

router.get('/packages', PackageController.getPackages);
router.get('/packages/:id', PackageController.getPackageById);
router.get('/destinations', PackageController.getDestinations);

export default router;
