<?php

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
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->required();
            $table->string('description')->nullable();
            $table->float('price')->required();
            $table->boolean('in_stock')->required()->default(false);
            $table->integer('quantity')->required()->default(0);
            $table->integer('cart_quantity')->required()->default(0);
            $table->string('category')->required()->default('other');
            $table->float('rating')->required();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};