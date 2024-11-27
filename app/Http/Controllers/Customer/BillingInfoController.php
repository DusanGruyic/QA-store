<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer\BillingInfo as CustomerBillingInfo;
use App\Models\Customer\Customer;
use App\Traits\ModelTrait;
use App\Traits\ValidationTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class BillingInfoController extends Controller
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
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['error' => 'No customer found with ID ' . $id . ' found'], 404);
        }

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => "Billing information for customer ID $id",
            'billing_info' => $customer->billingInfo,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate([
                'cardholder' => 'required|string|max:255',
                'card_type' => 'required|string|min:3|max:20',
                'card_number' => 'required|min:12|max:20',
                'card_expiration_date' => 'required|string|date_format:m/y',
                'cvv' => 'required|integer|min:111|max:999'
            ], [
                'card_expiration_date.date_format' => 'The card expiration date format is invalid. Should be MM/YY',
                'cvv.min' => 'The cvv field must be 3 digits.',
                'cvv.max' => 'The cvv field must be 3 digits.'
            ]);
        } catch (ValidationException $th) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'errors' => $th->validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['error' => 'No customer found with ID ' . $id . ' found'], 404);
        }

        $billingInfo = $customer->billingInfo()->first();

        if (!$billingInfo) {
            $billingInfo = new CustomerBillingInfo();
        }

        $billingInfo->cardholder = $request->cardholder;
        $billingInfo->card_type = $request->card_type;
        $billingInfo->card_number = $request->card_number;
        $billingInfo->card_expiration_date = $request->card_expiration_date;
        $billingInfo->cvv = $request->cvv;

        $customer->billingInfo()->save($billingInfo);

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => self::updated(),
            'billing_info' => $billingInfo,
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