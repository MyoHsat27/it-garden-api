import 'reflect-metadata';
import { runSeeder } from 'typeorm-extension';
import { AppDataSource } from './data-source';
import { MainSeeder } from './seeds/main.seeder';

async function run() {
  console.log('🌱 Seeding started...');
  try {
    await AppDataSource.initialize();
    console.log('✔️ Database connection established.');

    await runSeeder(AppDataSource, MainSeeder);

    console.log('✅ Seeding complete.');
  } catch (error) {
    console.error('❌ An error occurred during the seeding process:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('👋 Database connection closed.');
    }
  }
}

run();
