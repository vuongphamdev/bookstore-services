import { Knex } from 'knex';
import { TCreateVehicleData } from '@models/schemas/vehicle.schema';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('vehicles').del();

  // Generate 5 vehicles
  const vehicles: (TCreateVehicleData & { id: number })[] = [
    {
      id: 1,
      name: 'Truck A',
      description: 'Large delivery truck',
    },
    {
      id: 2,
      name: 'Van B',
      description: 'Medium-sized van',
    },
    {
      id: 3,
      name: 'Car C',
      description: 'Small delivery car',
    },
    {
      id: 4,
      name: 'Bike D',
      description: 'Delivery bike',
    },
    {
      id: 5,
      name: 'Scooter E',
      description: 'Fast delivery scooter',
    },
  ];

  // Inserts seed entries
  await knex('vehicles').insert(vehicles);
  console.log('Seeded vehicles table');
}
