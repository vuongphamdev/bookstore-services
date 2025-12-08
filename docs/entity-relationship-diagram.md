# Entity Relationship Diagram - Courifly Services

## Sơ đồ quan hệ các đối tượng

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        COURIFLY SERVICES - ERD                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                              ┌─────────────┐
                                              │   ROLES     │
                                              ├─────────────┤
                                              │ id (PK)     │
                                              │ name        │
                                              │ code        │
                                              │ description │
                                              │ timestamps  │
                                              └─────────────┘


    ┌──────────────────┐                    ┌─────────────────────┐
    │    VEHICLES      │                    │       USERS         │
    ├──────────────────┤                    ├─────────────────────┤
    │ id (PK)          │                    │ id (PK)             │
    │ name             │                    │ name                │
    │ description      │                    │ email (UNIQUE)      │
    │ timestamps       │                    │ password            │
    └────────┬─────────┘                    │ role                │
             │                              │ status              │
             │                              │ dob                 │
             │ 1                            │ phone_number        │
             │                              │ address             │
             ▼                              │ timestamps          │
    ┌──────────────────┐                    └──────────┬──────────┘
    │    DRIVERS       │                               │
    ├──────────────────┤                               │
    │ id (PK)          │                               │ 1
    │ name             │                               │
    │ code (UNIQUE)    │                               ▼
    │ status           │                    ┌─────────────────────┐
    │ age              │                    │       SHOPS         │
    │ address          │                    ├─────────────────────┤
    │ city             │                    │ id (PK)             │
    │ state            │                    │ name                │
    │ country          │                    │ user_id (FK) ───────┼──── belongs to User
    │ zip              │                    │ status              │
    │ license_number   │                    │ description         │
    │ vehicle_id (FK)──┼───── has Vehicle  │ timestamps          │
    │ phone_number     │                    └──────────┬──────────┘
    │ timestamps       │                               │
    └────────┬─────────┘                               │ 1
             │                                         │
             │ 1                                       ▼
             │                              ┌─────────────────────┐
             ▼                              │     PRODUCTS        │
    ┌──────────────────┐                    ├─────────────────────┤
    │   MANIFESTS      │                    │ id (PK)             │
    ├──────────────────┤                    │ shop_id (FK) ───────┼──── belongs to Shop
    │ id (PK)          │                    │ name                │
    │ driver_id (FK)───┼─── assigned to    │ sku (UNIQUE/shop)   │
    │ vehicle_id (FK)──┼─── uses Vehicle   │ category            │
    │ manifest_date    │                    │ description         │
    │ status           │                    │ price               │
    │ notes            │                    │ stock               │
    │ timestamps       │                    │ status              │
    └────────┬─────────┘                    │ metadata            │
             │                              │ timestamps          │
             │                              └─────────────────────┘
             │ 1                                       │
             │                                         │
             ▼                                         │
    ┌──────────────────┐                               │
    │      JOBS        │◄──────────────────────────────┘
    ├──────────────────┤                      (referenced in order_items)
    │ id (PK)          │
    │ order_id (FK)────┼───────┐
    │ manifest_id (FK) │       │
    │ status           │       │
    │ notes            │       │
    │ timestamps       │       │
    └──────────────────┘       │                ┌─────────────────────┐
                               │                │     ORDERS          │
                               │                ├─────────────────────┤
                               └───────────────►│ id (PK)             │
    ┌──────────────────┐                        │ user_id (FK) ───────┼──── placed by User
    │     STOPS        │                        │ shop_id             │
    ├──────────────────┤                        │ status              │
    │ id (PK)          │                        │ notes               │
    │ order_id (FK)────┼───────────────────────►│ timestamps          │
    │ type             │                        └──────────┬──────────┘
    │ status           │                                   │
    │ sequence         │                                   │ 1
    │ manifest_sequence│                                   │
    │ address          │                                   ▼
    │ city             │                        ┌─────────────────────┐
    │ state            │                        │    ORDER_ITEMS      │
    │ country          │                        ├─────────────────────┤
    │ zip              │                        │ id (PK)             │
    │ postal_code      │                        │ order_id (FK) ──────┼──── belongs to Order
    │ latitude         │                        │ product_id (FK)     │──── references Product
    │ longitude        │                        │ quantity            │
    │ scheduled_time   │                        │ price               │
    │ arrival_time     │                        │ timestamps          │
    │ departure_time   │                        └─────────────────────┘
    │ estimated_time   │
    │ completed_at     │
    │ notes            │
    │ timestamps       │
    └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           RELATIONSHIP SUMMARY                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

    ┌───────────────────┬─────────────────────┬───────────────────────────────────────────────────────────────┐
    │    Entity A       │     Entity B        │                         Relationship                         │
    ├───────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────┤
    │    User           │     Shop            │  1:N  - Một User có thể sở hữu nhiều Shop                    │
    ├───────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────┤
    │    Shop           │     Product         │  1:N  - Một Shop có nhiều Product                            │
    ├───────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────┤
    │    User           │     Order           │  1:N  - Một User có thể tạo nhiều Order                      │
    ├───────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────┤
    │    Order          │     Order_Items     │  1:N  - Một Order chứa nhiều Order_Items                     │
    ├───────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────┤
    │    Product        │     Order_Items     │  1:N  - Một Product có thể xuất hiện trong nhiều Order_Items │
    ├───────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────┤
    │    Order          │     Stop            │  1:N  - Một Order có nhiều Stop (điểm dừng giao hàng)        │
    ├───────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────┤
    │    Order          │     Job             │  1:N  - Một Order có thể có nhiều Job                        │
    ├───────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────┤
    │    Manifest       │     Job             │  1:N  - Một Manifest chứa nhiều Job                          │
    ├───────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────┤
    │    Driver         │     Manifest        │  1:N  - Một Driver được gán nhiều Manifest                   │
    ├───────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────┤
    │    Vehicle        │     Manifest        │  1:N  - Một Vehicle được sử dụng trong nhiều Manifest        │
    ├───────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────┤
    │    Driver         │     Vehicle         │  N:1  - Nhiều Driver có thể sử dụng một Vehicle              │
    └───────────────────┴─────────────────────┴───────────────────────────────────────────────────────────────┘

```

## Mô tả chi tiết các đối tượng

### 1. **Users** (Người dùng)

- Đối tượng chính đại diện cho người dùng hệ thống
- Có thể có các vai trò khác nhau (role)
- Có thể sở hữu nhiều Shop
- Có thể đặt nhiều Order

### 2. **Roles** (Vai trò)

- Định nghĩa các vai trò trong hệ thống
- Độc lập, không có foreign key

### 3. **Shops** (Cửa hàng)

- Thuộc về một User (shop owner)
- Chứa nhiều Product
- Nhận Order từ khách hàng

### 4. **Products** (Sản phẩm)

- Thuộc về một Shop
- Có SKU unique trong phạm vi Shop
- Được tham chiếu trong Order_Items

### 5. **Orders** (Đơn hàng)

- Được tạo bởi User
- Thuộc về một Shop
- Chứa nhiều Order_Items
- Có nhiều Stop (điểm giao)
- Có nhiều Job (công việc)

### 6. **Order_Items** (Chi tiết đơn hàng)

- Liên kết Order với Product
- Lưu số lượng và giá tại thời điểm đặt hàng

### 7. **Stops** (Điểm dừng)

- Các điểm giao hàng trong một Order
- Chứa thông tin địa chỉ và thời gian

### 8. **Jobs** (Công việc)

- Công việc giao hàng liên quan đến Order
- Có thể được gán vào Manifest

### 9. **Manifests** (Bảng kê)

- Lịch trình giao hàng của Driver
- Sử dụng một Vehicle cụ thể
- Chứa nhiều Job

### 10. **Drivers** (Tài xế)

- Người thực hiện giao hàng
- Có thể được gán Vehicle
- Thực hiện các Manifest

### 11. **Vehicles** (Phương tiện)

- Phương tiện vận chuyển
- Được sử dụng bởi Driver và Manifest

---

## Flow Diagram

```
                                    ┌─────────────┐
                                    │    USER     │
                                    └──────┬──────┘
                                           │
                           ┌───────────────┼───────────────┐
                           │               │               │
                           ▼               ▼               ▼
                     ┌─────────┐     ┌─────────┐     ┌─────────┐
                     │  SHOP   │     │  ORDER  │     │  ROLE   │
                     └────┬────┘     └────┬────┘     └─────────┘
                          │               │
                          ▼               ├───────────────────┐
                    ┌──────────┐          │                   │
                    │ PRODUCT  │          ▼                   ▼
                    └────┬─────┘    ┌───────────┐       ┌──────────┐
                         │          │ORDER_ITEM │       │   STOP   │
                         │          └───────────┘       └──────────┘
                         │                │
                         └────────────────┘

                              DELIVERY FLOW

                    ┌──────────┐     ┌───────────┐     ┌──────────┐
                    │ VEHICLE  │◄────│  MANIFEST │────►│   JOB    │
                    └────┬─────┘     └─────┬─────┘     └────┬─────┘
                         │                 │                │
                         ▼                 │                ▼
                    ┌──────────┐           │          ┌──────────┐
                    │  DRIVER  │◄──────────┘          │  ORDER   │
                    └──────────┘                      └──────────┘
```
