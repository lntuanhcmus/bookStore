import express from 'express';
const router = express.Router();
import * as controller from '../controllers';
import { isCreatorOrAdmin } from '../middlewares/verify_role';
import { verifyToken } from '../middlewares/verify_token';
import uploadCloud from '../middlewares/uploader';

router.get('/', controller.getBooks);

router.use(verifyToken);
router.use(isCreatorOrAdmin);

router.post('/', uploadCloud.single('image'), controller.createNewBook);
router.put('/', uploadCloud.single('image'), controller.updateBook);
router.delete('/', controller.deleteBook);

module.exports = router;
