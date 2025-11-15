// Database schema for an e-commerce system
// Tables: users, books, orders, order_items, roles, user_roles

Table users {
id integer [pk, increment]
tenant_id varchar [not null]
name varchar
email varchar [unique, not null]
password varchar [not null]
created_at timestamp
}

Table books {
id integer [pk, increment]
tenant_id varchar [not null]
title varchar [not null]
author varchar
description text
price decimal(10, 2)
stock integer
created_at timestamp
}

Table orders {
id integer [pk, increment]
tenant_id varchar [not null]
user_id integer [not null]
status varchar
total_amount decimal(10, 2)
created_at timestamp
}

Table order_items {
id integer [pk, increment]
order_id integer [not null]
book_id integer [not null]
quantity integer
price decimal(10, 2)
created_at timestamp
}

Table roles {
id integer [pk, increment]
name varchar(50) [unique, not null]
description text
created_at timestamp
}

Table user_roles {
user_id integer [not null]
role_id integer [not null]
created_at timestamp

indexes {
(user_id, role_id) [pk]
}
}

// --- Relationships ---
Ref: orders.user_id > users.id
Ref: order_items.order_id > orders.id
Ref: order_items.book_id > books.id
Ref: user_roles.user_id > users.id
Ref: user_roles.role_id > roles.id
