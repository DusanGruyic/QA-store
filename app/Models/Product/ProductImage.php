<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'src',
        'title',
        'mime_type',
        'alt_text',
        'description'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}