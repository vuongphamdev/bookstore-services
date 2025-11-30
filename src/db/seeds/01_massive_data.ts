import { Knex } from 'knex';
import { fa, faker } from '@faker-js/faker';
import {
  EOrderStatus,
  EProductCategory,
  EProductStatus,
  EUserStatus,
  EShopStatus,
  EJobStatus,
  EStopType,
  EStopStatus,
  EManifestStatus,
  ERole,
} from '@constants/enums';
import { Job, Order, OrderItem, Product, Shop, User, Driver, Manifest, Stop } from '@models/schemas';

faker.seed(123);

function fastRandom(max: number): number {
  return Math.floor(Math.random() * max);
}

function fastPrice(): number {
  return Math.round((Math.random() * 95 + 5) * 100) / 100; // $5.00 - $99.99
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export async function seed(knex: Knex): Promise<void> {
  console.log('🚀 Starting data generation...');

  // Configuration
  const TOTAL_USERS = 1000;
  const TOTAL_SHOPS = 100;
  const PRODUCTS_PER_SHOP_MIN = 1;
  const PRODUCTS_PER_SHOP_MAX = 10;
  const TOTAL_ORDERS = 5000;
  const ORDER_ITEMS_MIN = 1;
  const ORDER_ITEMS_MAX = 5;
  const STOPS_PER_ORDER = 2;
  const TOTAL_DRIVERS = 100;
  const TOTAL_MANIFESTS = 300;

  const batchSize = 500;

  const cleanup = async () => {
    // Rollback or cleanup logic can be added here if needed
    console.log('🧹 Cleaning existing data...');
    await knex('stops').del();
    await knex('jobs').del();
    await knex('manifests').del();
    await knex('drivers').del();
    await knex('order_items').del();
    await knex('orders').del();
    await knex('products').del();
    await knex('shops').del();
    await knex('users').del();
  };

  try {
    // Clear existing data in reverse dependency order
    await cleanup();

    // 1. Generate Users (1000)
    console.log(`👥 Generating ${TOTAL_USERS} users...`);
    const roles = [ERole.ADMIN, ERole.USER, ERole.GUEST];

    for (let batch = 0; batch < Math.ceil(TOTAL_USERS / batchSize); batch++) {
      const users: User[] = [];
      const start = batch * batchSize;
      const end = Math.min(start + batchSize, TOTAL_USERS);

      for (let i = start; i < end; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        users.push(
          new User({
            id: i + 1,
            name: `${firstName} ${lastName}`,
            email: faker.internet.email({ firstName, lastName }).toLowerCase() + `_${i}`,
            password: faker.internet.password({ length: 10 }),
            status: i < 10 ? EUserStatus.ACTIVE : fastRandom(10) < 8 ? EUserStatus.ACTIVE : EUserStatus.INACTIVE,
            phone_number: faker.phone.number(),
            address: faker.location.streetAddress(),
            dob: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
            role: roles[fastRandom(roles.length)],
          })
        );
      }
      await knex('users').insert(users.map((u) => u.toRow()));
      console.log(`   ✓ Users batch ${batch + 1}/${Math.ceil(TOTAL_USERS / batchSize)} completed`);
    }

    // 2. Generate Shops (100)
    console.log(`🏪 Generating ${TOTAL_SHOPS} shops...`);
    const shopStatuses = [EShopStatus.ACTIVE, EShopStatus.INACTIVE];

    for (let batch = 0; batch < Math.ceil(TOTAL_SHOPS / batchSize); batch++) {
      const shops: Shop[] = [];
      const start = batch * batchSize;
      const end = Math.min(start + batchSize, TOTAL_SHOPS);

      for (let i = start; i < end; i++) {
        const sellerId = fastRandom(TOTAL_USERS) + 1;
        shops.push(
          new Shop({
            id: i + 1,
            user_id: sellerId,
            name: faker.company.name() + ` Shop ${i + 1}`,
            description: faker.company.catchPhrase(),
            status: shopStatuses[fastRandom(shopStatuses.length)],
          })
        );
      }
      await knex('shops').insert(shops.map((s) => s.toRow()));
      console.log(`   ✓ Shops batch ${batch + 1}/${Math.ceil(TOTAL_SHOPS / batchSize)} completed`);
    }

    // 3. Generate Products (random 1-10 per shop)
    console.log(`📦 Generating products (${PRODUCTS_PER_SHOP_MIN}-${PRODUCTS_PER_SHOP_MAX} per shop)...`);
    const categories = [
      EProductCategory.ELECTRONICS,
      EProductCategory.FASHION,
      EProductCategory.HOME,
      EProductCategory.BEAUTY,
      EProductCategory.SPORTS,
      EProductCategory.TOYS,
      EProductCategory.OTHERS,
    ];
    const productStatuses = [EProductStatus.AVAILABLE, EProductStatus.OUT_OF_STOCK, EProductStatus.PREORDER];

    let productCount = 0;
    for (let shopId = 1; shopId <= TOTAL_SHOPS; shopId++) {
      const productsForShop = fastRandom(PRODUCTS_PER_SHOP_MAX - PRODUCTS_PER_SHOP_MIN + 1) + PRODUCTS_PER_SHOP_MIN;
      const products: Product[] = [];

      for (let i = 0; i < productsForShop; i++) {
        productCount++;
        products.push(
          new Product({
            id: productCount,
            shop_id: shopId,
            name: faker.commerce.productName(),
            sku: `SKU-${shopId}-${i + 1}-${Date.now() + i}`,
            category: categories[fastRandom(categories.length)],
            description: faker.commerce.productDescription(),
            price: fastPrice(),
            stock: fastRandom(200),
            status: productStatuses[fastRandom(productStatuses.length)],
            metadata: JSON.stringify({
              brand: faker.company.name(),
              weight: `${fastRandom(10) + 1}kg`,
            }),
          })
        );
      }

      if (products.length > 0) {
        await knex('products').insert(products.map((p) => p.toRow()));
      }

      if (shopId % 20 === 0) {
        console.log(`   ✓ Products for ${shopId}/${TOTAL_SHOPS} shops completed (${productCount} products so far)`);
      }
    }
    console.log(`   ✓ Total products generated: ${productCount}`);

    // Get all product IDs for order items
    const allProducts = await knex('products').select('id', 'price', 'shop_id');

    // 4. Generate Orders (5000)
    console.log(`🛒 Generating ${TOTAL_ORDERS} orders...`);
    const orderStatuses = [
      EOrderStatus.PENDING,
      EOrderStatus.CONFIRMED,
      EOrderStatus.PREPARING,
      EOrderStatus.READY_TO_SHIP,
      EOrderStatus.PICKED_UP,
      EOrderStatus.IN_TRANSIT,
      EOrderStatus.OUT_FOR_DELIVERY,
      EOrderStatus.DELIVERED,
      EOrderStatus.COMPLETED,
    ];

    for (let batch = 0; batch < Math.ceil(TOTAL_ORDERS / batchSize); batch++) {
      const orders: Order[] = [];
      const start = batch * batchSize;
      const end = Math.min(start + batchSize, TOTAL_ORDERS);

      for (let i = start; i < end; i++) {
        const buyerId = fastRandom(TOTAL_USERS) + 1;
        const shopId = fastRandom(TOTAL_SHOPS) + 1;

        orders.push(
          new Order({
            id: i + 1,
            shop_id: shopId,
            buyer_id: buyerId,
            status: orderStatuses[fastRandom(orderStatuses.length)],
            notes: fastRandom(10) < 3 ? faker.lorem.sentence() : null,
          })
        );
      }

      await knex('orders').insert(orders.map((o) => o.toRow()));
      console.log(`   ✓ Orders batch ${batch + 1}/${Math.ceil(TOTAL_ORDERS / batchSize)} completed`);
    }

    // 5. Generate Order Items (1-5 per order)
    console.log(`📝 Generating order items (${ORDER_ITEMS_MIN}-${ORDER_ITEMS_MAX} per order)...`);

    let orderItemCount = 0;
    for (let batch = 0; batch < Math.ceil(TOTAL_ORDERS / batchSize); batch++) {
      const orderItems: OrderItem[] = [];
      const start = batch * batchSize;
      const end = Math.min(start + batchSize, TOTAL_ORDERS);

      for (let i = start; i < end; i++) {
        const orderId = fastRandom(TOTAL_ORDERS) + 1;
        const numItems = fastRandom(ORDER_ITEMS_MAX - ORDER_ITEMS_MIN + 1) + ORDER_ITEMS_MIN;

        for (let j = 0; j < numItems; j++) {
          const product = allProducts[fastRandom(allProducts.length)];
          const quantity = fastRandom(5) + 1;

          orderItems.push(
            new OrderItem({
              id: ++orderItemCount,
              order_id: orderId,
              product_id: product.id,
              quantity: quantity,
              price: product.price,
            })
          );
        }
      }

      await knex('order_items').insert(orderItems.map((oi) => oi.toRow()));
      console.log(`   ✓ Order items batch ${batch + 1}/${Math.ceil(TOTAL_ORDERS / batchSize)} completed`);
    }

    // 6. Generate Drivers (100)
    console.log(`🚗 Generating ${TOTAL_DRIVERS} drivers...`);
    const drivers: Driver[] = [];
    for (let i = 0; i < TOTAL_DRIVERS; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      // 70% of drivers have vehicles, 30% don't have vehicles yet
      const vehicleId = fastRandom(10) < 7 ? fastRandom(5) + 1 : null;

      drivers.push(
        new Driver({
          id: i + 1,
          name: `${firstName} ${lastName}`,
          code: `DRV-${String(i + 1).padStart(4, '0')}`,
          status: i < 80 ? EUserStatus.ACTIVE : EUserStatus.INACTIVE,
          age: fastRandom(30) + 25, // 25-54 years old
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          zip: faker.location.zipCode(),
          license_number: `LIC-${faker.string.alphanumeric(8).toUpperCase()}`,
          vehicle_id: vehicleId,
          phone_number: faker.phone.number(),
        })
      );
    }
    await knex('drivers').insert(drivers.map((d) => d.toRow()));
    console.log(`   ✓ Drivers generation completed`);

    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 7. Generate Manifests (based on drivers, random dates for next 1 week)
    console.log(`📋 Generating manifests for drivers...`);
    const manifestStatuses = [EManifestStatus.NEW, EManifestStatus.PROCESSING, EManifestStatus.COMPLETED];
    const manifests: Manifest[] = [];
    for (let i = 0; i < TOTAL_MANIFESTS; i++) {
      manifests.push(
        new Manifest({
          id: i + 1,
          driver_id: fastRandom(TOTAL_DRIVERS) + 1,
          vehicle_id: fastRandom(5) + 1,
          manifest_date: randomDate(now, oneWeekLater),
          status: manifestStatuses[fastRandom(manifestStatuses.length)],
          notes: fastRandom(10) < 2 ? faker.lorem.sentence() : null,
        })
      );
    }
    await knex('manifests').insert(manifests.map((m) => m.toRow()));
    console.log(`   ✓ Manifests generation completed`);

    // 8. Generate Jobs (1 job per order, assigned to random manifests)
    console.log(`💼 Generating ${TOTAL_ORDERS} jobs (1 per order)...`);
    const jobStatuses = [EJobStatus.PENDING, EJobStatus.ASSIGNED, EJobStatus.IN_PROGRESS, EJobStatus.COMPLETED];

    for (let batch = 0; batch < Math.ceil(TOTAL_ORDERS / batchSize); batch++) {
      const jobs: Job[] = [];
      const start = batch * batchSize;
      const end = Math.min(start + batchSize, TOTAL_ORDERS);

      for (let i = start; i < end; i++) {
        const orderId = fastRandom(TOTAL_ORDERS) + 1;
        const manifestId = fastRandom(TOTAL_MANIFESTS) + 1;

        jobs.push(
          new Job({
            id: i + 1,
            order_id: orderId,
            manifest_id: manifestId,
            status: jobStatuses[fastRandom(jobStatuses.length)],
            notes: fastRandom(10) < 2 ? faker.lorem.sentence() : null,
          })
        );
      }

      await knex('jobs').insert(jobs.map((j) => j.toRow()));
      console.log(`   ✓ Jobs batch ${batch + 1}/${Math.ceil(TOTAL_ORDERS / batchSize)} completed`);
    }

    // 9. Generate Stops (2 stops per order)
    console.log(`🚏 Generating ${TOTAL_ORDERS * STOPS_PER_ORDER} stops (${STOPS_PER_ORDER} per order)...`);
    const stopStatuses = [
      EStopStatus.PENDING,
      EStopStatus.ARRIVED,
      EStopStatus.IN_PROGRESS,
      EStopStatus.DEPARTED,
      EStopStatus.COMPLETED,
    ];

    let stopCount = 0;
    for (let batch = 0; batch < Math.ceil(TOTAL_ORDERS / batchSize); batch++) {
      const stops: Stop[] = [];
      const start = batch * batchSize;
      const end = Math.min(start + batchSize, TOTAL_ORDERS);

      for (let i = start; i < end; i++) {
        const orderId = fastRandom(TOTAL_ORDERS) + 1;

        // Pickup stop
        stops.push(
          new Stop({
            id: ++stopCount,
            order_id: orderId,
            type: EStopType.PICKUP,
            status: stopStatuses[fastRandom(stopStatuses.length)],
            sequence: 1,
            manifest_sequence: fastRandom(20) + 1,
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: faker.location.country(),
            zip: faker.location.zipCode(),
            postal_code: faker.location.zipCode(),
            latitude: faker.location.latitude().toString(),
            longitude: faker.location.longitude().toString(),
            scheduled_time: randomDate(now, oneWeekLater),
            arrival_time: fastRandom(10) < 5 ? randomDate(now, oneWeekLater) : null,
            departure_time: fastRandom(10) < 3 ? randomDate(now, oneWeekLater) : null,
            estimated_time: randomDate(now, oneWeekLater),
            completed_at: fastRandom(10) < 2 ? randomDate(now, oneWeekLater) : null,
            notes: fastRandom(10) < 2 ? faker.lorem.sentence() : null,
          })
        );

        // Dropoff stop
        stops.push(
          new Stop({
            id: ++stopCount,
            order_id: orderId,
            type: EStopType.DROPOFF,
            status: stopStatuses[fastRandom(stopStatuses.length)],
            sequence: 2,
            manifest_sequence: fastRandom(20) + 1,
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: faker.location.country(),
            zip: faker.location.zipCode(),
            postal_code: faker.location.zipCode(),
            latitude: faker.location.latitude().toString(),
            longitude: faker.location.longitude().toString(),
            scheduled_time: randomDate(now, oneWeekLater),
            arrival_time: fastRandom(10) < 5 ? randomDate(now, oneWeekLater) : null,
            departure_time: fastRandom(10) < 3 ? randomDate(now, oneWeekLater) : null,
            estimated_time: randomDate(now, oneWeekLater),
            completed_at: fastRandom(10) < 2 ? randomDate(now, oneWeekLater) : null,
            notes: fastRandom(10) < 2 ? faker.lorem.sentence() : null,
          })
        );
      }

      await knex('stops').insert(stops.map((s) => s.toRow()));
      console.log(`   ✓ Stops batch ${batch + 1}/${Math.ceil(TOTAL_ORDERS / batchSize)} completed`);
    }

    console.log('🎉 Data generation completed successfully!');
    console.log(`📈 Total records created:`);
    console.log(`   👥 Users: ${TOTAL_USERS}`);
    console.log(`   🏪 Shops: ${TOTAL_SHOPS}`);
    console.log(`   📦 Products: ${productCount}`);
    console.log(`   🛒 Orders: ${TOTAL_ORDERS}`);
    console.log(`   📝 Order Items: ~${TOTAL_ORDERS * ((ORDER_ITEMS_MIN + ORDER_ITEMS_MAX) / 2)}`);
    console.log(`   🚗 Drivers: ${TOTAL_DRIVERS}`);
    console.log(`   📋 Manifests: ${TOTAL_MANIFESTS}`);
    console.log(`   💼 Jobs: ${TOTAL_ORDERS}`);
    console.log(`   🚏 Stops: ${TOTAL_ORDERS * STOPS_PER_ORDER}`);
  } catch (error) {
    console.error('❌ Error generating data:', error);
    // Rollback or cleanup logic can be added here if needed
    await cleanup();
    throw error;
  }
}
