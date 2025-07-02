<?php

use Illuminate\Support\Facades\Route;

Route::get('/teste', function () {
    return response()->json(['mensagem' => 'Rota API funcionando!']);
});

Route::apiResource('posts', 'App\Http\Controllers\PostController');
