<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\Product\Product;
use App\Models\Product\ProductImage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProductionProductSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    $products = [
      [
        'name' => 'Plumbus',
        'description' => 'A household item that everyone has, but no one knows what it does.',
        'price' => 19.99,
        'in_stock' => 1,
        'quantity' => 50,
        'cart_quantity' => 0,
        'category' => 'Household Items',
        'rating' => 4.8,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/plumbus.jpeg'),
          'title' => 'Plumbus',
          'description' => 'A generic Plumbus',
          'mime_type' => 'image/png',
          'alt_text' => 'A Plumbus',
        ]
      ],
      [
        'name' => 'Meeseeks Box',
        'description' => 'Summons a Mr. Meeseeks to help you with a task, but be careful what you wish for.',
        'price' => 49.99,
        'in_stock' => 1,
        'quantity' => 25,
        'cart_quantity' => 0,
        'category' => 'Toys & Games',
        'rating' => 4.2,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/meeseks-box.jpeg'),
          'title' => 'Meeseeks Box',
          'description' => 'A Meeseeks Box',
          'mime_type' => 'image/png',
          'alt_text' => 'A Meeseeks Box',
        ]
      ],
      [
        'name' => 'Portal Gun',
        'description' => 'Opens up a portal to any dimension you can imagine, but be careful not to get lost in the multiverse.',
        'price' => 999.99,
        'in_stock' => 1,
        'quantity' => 10,
        'cart_quantity' => 0,
        'category' => 'Gadgets',
        'rating' => 4.9,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/portal-gun.jpeg'),
          'title' => 'Portal Gun',
          'description' => 'Rick\'s Portal Gun',
          'mime_type' => 'image/png',
          'alt_text' => 'A Portal Gun',
        ]
      ],
      [
        'name' => 'Interdimensional Cable Box',
        'description' => 'Gives you access to millions of TV channels from across the multiverse, but be prepared for some strange and disturbing content.',
        'price' => 99.99,
        'in_stock' => 1,
        'quantity' => 30,
        'cart_quantity' => 0,
        'category' => 'Electronics',
        'rating' => 4.4,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/interdimensional-cable-box.png'),
          'title' => 'Interdimensional Cable Box',
          'description' => 'An Interdimensional Cable Box',
          'mime_type' => 'image/png',
          'alt_text' => 'An Interdimensional Cable Box',
        ]
      ],
      [
        'name' => 'Butter Robot',
        'description' => 'A robot designed to pass butter, but it quickly becomes existentially confused about its purpose in life.',
        'price' => 29.99,
        'in_stock' => 1,
        'quantity' => 40,
        'cart_quantity' => 0,
        'category' => 'Robots',
        'rating' => 3.7,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/butter-robot.jpeg'),
          'title' => 'Butter Robot',
          'description' => 'A Butter Robot',
          'mime_type' => 'image/png',
          'alt_text' => 'A Butter Robot',
        ]
      ],
      [
        'name' => 'Szechuan Sauce',
        'description' => 'A limited edition sauce that Rick is obsessed with, originally from McDonald\'s.',
        'price' => 5.99,
        'in_stock' => 1,
        'quantity' => 100,
        'cart_quantity' => 0,
        'category' => 'Food & Beverages',
        'rating' => 4.5,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/szechuan-sauce.jpeg'),
          'title' => 'Szechuan Sauce',
          'description' => 'A bottle of Szechuan Sauce',
          'mime_type' => 'image/png',
          'alt_text' => 'Szechuan Sauce',
        ]
      ],
      [
        'name' => 'Rick\'s Science Lab Kit',
        'description' => 'A science kit with bizarre experiments inspired by Rick\'s crazy inventions.',
        'price' => 79.99,
        'in_stock' => 1,
        'quantity' => 15,
        'cart_quantity' => 0,
        'category' => 'Educational',
        'rating' => 4.0,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/szechuan-sauce.jpeg'),
          'title' => 'Rick\'s Science Lab Kit',
          'description' => 'Rick\'s Science Lab Kit',
          'mime_type' => 'image/png',
          'alt_text' => 'Rick\'s Science Lab Kit',
        ]
      ],
      [
        'name' => 'Gromflomite Detector',
        'description' => 'A device to detect Gromflomites, the alien pests that annoy Rick.',
        'price' => 89.99,
        'in_stock' => 1,
        'quantity' => 20,
        'cart_quantity' => 0,
        'category' => 'Gadgets',
        'rating' => 4.3,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/szechuan-sauce.jpeg'),
          'title' => 'Gromflomite Detector',
          'description' => 'A Gromflomite Detector',
          'mime_type' => 'image/png',
          'alt_text' => 'A Gromflomite Detector',
        ]
      ],
      [
        'name' => 'Flesh-Skinned Morty',
        'description' => 'A creepy Morty doll made from flesh-like material.',
        'price' => 39.99,
        'in_stock' => 1,
        'quantity' => 60,
        'cart_quantity' => 0,
        'category' => 'Toys & Games',
        'rating' => 3.5,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/flesh-skinned-morty.png'),
          'title' => 'Flesh-Skinned Morty',
          'description' => 'A Flesh-Skinned Morty doll',
          'mime_type' => 'image/png',
          'alt_text' => 'A Flesh-Skinned Morty doll',
        ]
      ],
      [
        'name' => 'Dimension C-137 Flag',
        'description' => 'A flag representing Rick and Morty\'s home dimension.',
        'price' => 15.99,
        'in_stock' => 1,
        'quantity' => 75,
        'cart_quantity' => 0,
        'category' => 'Home Decor',
        'rating' => 4.1,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/szechuan-sauce.jpeg'),
          'title' => 'Dimension C-137 Flag',
          'description' => 'A flag from Dimension C-137',
          'mime_type' => 'image/png',
          'alt_text' => 'Dimension C-137 Flag',
        ]
      ],
      [
        'name' => 'Rick\'s Flask',
        'description' => 'A flask for all your interdimensional drinking needs.',
        'price' => 24.99,
        'in_stock' => 1,
        'quantity' => 80,
        'cart_quantity' => 0,
        'category' => 'Drinkware',
        'rating' => 4.7,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/ricks-flask.jpeg'),
          'title' => 'Rick\'s Flask',
          'description' => 'Rick\'s Flask',
          'mime_type' => 'image/png',
          'alt_text' => 'Rick\'s Flask',
        ]
      ],
      [
        'name' => 'Microverse Battery',
        'description' => 'A battery that powers a microverse, but it comes with a lot of ethical dilemmas.',
        'price' => 199.99,
        'in_stock' => 1,
        'quantity' => 5,
        'cart_quantity' => 0,
        'category' => 'Gadgets',
        'rating' => 4.5,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/microverse-battery.png'),
          'title' => 'Microverse Battery',
          'description' => 'A Microverse Battery',
          'mime_type' => 'image/png',
          'alt_text' => 'A Microverse Battery',
        ]
      ],
      [
        'name' => 'Evil Morty Action Figure',
        'description' => 'An action figure of Evil Morty, the sinister version of Morty.',
        'price' => 34.99,
        'in_stock' => 1,
        'quantity' => 45,
        'cart_quantity' => 0,
        'category' => 'Toys & Games',
        'rating' => 4.6,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/evil-morty.jpeg'),
          'title' => 'Evil Morty Action Figure',
          'description' => 'An Evil Morty Action Figure',
          'mime_type' => 'image/png',
          'alt_text' => 'Evil Morty Action Figure',
        ]
      ],
      [
        'name' => 'Rick\'s Portal Recipe Book',
        'description' => 'A book filled with recipes for creating portals to different dimensions.',
        'price' => 39.99,
        'in_stock' => 1,
        'quantity' => 20,
        'cart_quantity' => 0,
        'category' => 'Books',
        'rating' => 4.4,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/szechuan-sauce.jpeg'),
          'title' => 'Rick\'s Portal Recipe Book',
          'description' => 'A recipe book for interdimensional portals',
          'mime_type' => 'image/png',
          'alt_text' => 'Rick\'s Portal Recipe Book',
        ]
      ],
      [
        'name' => 'Mr. Poopybutthole Plush Toy',
        'description' => 'A plush toy of Mr. Poopybutthole, the lovable character from the show.',
        'price' => 29.99,
        'in_stock' => 1,
        'quantity' => 100,
        'cart_quantity' => 0,
        'category' => 'Toys & Games',
        'rating' => 4.9,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/szechuan-sauce.jpeg'),
          'title' => 'Mr. Poopybutthole Plush Toy',
          'description' => 'A plush toy of Mr. Poopybutthole',
          'mime_type' => 'image/png',
          'alt_text' => 'Mr. Poopybutthole Plush Toy',
        ]
      ],
      [
        'name' => 'Rick\'s Time Travel Watch',
        'description' => 'A watch that allows you to travel through time, but only if you can figure out how to use it.',
        'price' => 299.99,
        'in_stock' => 1,
        'quantity' => 8,
        'cart_quantity' => 0,
        'category' => 'Gadgets',
        'rating' => 4.8,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/szechuan-sauce.jpeg'),
          'title' => 'Rick\'s Time Travel Watch',
          'description' => 'A Time Travel Watch',
          'mime_type' => 'image/png',
          'alt_text' => 'Rick\'s Time Travel Watch',
        ]
      ],
      [
        'name' => 'Wubba Lubba Dub Dub Mug',
        'description' => 'A coffee mug featuring Rick\'s famous catchphrase.',
        'price' => 14.99,
        'in_stock' => 1,
        'quantity' => 150,
        'cart_quantity' => 0,
        'category' => 'Drinkware',
        'rating' => 4.2,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/szechuan-sauce.jpeg'),
          'title' => 'Wubba Lubba Dub Dub Mug',
          'description' => 'A mug with Rick\'s catchphrase',
          'mime_type' => 'image/png',
          'alt_text' => 'Wubba Lubba Dub Dub Mug',
        ]
      ],
      [
        'name' => 'Rick and Morty Board Game',
        'description' => 'A fun board game that lets you play through various adventures in the multiverse.',
        'price' => 49.99,
        'in_stock' => 1,
        'quantity' => 20,
        'cart_quantity' => 0,
        'category' => 'Games',
        'rating' => 4.5,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/szechuan-sauce.jpeg'),
          'title' => 'Rick and Morty Board Game',
          'description' => 'A Rick and Morty themed board game',
          'mime_type' => 'image/png',
          'alt_text' => 'Rick and Morty Board Game',
        ]
      ],
      [
        'name' => 'Evil Morty\'s Eye Patch',
        'description' => 'An eye patch worn by Evil Morty, perfect for cosplay or display.',
        'price' => 12.99,
        'in_stock' => 1,
        'quantity' => 60,
        'cart_quantity' => 0,
        'category' => 'Costumes',
        'rating' => 4.0,
        'created_at' => now()->addDay(),
        'updated_at' => now()->addDays(2),
        'image' => [
          'src' => asset('images/products/szechuan-sauce.jpeg'),
          'title' => 'Evil Morty\'s Eye Patch',
          'description' => 'An eye patch from Evil Mort',
          'mime_type' => 'image/png',
          'alt_text' => 'An eye patch from Evil Mort',
        ]
      ],
    ];

    foreach ($products as $productData) {
      $productId = DB::table('products')->insertGetId([
        'name' => $productData['name'],
        'description' => $productData['description'],
        'price' => $productData['price'],
        'in_stock' => $productData['in_stock'],
        'quantity' => $productData['quantity'],
        'cart_quantity' => $productData['cart_quantity'],
        'category' => $productData['category'],
        'rating' => $productData['rating'],
        'created_at' => $productData['created_at'],
        'updated_at' => $productData['updated_at'],
      ]);

      $productImage = new ProductImage();
      $productImage->src = $productData['image']['src'];
      $productImage->title = $productData['image']['title'];
      $productImage->description = $productData['image']['description'];
      $productImage->mime_type = $productData['image']['mime_type'];
      $productImage->alt_text = $productData['image']['alt_text'];

      Product::find($productId)->productImage()->save($productImage);
    }
  }
}
