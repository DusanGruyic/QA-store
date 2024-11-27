<?php

namespace App\Traits;

trait ModelTrait
{

    protected function getModelName()
    {
        return strtolower(str_replace('Controller', '', class_basename(__CLASS__)));
    }
}
