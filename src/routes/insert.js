import express from 'express';
const router = express.Router();
import * as controller from '../controllers';

router.get('/', controller.insertData);

module.exports = router;
