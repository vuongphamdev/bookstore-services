// ==================== USERS ====================
export enum EUserStatus {
  ACTIVE = 'A',
  INACTIVE = 'I',
  SUSPENDED = 'S',
  UNVERIFIED = 'U',
  DELETED = 'X',
}

//=================== ROLES ====================
export enum EUserRole {
  ADMIN = 'A',
  USER = 'U',
  GUEST = 'G',
}

//=================== PRODUCTS ====================
export enum EProductCategory {
  ELECTRONICS = 'E',
  FASHION = 'F',
  HOME = 'H',
  BEAUTY = 'B',
  SPORTS = 'S',
  TOYS = 'T',
  OTHERS = 'O',
}

export enum EProductStatus {
  AVAILABLE = 'A',
  OUT_OF_STOCK = 'O',
  PREORDER = 'P',
  DISCONTINUED = 'D',
  DELETED = 'X',
}

//=================== SHOPS ====================
export enum EShopStatus {
  ACTIVE = 'A',
  INACTIVE = 'I',
  SUSPENDED = 'S',
  CLOSED = 'C',
  DELETED = 'X',
}

//=================== ORDERS ====================
export enum EOrderStatus {
  PENDING = 'P', // Order created, awaiting payment
  CONFIRMED = 'F', // F for conFirmed - payment received
  PREPARING = 'R', // R for pReparing - being prepared
  READY_TO_SHIP = 'Y', // Y for readY - packed and ready
  PICKED_UP = 'U', // Order picked up by carrier/in transit
  IN_TRANSIT = 'T', // In Transit - on the way to customer
  OUT_FOR_DELIVERY = 'O', // Out for delivery - final mile
  DELIVERED = 'D', // Order delivered to customer
  COMPLETED = 'C', // Order completed (customer confirmed receipt)
  CANCELLED = 'X', // Order cancelled
  REFUNDED = 'N', // N for refuNded (optional - for returns)
}

//=================== JOBS AND STOPS ====================
export enum EJobStatus {
  PENDING = 'P', // Job created, awaiting assignment
  ASSIGNED = 'A', // Job assigned to a worker
  IN_PROGRESS = 'I', // Job is currently being worked on
  ON_HOLD = 'H', // Job is on hold for some reason
  COMPLETED = 'C', // Job has been completed successfully
  CANCELLED = 'X', // Job has been cancelled
}

export enum EStopType {
  PICKUP = 'P', // Pickup location
  DROPOFF = 'D', // Drop-off location
  BOTH = 'B', // Both pickup and drop-off
}

export enum EStopStatus {
  PENDING = 'P', // Stop created, awaiting action
  ARRIVED = 'A', // Arrived at the stop location
  IN_PROGRESS = 'I', // Stop is currently being serviced
  DEPARTED = 'D', // Departed from the stop location
  COMPLETED = 'C', // Stop has been completed
  SKIPPED = 'S', // Stop was skipped
  CANCELLED = 'X', // Stop has been cancelled
}

//=================== MANIFESTS ====================
export enum EManifestStatus {
  NEW = 'N', // Manifest created, awaiting processing
  PROCESSING = 'P', // Manifest is being processed
  COMPLETED = 'C', // Manifest processing completed
  CLOSED = 'X', // Manifest has been cancelled
}

//=================== PAYMENTS ====================
export enum EPaymentMethod {
  CREDIT_CARD = 'C', // Credit/Debit Card
  PAYPAL = 'P', // PayPal
  BANK_TRANSFER = 'B', // Bank Transfer
  CASH_ON_DELIVERY = 'D', // COD
  WALLET = 'W', // Digital Wallet (Apple Pay, Google Pay, etc.)
  CRYPTO = 'Y', // Y for crYpto
}

export enum EPaymentStatus {
  PENDING = 'P', // Payment initiated, awaiting confirmation
  PROCESSING = 'R', // Payment being processed
  AUTHORIZED = 'A', // Payment authorized (card hold)
  PAID = 'D', // D for paiD - payment successful
  FAILED = 'F', // Payment failed
  REFUNDED = 'N', // N for refuNded
  PARTIALLY_REFUNDED = 'L', // L for partiaLly refunded
  CANCELLED = 'X', // Payment cancelled
}
