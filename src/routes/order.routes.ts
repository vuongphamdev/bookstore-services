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
import {
  accessTokenValidator,
  addOrderItemBodyValidator,
  createOrderBodyValidator,
  updateOrderBodyValidator,
} from '@middlewares';
import { WrapAsync } from '@utils';

const router = Router();

router.use(accessTokenValidator);

router.get('/', WrapAsync(searchOrders));
router.get('/:id', WrapAsync(getOrder));
router.post('/', createOrderBodyValidator, WrapAsync(createOrder));
router.put('/:id', updateOrderBodyValidator, WrapAsync(updateOrder));
router.delete('/:id', WrapAsync(deleteOrder));

router.get('/:orderId/items', WrapAsync(getOrderItems));
router.post('/:orderId/items', addOrderItemBodyValidator, WrapAsync(addOrderItem));
router.delete('/:orderId/items/:itemId', WrapAsync(removeOrderItem));

export default router;
