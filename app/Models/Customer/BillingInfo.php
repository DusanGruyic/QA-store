<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillingInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'cardholder',
        'card_type',
        'card_number',
        'cvv',
        'card_expiration_date'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
