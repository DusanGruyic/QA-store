<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\ProductSeederProducts;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([UserSeeder::class, ProductionProductSeeder::class]);
    }
}
