<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ApiAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::guard('api')->check()) {
            Log::info('Unauthorized access attempt', ['url' => $request->url()]);
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}