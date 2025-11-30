import { Router } from 'express';
import {
  searchOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderItems,
  addOrderItem,
  removeOrderItem,
} from '@controllers';
import { accessTokenValidator } from '@middleware';

const router = Router();

// Protect all routes below
router.use(accessTokenValidator);

// Order CRUD operations
router.get('/', searchOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

// Order items management
router.get('/:orderId/items', getOrderItems);
router.post('/:orderId/items', addOrderItem);
router.delete('/:orderId/items/:itemId', removeOrderItem);

export default router;
