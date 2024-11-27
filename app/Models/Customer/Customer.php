<?php

namespace App\Models\Customer;

use App\Models\Cart;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;
use Illuminate\Http\Request;

class Customer extends Model
{
    use HasFactory, Notifiable;

    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'user_id',
        'first_name',
        'last_name',
        'password',
        'date_of_birth',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'remember_token',
    ];

    public function billingInfo(): HasOne
    {
        return $this->hasOne(BillingInfo::class);
    }

    public function shippingInfo(): HasOne
    {
        return $this->hasOne(ShippingInfo::class);
    }

    public function carts(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public static function getCurrentCustomer(Request $request): Customer
    {
        return Customer::findOrFail($request->user()->id);
    }
}