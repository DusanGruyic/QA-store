<?php

namespace App\Models\Product;

use App\Models\Cart;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'name',
        'description',
        'price',
        'in_stock',
        'quantity',
        'rating',
        'cart_quantity',
        'category',
        'rating'
    ];

    public function productImage(): HasOne
    {
        return $this->hasOne(ProductImage::class);
    }

    public function carts(): BelongsToMany
    {
        return $this->belongsToMany(Cart::class, 'cart_product', 'cart_id', 'product_id')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}