<?php

use App\Models\Cart;
use App\Models\Order;
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
        Schema::create('order_cart', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignIdFor(Order::class)->unsigned()->onDelete('cascade');
            $table->foreignIdFor(Cart::class)->unsigned()->onDelete('cascade');
            $table->float('taxes')->nullable();
            $table->float('total')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_cart');
    }
};
