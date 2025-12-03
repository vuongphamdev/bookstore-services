import { Router } from 'express';
import { getAllRoles, getRole, createRole, updateRole } from '@controllers';
import { accessTokenValidator, createRoleBodyValidator, updateRoleBodyValidator } from '@middlewares';
import { WrapAsync } from '@utils';

const router = Router();

router.use(accessTokenValidator);

router.get('/', WrapAsync(getAllRoles));
router.get('/:id', WrapAsync(getRole));
router.post('/', createRoleBodyValidator, WrapAsync(createRole));
router.put('/:id', updateRoleBodyValidator, WrapAsync(updateRole));

export default router;
