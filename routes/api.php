<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\ProductImageController;
use App\Http\Controllers\Customer\BillingInfoController;
use App\Http\Controllers\Customer\ShippingInfoController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication Routes (No Middleware)
Route::group([
    'namespace' => 'App\Http\Controllers',
    'prefix' => 'v1/auth'
], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('profile', [AuthController::class, 'me']);
    Route::post('register', [AuthController::class, 'register']);
});

// Protected Routes (With Middleware)
Route::group([
    'middleware' => 'api',
    'namespace' => 'App\Http\Controllers',
    'prefix' => 'v1/customers'
], function () {
    Route::get('', [CustomerController::class, 'index']);
    Route::get('{id}', [CustomerController::class, 'show']);
    Route::put('{id}', [CustomerController::class, 'update']);
    Route::delete('{id}', [CustomerController::class, 'destroy']);
    Route::post('{id}/order', [OrderController::class, 'store']);
    Route::get('{id}/order-history', [CustomerController::class, 'orderHistory']);
    Route::put('{id}/billing-info', [BillingInfoController::class, 'update']);
    Route::get('{id}/billing-info', [BillingInfoController::class, 'show']);
    Route::put('{id}/shipping-info', [ShippingInfoController::class, 'update']);
    Route::get('{id}/shipping-info', [ShippingInfoController::class, 'show']);
});

// Product Routes
Route::group([
    'middleware' => 'api',
    'namespace' => 'App\Http\Controllers',
    'prefix' => 'v1/products'
], function () {
    Route::get('', [ProductController::class, 'index']);
    Route::post('', [ProductController::class, 'store']);
    Route::get('{id}', [ProductController::class, 'show']);
    Route::put('{id}', [ProductController::class, 'update']);
    Route::delete('{id}', [ProductController::class, 'destroy']);
});

// Product Image Routes
Route::group([
    'middleware' => 'api',
    'namespace' => 'App\Http\Controllers',
    'prefix' => 'v1/product-images'
], function () {
    Route::get('', [ProductImageController::class, 'index']);
    Route::get('{id}', [ProductImageController::class, 'show']);
    Route::post('', [ProductImageController::class, 'store']);
    Route::put('{id}', [ProductImageController::class, 'update']);
    Route::delete('{id}', [ProductImageController::class, 'destroy']);
});

// Cart Routes
Route::group([
    'middleware' => 'api',
    'namespace' => 'App\Http\Controllers',
    'prefix' => 'v1/cart'
], function () {
    Route::get('{id}', [CartController::class, 'show']);
    Route::post('{id}/products/{productId}', [CartController::class, 'addToCart']);
    Route::delete('{id}/products/{productId}', [CartController::class, 'removeFromCart']);
    Route::delete('{id}', [CartController::class, 'destroy']);
});