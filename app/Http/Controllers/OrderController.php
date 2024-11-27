<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Customer\Customer;
use App\Models\Order;
use App\Traits\ModelTrait;
use App\Traits\ValidationTrait;
use Illuminate\Http\Request;

class OrderController extends Controller
{
  use ValidationTrait;
  use ModelTrait;

  public function __construct()
  {
    $this->middleware('auth:api');
    self::$modelName = self::getModelName();
  }

  public function store(Request $request, $id)
  {
    $customer = Customer::findOrFail($id);
    $order = new Order();
    $cart = Cart::with('products')->where('customer_id', '=', $customer->id)->latest()->first();

    $order->cart_id = $cart->id;
    $order->customer_id = $customer->id;
    $order->save();
    $order->carts()->attach($cart->id, [
      'taxes' => $request->taxes,
      'total' => $request->total
    ]);

    $cart->is_ordered = true;
    $cart->save();


    return response()->json([
      'status' => self::STATUS_MESSAGES['SUCCESS'],
      'message' => self::created(),
      'order' => [
        'items' => $cart->products,
        'taxes' => $request->taxes,
        'total' => $request->total
      ],
      'test' => $cart
    ]);
  }
}