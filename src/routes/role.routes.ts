import { Router } from 'express';
import { getAllRoles, getRole, createRole, updateRole, deleteRole, assignUserRole, removeUserRole } from '@controllers';
import { accessTokenValidator } from '@middleware';

const router = Router();

// Protect all routes below
router.use(accessTokenValidator);

// Role CRUD operations
router.get('/', getAllRoles);
router.get('/:id', getRole);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);
// User role management
router.post('/assign', assignUserRole);
router.delete('/remove', removeUserRole);

export default router;
