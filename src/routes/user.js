import express from 'express';
const router = express.Router();
import * as controller from '../controllers';
import { verifyToken } from '../middlewares/verify_token';
import { isAdmin } from '../middlewares/verify_role';
//PUBLIC ROUTE

router.use(verifyToken);

// PRIVATE ROUTE
router.get('/', controller.getCurrent);

module.exports = router;
