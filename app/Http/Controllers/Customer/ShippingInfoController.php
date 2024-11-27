<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer\ShippingInfo as CustomerShippingInfo;
use App\Models\Customer\Customer;
use App\Traits\ModelTrait;
use App\Traits\ValidationTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class ShippingInfoController extends Controller
{
    use ValidationTrait;
    use ModelTrait;

    public function __construct()
    {
        $this->middleware('auth:api');
        self::$modelName = self::getModelName();
        self::$rules = [
            'first_name' => 'required|string|regex:/^[a-zA-Z]+$/u|max:255',
            'last_name' => 'required|string|regex:/^[a-zA-Z]+$/u|max:255',
            'email' => 'required|string|max:255|email:rfc,dns',
            'street_and_number' => 'required|string|min:3|max:255|regex:/^[^"!\'\*\(\)]*$/',
            'phone_number' => 'required|string||min:6|max:255|regex:/^([0-9\s\-\+\(\) ]*)$/',
            'city' => 'required|string|regex:/^[a-zA-Z ]+$/u|max:255',
            'postal_code' => 'required|integer|between:1111, 9999999999',
            'country' => 'required|string|regex:/^[a-zA-Z ]+$/u|min:3|max:255',
        ];
        self::$messages = [
            'first_name.regex' => 'The first name field format is invalid.',
            'last_name.regex' => 'The last name field format is invalid.',
            'email.max' => 'The email field must not be greater than 255 characters.',
            'email.email' => 'The email field format is invalid.',
            'city.regex' => 'The city field format is invalid.',
            'street_and_number.regex' => 'The street and number field format is invalid.',
            'country.regex' => 'The country field format is invalid.',
            'postal_code.integer' => 'The postal code field must be an integer.',
            'postal_code.between' => 'The postal code field must not be lower than 4 and greater than 10 characters.',
        ];
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['error' => 'No customer found with ID ' . $id . ' found'], 404);
        }

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => "Shipping information for customer ID $id",
            'shipping_info' => $customer->shippingInfo,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['error' => 'No customer found with ID ' . $id . ' found'], 404);
        }

        try {
            $request->validate(self::$rules, self::$messages);
        } catch (ValidationException $th) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'errors' => $th->validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $shippingInfo = $customer->shippingInfo()->first();

        if (!$shippingInfo) {
            $shippingInfo = new CustomerShippingInfo();
        }

        $shippingInfo->first_name = $request->first_name;
        $shippingInfo->last_name = $request->last_name;
        $shippingInfo->email = $request->email;
        $shippingInfo->street_and_number = $request->street_and_number;
        $shippingInfo->city = $request->city;
        $shippingInfo->phone_number = $request->phone_number;
        $shippingInfo->postal_code = $request->postal_code;
        $shippingInfo->country = $request->country;

        $customer->shippingInfo()->save($shippingInfo);

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => self::updated(),
            'shipping_info' => $shippingInfo,
        ]);
    }

    public function handleCustomerNotFound(Request $request): JsonResponse
    {
        return response()->json([
            'status' => self::STATUS_MESSAGES['ERROR'],
            'message' => self::routeNotFound(substr($request->getRequestUri(), 1)),
        ], Response::HTTP_NOT_FOUND);
    }
}