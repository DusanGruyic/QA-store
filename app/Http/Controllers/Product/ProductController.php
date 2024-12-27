<?php

namespace App\Http\Controllers\Product;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Product\Product;
use App\Models\Product\ProductImage;
use Illuminate\Http\JsonResponse;
use App\Traits\ValidationTrait;
use App\Traits\ModelTrait;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
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
        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'products' => Product::with('productImage')->get(),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $product = Product::with('productImage')->find($id);

        if (!$product) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'message' => self::notFound(),
            ], 404);
        }

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'product' => $product,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'  => 'required|string|max:255|unique:products',
            'description'  => 'string|max:255',
            'price' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!is_int($value) && !is_float($value)) {
                        $fail(self::wrongDatatype($attribute, self::DATATYPES['NUMBER']));
                    }
                }
            ],
            'in_stock' => 'required|boolean',
            'cart_quantity' => 'required|integer',
            'quantity' => [
                'required',
                function ($attribute, $value, $fail) use ($request) {
                    if (!is_int($value)) {
                        $fail(self::wrongDatatype($attribute, self::DATATYPES['NUMBER']));
                    }

                    if (!$request->in_stock && $value > 0) {
                        $fail(self::VALIDATION_MESSAGES['CANNOT_SET_QUANTITY']);
                    }
                },
            ],
            'rating' => 'required|numeric'
        ]);

        $product = Product::create([
            'name'  => $request->name,
            'description'  => $request->description,
            'price' => $request->price,
            'in_stock' => $request->in_stock,
            'cart_quantity' => $request->cart_quantity,
            'quantity' => $request->quantity,
            'rating' => $request->rating
        ]);

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => self::created(),
            'product' => $product,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'message' => self::notFound(),
            ], 404);
        }

        if ($request->name && $request->name !== $product->name) {
            try {
                $request->validate([
                    'name'  => 'required|unique:products|string|max:255',
                    'cart_quantity' => 'required|integer',
                    'rating' => 'required|numeric',
                    'in_stock' => 'required|boolean',
                    'quantity' => [
                        'required',
                        function ($attribute, $value, $fail) use ($request) {
                            if (!is_int($value)) {
                                $fail(self::wrongDatatype($attribute, self::DATATYPES['NUMBER']));
                            }
        
                            if (!$request->in_stock && $value > 0) {
                                $fail(self::VALIDATION_MESSAGES['CANNOT_SET_QUANTITY']);
                            }
                        },
                    ]
                ]);
            } catch (ValidationException $th) {
                return response()->json([
                    'status' => self::STATUS_MESSAGES['ERROR'],
                    'errors' => $th->validator->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        try {
            $request->validate(
                [
                    'name'  => 'required|string|max:255',
                    'description'  => 'string|max:255',
                    'price' => [
                        'required',
                        function ($attribute, $value, $fail) {
                            if (!is_int($value) && !is_float($value)) {
                                $fail(self::wrongDatatype($attribute, self::DATATYPES['NUMBER']));
                            }
                        }
                    ],
                    'in_stock' => [
                        'required',
                        'boolean',
                        function ($value, $fail) use ($request) {
                            if ($value === true && $request->quantity < 1) {
                                $fail(self::VALIDATION_MESSAGES['CANNOT_SET_STOCK']);
                            } else if ($value === false && $request->quantity > 0) {
                                $fail(self::VALIDATION_MESSAGES['CANNOT_SET_STOCK']);
                            }
                        },
                    ],
                    'quantity' => [
                        'required',
                        function ($attribute, $value, $fail) use ($request) {
                            if (!is_int($value)) {
                                $fail(self::wrongDatatype($attribute, self::DATATYPES['NUMBER']));
                            }

                            if (!$request->in_stock && $value > 0) {
                                $fail(self::VALIDATION_MESSAGES['CANNOT_SET_QUANTITY']);
                            }
                        }
                    ],
                ],
            );
        } catch (ValidationException $th) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'errors' => $th->validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $product->name  = $request->name;
        $product->description  = $request->description;
        $product->price = $request->price;
        $product->in_stock = $request->in_stock;
        $product->quantity = $request->quantity;
        $product->rating = $request->rating;
        $product->save();

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => self::updated(),
            'product' => $product
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'message' => self::notFound(),
            ], 404);
        }

        $productImage = ProductImage::where('product_id', '=', $id)->first();
        $product->product_image = $productImage;
        $product->delete();

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => self::deleted(),
            'product' => $product,
        ]);
    }
}