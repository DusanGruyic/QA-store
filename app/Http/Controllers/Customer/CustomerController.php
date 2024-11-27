<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer\BillingInfo;
use App\Models\Customer\Customer;
use App\Models\Cart;
use App\Models\Customer\ShippingInfo;
use App\Models\User;
use App\Traits\ModelTrait;
use App\Traits\ValidationTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    use ValidationTrait;
    use ModelTrait;

    public function __construct()
    {
        $this->middleware('auth:api');
        self::$modelName = self::getModelName();
    }

    public function index(): JsonResponse
    {
        $customers = Customer::all();

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'customers' => $customers,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['error' => 'No customer found with ID ' . $id . ' found'], 404);
        }
        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'username' => 'string|max:255',
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'date_of_birth' => 'date_format:Y-m-d|before:-16 years|after:-101 years'
        ], [
            'date_of_birth.before' => 'You need to be over 16 years old',
            'date_of_birth.after' => 'Really? Did you know Gavrilo Princip?',
        ]);

        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['error' => 'No customer found with ID ' . $id . ' found'], 404);
        }
        $customer->username = $request->username;
        $customer->first_name = $request->first_name;
        $customer->last_name = $request->last_name;
        $customer->date_of_birth = $request->date_of_birth;

        if ($request->email) {
            $customer->email = $request->email;
            $user = User::find($id);
            $user->email = $request->email;
            $user->update();
        } else if ($request->username) {
            $customer->username = $request->username;
            $user = User::find($id);
            $user->username = $request->username;
            $user->update();
        }
        $customer->update();

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => self::updated(),
            'customer' => $customer,
            'cart' => $customer->carts()
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json(['error' => 'No customer found with ID ' . $id . ' found'], 404);
        }

        $billingInfo = BillingInfo::where('customer_id', '=', $id)->first();
        $shippingInfo = ShippingInfo::where('customer_id', '=', $id)->first();
        $customer->billing_info = $billingInfo;
        $customer->shipping_info = $shippingInfo;
        $customer->delete();

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => self::deleted(),
            'customer' => $customer,
        ]);
    }

    public function orderHistory(int $id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer->carts) {
            return response()->json([
                'message' => 'You have no order history with us, place your first order!'
            ]);
        }

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'orders' => Cart::find($customer->carts->id)->products
        ]);
    }
}