<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use App\Models\Product\Product;
use App\Models\Customer\Customer;
use App\Traits\ModelTrait;
use App\Traits\ValidationTrait;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    use ValidationTrait;
    use ModelTrait;

    public function __construct()
    {
        $this->middleware('auth:api');
        self::$modelName = self::getModelName();
    }

    public function show(int $id): JsonResponse
    {
        $cart = Cart::find($id);
        if (!$cart) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'message' => self::notFound(),
            ], 404);
        }

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'cart' => $cart->products,
        ]);
    }

    public function addToCart(Request $request, int $cartId, int $productId): JsonResponse
    {
        $customer = Customer::getCurrentCustomer($request);
        $cart = Cart::with('products')
            ->where('id', $cartId)
            ->where('customer_id', $customer->id)
            ->first();

        if (!$cart) {
            $cart = new Cart();
            $cart->id = $cartId;
            $cart->customer_id = $customer->id;
            $cart->save();
        }

        $product = Product::find($productId);
        if (!$product) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'message' => 'Product not found.',
            ], 404);
        }

        if (!$product->in_stock) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'message' => self::VALIDATION_MESSAGES['OUT_OF_STOCK']
            ], 400);
        }

        $cartProduct = $cart->products()->wherePivot('product_id', $productId)->first();
        if ($cartProduct) {
            $quantity = $cartProduct->pivot->quantity + 1;
            $cart->products()->updateExistingPivot($productId, ['quantity' => $quantity]);
        } else {
            $cart->products()->attach($productId, ['quantity' => 1]);
        }

        if ($product->quantity === 0) {
            $product->update(['in_stock' => false]);
        } else {
            $product->update(['quantity' =>  $product->quantity - 1]);
        }

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => self::addedToCart(),
            'cart' => $cart->products,
        ]);
    }

    public function removeFromCart(int $id, int $productId): JsonResponse
    {
        $cart = Cart::find($id);
        if (!$cart) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'message' => self::notFound(),
            ], 404);
        }

        // Check if the product exists in the cart
        $pivot = $cart->products()->wherePivot('product_id', $productId)->first();
        if (!$pivot) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'message' => 'No product found.',
            ], 404);
        }

        $quantity = $pivot->pivot->quantity;

        if ($quantity > 1) {
            // Decrement the quantity if there are more than one
            $cart->products()->updateExistingPivot($productId, ['quantity' => $quantity - 1]);
            $message = 'Product quantity decreased.';
        } else {
            // Remove the product from the cart if it's the last one
            $cart->products()->detach($productId);
            $message = 'Product removed from cart.';
        }

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => $message,
            'cart' => $cart->products,
        ]);
    }


    public function destroy(int $id): JsonResponse
    {
        $cart = Cart::find($id);
        if (!$cart) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'message' => self::notFound(),
            ], 404);
        }

        foreach ($cart->products as $product) {
            $quantity = $product->quantity + $product->pivot->quantity;
            $product->update(['quantity' => $quantity, 'in_stock' => true]);
        }

        // $cart->delete();

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => 'Cart deleted successfully.',
        ]);
    }
}