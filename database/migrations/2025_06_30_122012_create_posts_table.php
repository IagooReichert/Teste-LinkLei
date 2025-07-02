<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('autor');
            $table->text('publicacao');
            $table->string('categoria');
            $table->string('imagem')->nullable(); // caminho/URL da imagem
            $table->timestamp('data_hora')->useCurrent();
            $table->timestamps();
        });
    }

    /*public function down()
    {
        Schema::dropIfExists('posts');
    }*/
}