# Quick Reference - Model Methods

## 🎯 When to Use Each Method

### `toInsert()` - Creating New Records

**Use when:** Inserting new data into database
**Excludes:** `id`, `created_at`, `updated_at` (DB auto-generates)

```typescript
const user = new User({ name: 'John', email: 'john@example.com' });
await db('users').insert(user.toInsert());
```

### `toUpdate()` - Updating Existing Records

**Use when:** Updating existing database records
**Excludes:** `id`, `created_at`
**Auto-sets:** `updated_at` to current timestamp

```typescript
user.name = 'Jane';
await db('users').where({ id: user.id }).update(user.toUpdate());
```

### `toRow()` - Complete Data Export

**Use when:** Need ALL fields (API responses, logging, debugging)
**Includes:** Everything (id, created_at, updated_at, all fields)

```typescript
const completeData = user.toRow();
res.json({ data: completeData });
```

### `fromRow(row)` - Database to Object

**Use when:** Converting single DB row to model instance
**Handles:** Type conversions, Date parsing, JSON parsing

```typescript
const row = await db('users').where({ id: 1 }).first();
const user = User.fromRow(row);
```

### `mapRows(rows)` - Batch Conversion

**Use when:** Converting multiple DB rows to model instances
**Handles:** Batch processing with proper types

```typescript
const rows = await db('users').select('*');
const users = User.mapRows(rows);
```

---

## 📋 Common Patterns

### Pattern 1: Create and Return

```typescript
async createUser(data: Partial<User>): Promise<User> {
  const user = new User(data);
  const [id] = await db('users').insert(user.toInsert());
  const row = await db('users').where({ id }).first();
  return User.fromRow(row!);
}
```

### Pattern 2: Update and Return

```typescript
async updateUser(id: number, updates: Partial<User>): Promise<User> {
  const row = await db('users').where({ id }).first();
  const user = User.fromRow(row!);

  Object.assign(user, updates);

  await db('users').where({ id }).update(user.toUpdate());
  const updatedRow = await db('users').where({ id }).first();
  return User.fromRow(updatedRow!);
}
```

### Pattern 3: List with Filters

```typescript
async getActiveUsers(): Promise<User[]> {
  const rows = await db('users')
    .where({ status: 'active' })
    .select('*');
  return User.mapRows(rows);
}
```

---

## ⚠️ Important Notes

1. **Database must handle timestamps**

   ```typescript
   // In migrations
   table.timestamps(true, true); // ← Required!
   ```

2. **Don't manually set timestamps in constructor**

   ```typescript
   // ❌ Bad
   constructor(data) {
     this.created_at = new Date(); // Don't do this!
   }

   // ✅ Good
   constructor(data) {
     this.created_at = data.created_at; // Let DB handle it
   }
   ```

3. **Always use toInsert() for new records**

   ```typescript
   // ❌ Bad
   await db('users').insert(user.toRow()); // Don't use toRow()!

   // ✅ Good
   await db('users').insert(user.toInsert());
   ```

4. **Always use toUpdate() for updates**

   ```typescript
   // ❌ Bad
   await db('users').where({ id }).update({
     name: user.name,
     updated_at: new Date(), // Manual timestamp
   });

   // ✅ Good
   await db('users').where({ id }).update(user.toUpdate());
   ```
