import express  from 'express';
const router = express.Router();
import * as controller  from '../controllers';

router.post('/register',controller.register);
router.post('/login',controller.login);

module.exports = router;