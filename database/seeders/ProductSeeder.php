<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Product\Product;
use App\Models\Product\ProductImage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        foreach (range(1, 50) as $index) {
            $name = $faker->word();
            $description = $faker->paragraph(2, false);
            $created_at = $updated_at = Carbon::now()->format('Y-m-d H:i:s');
            $inStock = $faker->boolean();

            DB::table('products')->insert([
                'name' => $name,
                'description' => $description,
                'price' => $faker->randomFloat(2, 0.99, 999.99),
                'in_stock' => $inStock,
                'quantity' => $inStock ? $faker->numberBetween(1, 100) : 0,
                'rating' => $faker->randomFloat(1, 0.0, 5.0),
                'created_at' => $created_at,
                'updated_at' => $updated_at,
            ]);
            $product = Product::where('name', '=', $name)->first();

            $productImage = new ProductImage();
            $productImage->src = $faker->imageUrl(640, 480, 'commerce');
            $productImage->title = $name;
            $productImage->description = $description;
            $productImage->mime_type = $faker->mimeType();
            $productImage->alt_text = $description;
            $product->productImage()->save($productImage);
        }
    }
}
