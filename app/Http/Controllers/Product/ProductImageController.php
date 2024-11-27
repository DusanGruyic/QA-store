<?php

namespace App\Http\Controllers\Product;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Product\Product;
use App\Models\Product\ProductImage;
use App\Traits\ModelTrait;
use App\Traits\ValidationTrait;
use Illuminate\Http\JsonResponse;

class ProductImageController extends Controller
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
            'images' => ProductImage::all(),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $productImage = ProductImage::find($id);
        if (!$productImage) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'message' => 'No product image found.',
            ], 404);
        }

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'product_image' => ProductImage::find($id)
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'src' => 'required|string|max:255',
            'title' => 'string|max:255|nullable',
            'description' => 'string|max:255|nullable',
            'mime_type' => 'string|max:255|nullable',
            'alt_text' => 'string|max:255|nullable',
        ]);

        $productImage = ProductImage::create([
            'src' => $request->src,
            'title' => $request->title,
            'description' => $request->description,
            'mime_type' => $request->mime_type,
            'alt_text' => $request->alt_text,
        ]);

        return response()->json([
            'status' => self::STATUS_MESSAGES['SUCCESS'],
            'message' => 'Product image created successfully',
            'product_image' => $productImage,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'status' => self::STATUS_MESSAGES['ERROR'],
                'message' => 'No product found.',
            ], 404);
        }

        $request->validate([
            'src'  => 'required|string|max:255',
            'title'  => 'string|max:255',
            'description'  => 'string|max:255',
            'mime_type' => 'string|max:255',
            'alt_text' => 'string|max:255',
        ]);

        $productImage = $product->productImage()->first();
        if (!$productImage) {
            $productImage = new ProductImage();
        }

        $productImage->title = $request->title;
        $productImage->description = $request->description;
        $productImage->mime_type = $request->mime_type;
        $productImage->alt_text = $request->alt_text;
        $productImage->src = $request->src;

        $product->productImage()->save($productImage);

        return response()->json([
            'status' => 'Success',
            'message' => self::updated(),
            'product_image' => $productImage
        ]);
    }
}