import React, { useRef, useState, useEffect } from 'react';

//botão que abre o modal para criar um post
function CriarPost({ abrirModal }) {
  return (
    <div className="form__caixa">
      <button type="button" className="form__botaoPost" onClick={abrirModal}>
        Criar Post
      </button>
    </div>
  );
}

//modal que exibe o formulário para criação/edição do post
function Modal({ isOpen, fecharModal, autor, setAutor, categoria, setCategoria, publicacao, setPublicacao, publicarPost, setImagem, imagem, nomeArquivo, setNomeArquivo }) {
  

  // Função para remover imagem selecionada
  const removerImagem = () => {
    setImagem(null);
    setNomeArquivo("");
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="modal-fundo">
      <div className="modal-caixa">
        <button className="botao-fechar" onClick={fecharModal}>X</button>
        <h2>Criar post</h2>
        <CampoDeDigitacao type="text" placeholder="Autor do post" value={autor} setValue={setAutor} />
        <CampoDeSelecao value={categoria} setValue={setCategoria} opcoes={["Post", "Artigo", "Grupo"]} />
        <CampoDePublicacao type="textarea" placeholder="Escrever publicação" value={publicacao} setValue={setPublicacao} />

        <div className="botoes-modal">
          <UploadImagem setImagem={setImagem} imagem={imagem} onArquivoSelecionado={setNomeArquivo} />
          <button className="botao-publicar" onClick={publicarPost}>PUBLICAR</button>
        </div>

        {/* Preview do nome do arquivo e botão para remover imagem */}
        {imagem && nomeArquivo && (
          <div className="container-preview">
            <span className="nome-arquivo">{nomeArquivo}</span>
            <button type="button" className="botao-arquivo" onClick={removerImagem}>X</button>
          </div>
        )}
      </div>
    </div>
  );
}

//campo de input simples para texto
function CampoDeDigitacao({ type, placeholder, value, setValue }) {
  return (
    <div className="form__campo">
      <input
        type={type}
        placeholder={placeholder}
        required
        id={type}
        value={value}
        onChange={(evento) => setValue(evento.target.value)}
      />
    </div>
  );
}

//campo de texto maior (textarea) para publicação
function CampoDePublicacao({ type, placeholder, value, setValue }) {
  return (
    <div className="form__campo">
      <textarea
        type={type}
        placeholder={placeholder}
        required
        id={type}
        value={value}
        onChange={(evento) => setValue(evento.target.value)}
      />
    </div>
  );
}

//seleção de categoria via dropdown
function CampoDeSelecao({ opcoes, value, setValue }) {
  return (
    <div className="form__campo">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      >
        <option value="">Selecione a categoria</option>
        {opcoes.map((opcao, index) => (
          <option key={index} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
    </div>
  );
}

//upload de imagem com botão
function UploadImagem({ setImagem, imagem, onArquivoSelecionado }) {
  const fileInputRef = useRef(null);

  // Abre o seletor de arquivo
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Trata o arquivo selecionado, atualizando estado e nome do arquivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onArquivoSelecionado(file.name);
      setImagem(file); // envia o arquivo real para o estado
    } else {
      setImagem(null);
      onArquivoSelecionado("");
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".jpg,.jpeg,.png" // aceita somente imagens jpg/jpeg/png
        onChange={handleFileChange}
        style={{ display: 'none' }} // esconde input file padrão
      />
      <button type="button" className="botao-imagem" onClick={handleButtonClick}>
        <img src="./images/btn_image.svg" alt="ícone imagem" className="icone-botao" />
        IMAGEM
      </button>
    </>
  );
}

//renderiza a lista de posts no feed, com opções de editar/excluir
function Feed({ posts, editarPost, excluirPost, modalAberto, textoExpandido, setTextoExpandido }) {
  const [menuAberto, setMenuAberto] = useState(null);

  // Abre ou fecha o menu de opções do post
  const toggleMenu = (index) => {
    setMenuAberto(menuAberto === index ? null : index);
  };

  //edição do post selecionado
  const handleEditar = (index) => {
    editarPost(index);
    setMenuAberto(null);
  };

  //exclusão do post selecionado
  const handleExcluir = (index) => {
    excluirPost(index);
    setMenuAberto(null);
  };

  return (
    <div className='form__feed'>
      {posts.map((post, index) => (
        <div className="container-feed" key={index}>
          <div className="form__post">
            <div className="post-header">
              <div className="autor-info">
                <img
                  src={post.fotoPerfil || "./images/avatar_default.png"}
                  alt={`Foto de ${post.autor}`}
                  className="foto-perfil"
                />
                <div className="autor-nome-e-data">
                  <strong>{post.autor}</strong>
                  <p className='data-postagem'>Publicado em {formatarData(post.data_hora)}</p>
                </div>
              </div>

              <div className="menu-post">
                <button className="menu-botao" onClick={() => toggleMenu(index)}>
                  <img src="./images/dotdotdot.svg" alt="icone dotdot" />
                </button>

                {menuAberto === index && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleEditar(index)}>
                      <img src="./images/btn_edit.svg" alt="ícone editar" className='icone-editar' />
                      Editar
                    </button>
                    <button onClick={() => handleExcluir(index)}>
                      <img src="./images/btn_delete.svg" alt="ícone excluir" className='icone-excluir' />
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="categoria-feed">
            <strong>
              <img src="./images/feed.svg" alt="icone categoria" className='icone-categoria' />
              {post.categoria}
            </strong>
          </div>

          <p>
            {/* Mostra o texto completo ou apenas um trecho com opção "Leia mais..." */}
            {textoExpandido[index] || post.publicacao.length <= 500
              ? post.publicacao
              : `${post.publicacao.substring(0, 500)} `
            }

            {post.publicacao.length > 500 && !textoExpandido[index] && (
              <button
                className="link-leia-mais"
                onClick={() => setTextoExpandido((prev) => ({ ...prev, [index]: true }))}
              >
                Leia mais...
              </button>
            )}
          </p>

          {/* Renderiza imagem do post se existir */}
          {post.imagem && (
            <img src={`http://localhost:8000/storage/${post.imagem}`} alt="Imagem do post" className="post-imagem" />
          )}
        </div>
      ))}
    </div>
  );
}

// Função para formatar a data para o padrão brasileiro 
function formatarData(dataIso) {
  const data = new Date(dataIso);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }) + " às " + data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Componente principal do feed com gerenciamento do estado, modal, posts e rolagem infinita
export default function FeedLinkLei() {
  // Estados para o modal e os campos do formulário
  const [modalAberto, setModalAberto] = useState(false);
  const [autor, setAutor] = useState("");
  const [publicacao, setPublicacao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagem, setImagem] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [textoExpandido, setTextoExpandido] = useState({});
  const [nomeArquivo, setNomeArquivo] = useState("");
  

  // Estados para rolagem infinita
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [temMais, setTemMais] = useState(true);
  const [carregando, setCarregando] = useState(false);

  

  // Função que busca posts da API paginada e atualiza o estado de posts
  const carregarPosts = (pagina) => {
    if (carregando || !temMais) return;

    setCarregando(true);
    fetch(`http://localhost:8000/api/posts?page=${pagina}`)
      .then((res) => res.json())
      .then((dados) => {
        // Adiciona os posts novos no array de posts
        setPosts((prev) => [...prev, ...dados.data]);
        // Verifica se ainda tem mais páginas para carregar
        setTemMais(dados.current_page < dados.last_page);
        setPaginaAtual(pagina + 1);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  };

  //carrega a primeira página de posts ao montar o componente
  useEffect(() => {
    carregarPosts(1);
  }, []);

  //scroll da página para carregar mais posts quando o usuário chegar perto do final
  useEffect(() => {
    const aoRolar = () => {
      const scrollTop = window.scrollY;
      const alturaTotal = document.documentElement.scrollHeight;
      const alturaVisivel = window.innerHeight;

      if (scrollTop + alturaVisivel >= alturaTotal - 200) {
        carregarPosts(paginaAtual);
      }
    };

    window.addEventListener("scroll", aoRolar);
    return () => window.removeEventListener("scroll", aoRolar);
  }, [paginaAtual, temMais, carregando]);

  // publicar um novo post ou editar um existente
  const publicarPost = () => {
  if (!autor || !publicacao || !categoria) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const formData = new FormData();
  formData.append("autor", autor);
  formData.append("publicacao", publicacao);
  formData.append("categoria", categoria);

  if (imagem && typeof imagem !== "string") {
    // Se imagem for arquivo (upload novo)
    formData.append("imagem", imagem);
    formData.append("remover_imagem", "false");
  } else if (!imagem) {
    // Se imagem é null, significa que o usuário removeu a imagem
    formData.append("remover_imagem", "true");
  } else {
    // imagem é string (nome da imagem antiga) e não enviou novo arquivo
    formData.append("remover_imagem", "false");
  }

  const url = editandoId
    ? `http://localhost:8000/api/posts/${editandoId}`
    : "http://localhost:8000/api/posts";

  if (editandoId) {
    formData.append("_method", "PUT");
  }

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao salvar post.");
      return res.json();
    })
    .then((postSalvo) => {
      if (editandoId) {
        // Atualiza o post editado no estado
        const novosPosts = [...posts];
        const i = posts.findIndex((p) => p.id === editandoId);
        novosPosts[i] = postSalvo;
        setPosts(novosPosts);
      } else {
        // Adiciona o novo post no topo do feed
        setPosts([postSalvo, ...posts]);
      }

      // Limpa os campos e fecha modal
      setAutor("");
      setPublicacao("");
      setCategoria("");
      setImagem(null);
      setNomeArquivo("");
      setModalAberto(false);
      setEditandoIndex(null);
      setEditandoId(null);
    })
    .catch((err) => {
      console.error(err);
      alert("Falha ao salvar post.");
    });
};


  //iniciar edição do post, carregando dados nos campos do modal
const editarPost = (index) => {
  const post = posts[index];
  setAutor(post.autor);
  setPublicacao(post.publicacao);
  setCategoria(post.categoria);
  setImagem(post.imagem); // string com caminho da imagem

  if (post.imagem) {
    // Extrai só o nome do arquivo, removendo pasta
    const nomeSomente = post.imagem.split('/').pop();
    setNomeArquivo(nomeSomente);
  } else {
    setNomeArquivo("");
  }

  setEditandoId(post.id);
  setModalAberto(true);
};

  //excluir post do backend e atualizar a lista local
  const excluirPost = (index) => {
    const confirmar = window.confirm("Excluir post?");
    if (!confirmar) return;

    const post = posts[index];
    fetch(`http://localhost:8000/api/posts/${post.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir post.");
        const novosPosts = [...posts];
        novosPosts.splice(index, 1);
        setPosts(novosPosts);
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao excluir post.");
      });
  };

  // Renderização dos componentes do feed, modal e botão de criar post
  return (
    <section>
      <CriarPost
        abrirModal={() => {
          setAutor("");
          setPublicacao("");
          setCategoria("");
          setImagem(null);
          setEditandoId(null);
          setModalAberto(true);
        }}
      />
      <Modal
        isOpen={modalAberto}
        fecharModal={() => setModalAberto(false)}
        autor={autor}
        setAutor={setAutor}
        categoria={categoria}
        setCategoria={setCategoria}
        publicacao={publicacao}
        setPublicacao={setPublicacao}
        publicarPost={publicarPost}
        setImagem={setImagem}
        imagem={imagem}
        nomeArquivo={nomeArquivo}
        setNomeArquivo={setNomeArquivo}
      />
      <Feed
        posts={posts}
        editarPost={editarPost}
        excluirPost={excluirPost}
        modalAberto={modalAberto}
        textoExpandido={textoExpandido}
        setTextoExpandido={setTextoExpandido}
      />
      {!temMais && !carregando && (
        <div className="mensagem-final">
          <p>Não existem mais itens a serem exibidos.</p>
        </div>
      )}
    </section>
  );
}
