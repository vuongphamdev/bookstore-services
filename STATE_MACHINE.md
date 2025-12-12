User create Order => status = PENDING

Shop owner update order status => status = CONFIRMED => Job created

Shop owner update order status => status = PREPARING

Shop owner update order status => status = READY_TO_SHIP

Driver update order status => status = PICKED_UP

Driver update order status => status = IN_TRANSIT

Driver update order status => status = OUT_FOR_DELIVERY

Driver update order status => status = DELIVERED

Shop owner update order status => status = COMPLETED

User and Shop owner can update order status => status = CANCELLED When status is PENDING or CONFIRMED

Shop owner can update order status => status = RETURNED
