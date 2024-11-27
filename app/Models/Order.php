<?php

namespace App\Models;

use App\Models\Customer\Customer;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Order extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function carts(): BelongsToMany
    {
        return $this->belongsToMany(Cart::class, 'order_cart', 'order_id', 'cart_id')
            ->withPivot('taxes')
            ->withPivot('total')
            ->withTimestamps();
    }
}