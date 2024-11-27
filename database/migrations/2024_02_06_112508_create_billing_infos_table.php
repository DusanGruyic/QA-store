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
        Schema::create('billing_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Customer::class)->constrained()->onDelete('cascade');
            $table->string('cardholder')->required();
            $table->string('card_type')->required();
            $table->bigInteger('card_number')->required()->unique();
            $table->integer('cvv')->required();
            $table->string('card_expiration_date')->required();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billing_infos');
    }
};
