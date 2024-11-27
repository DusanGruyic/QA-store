<?php

use App\Models\Cart;
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
        Schema::create('customers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->nullable();
            // $table
            //     ->foreign('user_id')
            //     ->references('id')
            //     ->on('users')
            //     ->onDelete('cascade');
            $table->foreignIdFor(Cart::class)->onDelete('cascade')->nullable()->default(null);
            $table->string('username')->unique()->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->required();
            $table->string('password')->required();
            $table->date('date_of_birth')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};