<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Customer\Customer;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AuthController extends Controller
{
  public function __construct()
  {
    $this->middleware('api', ['except' => ['login', 'register']]);
  }

  public function login(Request $request)
  {
    $request->validate([
      'email' => 'required|string|email',
      'password' => 'required|string'
    ]);

    $credentials = $request->only(['email', 'password']);
    $token = Auth::attempt($credentials);

    if (!$token) {
      return response()->json(['error' => 'Unauthorized'], 401);
    }

    $user = Auth::user();
    if (!$user) {
      return response()->json(['error' => 'Unauthorized'], 401);
    }

    // Find the customer associated with the user
    $customer = Customer::where('user_id', $user->id)->first();

    // Check if customer exists
    // if (!$customer) {
    //   return response()->json(['error' => 'Customer not found'], 404);
    // }

    // Try to find the user's cart
    $cart = $customer->carts()->first();

    // If no cart exists, create a new one
    if (!$cart) {
      $cart = new Cart();
      $cart->customer_id = $customer->id; // Use the customer's ID
      $cart->save();
    }

    return response()->json([
      'status' => 'Success',
      'message' => 'User logged in successfully',
      'user' => $user,
      'auth' => [
        'token' => $token,
        'type' => 'Bearer',
      ]
    ]);
  }

  public function register(Request $request)
  {
    $request->validate([
      'username' => 'required|string|max:255|unique:users',
      'email' => 'required|regex:/(.+)@(.+)\.(.+)/i|unique:users',
      'password' => 'required|string|min:6',
    ]);

    $username = $request->username;
    $email = $request->email;
    $password = Hash::make($request->password);

    $user = User::create([
      'username' => $username,
      'email' => $email,
      'password' => $password,
      'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
      'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
    ]);

    if (!$user) {
      return response()->json(['message' => 'User could not be created'], 500);
    }

    // Create the customer record
    $customer = Customer::create([
      'username' => $username,
      'email' => $email,
      'password' => $password,
      'user_id' => $user->id
    ]);

    if (!$customer) {
      return response()->json(['message' => 'Customer could not be created'], 500);
    }


    $token = Auth::login($user);

    // Create a new cart for the customer
    $cart = new Cart();
    $cart->customer_id = $customer->id; // Use the customer's ID
    $cart->save();

    return response()->json([
      'status' => 'Success',
      'message' => 'User created successfully',
      'user' => $user,
      'auth' => [
        'token' => $token,
        'type' => 'Bearer',
      ]
    ]);
  }

  public function me()
  {
    return response()->json(Auth::user());
  }

  public function logout()
  {
    Auth::logout();

    return response()->json(['message' => 'Successfully logged out']);
  }

  public function refresh()
  {
    return $this->respondWithToken(Auth::refresh());
  }

  protected function respondWithToken($token)
  {
    return response()->json([
      'access_token' => $token,
      'token_type' => 'bearer',
      'expires_in' => Auth::factory()->getTTL() * 60
    ]);
  }
}