<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Customer\Customer;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shipping_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Customer::class)->constrained()->onDelete('cascade');
            $table->string('first_name')->required();
            $table->string('last_name')->required();
            $table->string('street_and_number')->required();
            $table->string('city')->required();
            $table->bigInteger('postal_code')->required();
            $table->string('country')->required();
            $table->string('phone_number')->nullable();
            $table->string('email')->required();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_infos');
    }
};
