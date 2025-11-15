import { Knex } from 'knex';
import { Vehicle } from '@models/schemas/vehicle.schema';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('vehicles').del();

  // Generate 5 vehicles
  const vehicles: Vehicle[] = [
    new Vehicle({
      name: 'Toyota Camry 2023',
      description: 'Reliable sedan with excellent fuel efficiency',
    }),
    new Vehicle({
      name: 'Ford F-150 2024',
      description: 'Heavy-duty pickup truck for large deliveries',
    }),
    new Vehicle({
      name: 'Honda CR-V 2023',
      description: 'Compact SUV perfect for urban deliveries',
    }),
    new Vehicle({
      name: 'Mercedes Sprinter Van',
      description: 'Large cargo van for bulk deliveries',
    }),
    new Vehicle({
      name: 'Nissan Leaf Electric',
      description: 'Eco-friendly electric vehicle for short-range deliveries',
    }),
  ];

  // Inserts seed entries
  await knex('vehicles').insert(vehicles.map((v) => v.toRow()));
  console.log('Seeded vehicles table');
}
