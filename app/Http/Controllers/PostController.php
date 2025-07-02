<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    // Listar posts
    public function index()
    {
        return Post::orderBy('data_hora', 'desc')->paginate(5);
    }

    // Criar post
    public function store(Request $request)
    {
        $request->validate([
            'autor' => 'required|string|max:255',
            'publicacao' => 'required|string',
            'categoria' => 'required|string',
            'imagem' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // max 2MB
        ]);

        $imagemPath = null;
        if ($request->hasFile('imagem')) {
            $imagemPath = $request->file('imagem')->store('imagens', 'public');
        }

        $post = Post::create([
            'autor' => $request->autor,
            'publicacao' => $request->publicacao,
            'categoria' => $request->categoria,
            'imagem' => $imagemPath,
            'data_hora' => now(),
        ]);

        return response()->json($post, 201);
    }

    // Mostrar post específico
    public function show($id)
    {
        $post = Post::findOrFail($id);
        return response()->json($post);
    }

    // Atualizar post
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $request->validate([
            'autor' => 'required|string|max:255',
            'publicacao' => 'required|string',
            'categoria' => 'required|string',
            'imagem' => 'nullable|image|max:2048',
        ]);

         if ($request->filled('remover_imagem') && $request->remover_imagem === 'true') {
            if ($post->imagem) {
                Storage::disk('public')->delete($post->imagem);
            }
            $post->imagem = null;
        } elseif ($request->hasFile('imagem')) {
        // Se veio nova imagem, substituir a antiga
            if ($post->imagem) {
                Storage::disk('public')->delete($post->imagem);
            }
            $post->imagem = $request->file('imagem')->store('imagens', 'public');
        }

        $post->autor = $request->autor;
        $post->publicacao = $request->publicacao;
        $post->categoria = $request->categoria;
        $post->save();

        return response()->json($post);
    }

    // Deletar post
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        if ($post->imagem) {
            Storage::disk('public')->delete($post->imagem);
        }
        $post->delete();

        return response()->json(null, 204);
    }
}
