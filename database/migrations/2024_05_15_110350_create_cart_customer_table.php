<?php

use App\Models\Cart;
use App\Models\Customer\Customer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cart_customer', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Cart::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Customer::class)->constrained()->onDelete('cascade');
            $table->boolean('is_ordered')->required()->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_customer');
    }
};
