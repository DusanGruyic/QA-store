<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'street_and_number',
        'city',
        'postal_code',
        'country'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
