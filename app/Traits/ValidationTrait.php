<?php

namespace App\Traits;

trait ValidationTrait
{
    protected static $modelName;
    protected static $rules;
    protected static $messages;

    protected const DATATYPES = [
        'NUMBER' => 'number',
        'BOOLEAN' => 'boolean',
    ];

    protected const STATUS_MESSAGES = [
        'SUCCESS' => 'Success',
        'ERROR' => 'Error',
    ];

    protected const VALIDATION_MESSAGES = [
        'CANNOT_SET_QUANTITY' => 'Cannot set quantity when product is not in stock.',
        'CANNOT_SET_STOCK' => 'Cannot set stock when there is no products.',
        'OUT_OF_STOCK' => 'Sorry, this product is currently not in stock.',
    ];

    protected function wrongDatatype($field, $type)
    {
        return "The $field must be a $type";
    }

    protected function routeNotFound($route)
    {
        return "The route $route could not be found.";
    }

    protected function notFound()
    {
        return 'No ' . self::$modelName . ' found.';
    }

    protected function created()
    {
        return ucfirst(self::$modelName) . ' created successfully.';
    }

    protected function updated()
    {
        if (self::$modelName === 'BillingInfo') {
            $modelName = 'Billing information';

            return $modelName . ' updated successfully.';
        } elseif (self::$modelName === 'ShippingInfo') {
            $modelName = 'Shipping information';

            return $modelName . ' updated successfully.';
        }

        return ucfirst(self::$modelName) . ' updated successfully.';
    }

    protected function deleted()
    {
        return ucfirst(self::$modelName) . ' deleted successfully.';
    }

    protected function addedToCart()
    {
        return 'Product successfully added to cart';
    }

    protected function removedFromCart()
    {
        return 'Product successfully removed from cart';
    }

    protected function empty()
    {
        ucfirst(self::$modelName) . ' is empty.';
    }
}