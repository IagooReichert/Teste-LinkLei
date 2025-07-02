<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'autor',
        'publicacao',
        'categoria',
        'imagem',
        'data_hora',
    ];
}