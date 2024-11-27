<?php

namespace App\Models;

use App\Models\Customer\Customer;
use App\Models\Product\Product;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cart extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'cart_product', 'cart_id', 'product_id')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    public function customers(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class);
    }
}
