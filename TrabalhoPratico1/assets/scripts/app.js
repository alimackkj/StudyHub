const dadosIniciais = {
    "cursos": [
        {
            "id": 1,
            "nome": "Programação Web Full-Stack",
            "descricao_curta": "Aprenda a criar sites e sistemas web do zero ao avançado.",
            "descricao_longa": "Neste curso completo, você passará por HTML, CSS, JavaScript, React e Node.js. O mercado de tecnologia está em alta, e ser um desenvolvedor Full-Stack abre inúmeras portas profissionais.",
            "professor": "Prof. Carlos Silva",
            "carga_horaria": "120 horas",
            "destaque": true,
            "imagem_principal": "https://placehold.co/800x400/6f42c1/FFFFFF?text=Web+Full-Stack",
            "modulos": [
                { "id": 1, "nome": "HTML5 & CSS3", "descricao": "Estruturação e estilização de páginas web.", "imagem": "https://placehold.co/400x300/20c997/FFFFFF?text=HTML+CSS" }
            ]
        },
        {
            "id": 2,
            "nome": "Matemática para o ENEM",
            "descricao_curta": "Revisão completa dos tópicos que mais caem na prova de Matemática.",
            "descricao_longa": "Estatística, Geometria, Funções e Matemática Básica abordados com foco prático na resolução de questões.",
            "professor": "Prof. Roberto Mendes",
            "carga_horaria": "80 horas",
            "destaque": true,
            "imagem_principal": "https://placehold.co/800x400/1e293b/FFFFFF?text=Matemática+ENEM",
            "modulos": [
                { "id": 1, "nome": "Matemática Básica", "descricao": "Frações, porcentagem e razão.", "imagem": "https://placehold.co/400x300/f59e0b/FFFFFF?text=Mat.Basica" }
            ]
        },
        {
            "id": 3,
            "nome": "Python para Iniciantes",
            "descricao_curta": "Dê seus primeiros passos na linguagem que mais cresce.",
            "descricao_longa": "Aprenda sintaxe básica, loops, estruturas de dados e automação de tarefas.",
            "professor": "Profa. Ana Julia",
            "carga_horaria": "40 horas",
            "destaque": false,
            "imagem_principal": "https://placehold.co/800x400/3b82f6/FFFFFF?text=Python+Iniciantes",
            "modulos": [
                { "id": 1, "nome": "Fundamentos", "descricao": "Variáveis e tipos de dados.", "imagem": "https://placehold.co/400x300/3b82f6/FFFFFF?text=Fundamentos" }
            ]
        }
    ]
};

// Inicializa o LocalStorage se estiver vazio
if (!localStorage.getItem('cursos')) {
    localStorage.setItem('cursos', JSON.stringify(dadosIniciais.cursos));
}
if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify([
        { "id": "1", "login": "admin", "senha": "123", "nome": "Administrador", "email": "admin@abc.com", "admin": true },
        { "id": "2", "login": "user", "senha": "123", "nome": "Usuário Comum", "email": "user@abc.com", "admin": false }
    ]));
}

// Funções de Auxílio de Sessão e Usuário
function getUsuarioLogado() {
    return JSON.parse(sessionStorage.getItem('usuarioLogado'));
}

function getCursos() {
    return JSON.parse(localStorage.getItem('cursos')) || [];
}

function getFavoritos(userId) {
    return JSON.parse(localStorage.getItem(`favoritos_${userId}`)) || [];
}

// Renderiza o menu da Navbar dinamicamente conforme o estado de Login
function ajustarNavbar() {
    const menuNav = document.getElementById('menuNav');
    if (!menuNav) return;

    const usuario = getUsuarioLogado();
    let htmlMenu = `<a href="index.html" class="nav-link text-white me-2">Início</a>`;

    if (usuario) {
        htmlMenu += `<a href="favoritos.html" class="nav-link text-white me-2">Favoritos</a>`;
        if (usuario.admin) {
            htmlMenu += `<a href="cadastro_itens.html" class="nav-link text-white me-2">Gerenciar Cursos (CRUD)</a>`;
        }
        htmlMenu += `<span class="navbar-text text-warning me-3">Olá, ${usuario.nome}</span>`;
        htmlMenu += `<button onclick="efetuarLogout()" class="btn btn-sm btn-outline-light">Sair</button>`;
    } else {
        htmlMenu += `<a href="login.html" class="btn btn-sm btn-outline-light me-2">Entrar</a>`;
        htmlMenu += `<a href="cadastro_usuario.html" class="btn btn-sm btn-light text-primary">Cadastrar</a>`;
    }
    menuNav.innerHTML = htmlMenu;
}

function efetuarLogout() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// Alternar Favorito (Adicionar/Remover)
function toggleFavorito(cursoId) {
    const usuario = getUsuarioLogado();
    if (!usuario) {
        alert("Você precisa estar logado para favoritar um curso!");
        window.location.href = 'login.html';
        return;
    }

    let favoritos = getFavoritos(usuario.id);
    if (favoritos.includes(cursoId)) {
        favoritos = favoritos.filter(id => id !== cursoId);
    } else {
        favoritos.push(cursoId);
    }
    localStorage.setItem(`favoritos_${usuario.id}`, JSON.stringify(favoritos));
    
    // Recarrega a tela atual para atualizar os corações
    if (document.getElementById('listaTodos')) renderHome();
    if (document.getElementById('infoGerais')) {
        const params = new URLSearchParams(window.location.search);
        renderDetails(parseInt(params.get('id')));
    }
    if (window.location.pathname.includes('favoritos.html')) renderFavoritos();
}

// ====== RENDERIZAR HOME (index.html) ======
function renderHome(filtroPesquisa = "") {
    const carouselInner = document.getElementById('carouselInner');
    const listaTodos = document.getElementById('listaTodos');
    const cursos = getCursos();
    const usuario = getUsuarioLogado();
    const favoritos = usuario ? getFavoritos(usuario.id) : [];

    // 1. Renderizar Carrossel (Destaques)
    if (carouselInner) {
        carouselInner.innerHTML = "";
        let destaques = cursos.filter(c => c.destaque);
        // Se nenhum curso estiver marcado como destaque, mostra os primeiros cursos
        if (destaques.length === 0) destaques = cursos.slice(0, 3);
        if (destaques.length === 0) {
            carouselInner.innerHTML = `
                <div class="carousel-item active" style="height: 400px;">
                    <div class="d-flex h-100 align-items-center justify-content-center bg-dark text-white">
                        <p class="mb-0">Nenhum curso cadastrado ainda.</p>
                    </div>
                </div>`;
        }
        destaques.forEach((curso, index) => {
            const activeClass = index === 0 ? 'active' : '';
            carouselInner.innerHTML += `
                <div class="carousel-item ${activeClass}" style="height: 400px;">
                    <img src="${curso.imagem_principal}" class="d-block w-100 h-100 object-cover" alt="${curso.nome}" style="opacity: 0.75; background-color: #000;">
                    <div class="carousel-caption bg-dark bg-opacity-75 rounded p-3">
                        <h5>${curso.nome}</h5>
                        <p>${curso.descricao_curta}</p>
                        <a href="detalhes.html?id=${curso.id}" class="btn btn-light btn-sm fw-bold">Ver Detalhes</a>
                    </div>
                </div>`;
        });
    }

    // 2. Renderizar Grid de Cards (Com pesquisa e Favoritos)
    if (listaTodos) {
        listaTodos.innerHTML = "";
        
        const cursosFiltrados = cursos.filter(curso => 
            curso.nome.toLowerCase().includes(filtroPesquisa.toLowerCase()) || 
            curso.descricao_curta.toLowerCase().includes(filtroPesquisa.toLowerCase())
        );

        if (cursosFiltrados.length === 0) {
            listaTodos.innerHTML = `<div class="col-12 mx-auto text-center py-4 text-muted">Nenhum curso encontrado para sua pesquisa.</div>`;
            return;
        }

        cursosFiltrados.forEach(curso => {
            const isFav = favoritos.includes(curso.id);
            const iconeCoracao = isFav ? '♥' : '♡';
            // MODIFICAÇÃO AQUI: Mudamos para controlar a cor do texto do coração (vermelho ou cinza)
            const classeCoracao = isFav ? 'text-danger' : 'text-muted';

            listaTodos.innerHTML += `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0 position-relative">
                        <button onclick="toggleFavorito(${curso.id})" class="btn position-absolute top-0 end-0 m-2 rounded-circle border-0 bg-white shadow-sm fw-bold ${classeCoracao}" style="z-index: 10; font-size: 1.3rem; padding: 2px 10px;">
                            ${iconeCoracao}
                        </button>
                        <img src="${curso.imagem_principal}" class="card-img-top object-cover" alt="${curso.nome}" style="height: 200px;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold">${curso.nome}</h5>
                            <p class="card-text text-muted flex-grow-1">${curso.descricao_curta}</p>
                            <a href="detalhes.html?id=${curso.id}" class="btn mt-auto text-white fw-bold" style="background-color: #6f42c1;">Ver Detalhes</a>
                        </div>
                    </div>
                </div>`;
        });
    }
}

// ====== RENDERIZAR DETALHES (detalhes.html) ======
function renderDetails(id) {
    // CORREÇÃO: Buscando corretamente de getCursos() para não quebrar a página
    const cursos = getCursos();
    const curso = cursos.find(c => c.id === id);
    const infoGerais = document.getElementById('infoGerais');
    const infoModulos = document.getElementById('infoModulos');

    if (!curso) {
        if (infoGerais) infoGerais.innerHTML = "<div class='alert alert-danger'>Curso não encontrado.</div>";
        return;
    }

    const usuarioLogado = getUsuarioLogado();
    const favorites = usuarioLogado ? getFavoritos(usuarioLogado.id) : [];

    if (infoGerais) {
        const iconeCoracao = favorites.includes(curso.id) ? '💖' : '🤍';

        infoGerais.innerHTML = `
            <div class="card shadow-sm border-0 overflow-hidden">
                <div class="row g-0">
                    <div class="col-md-5">
                        <img src="${curso.imagem_principal}" class="img-fluid w-100 h-100 object-cover" alt="${curso.nome}" style="min-height: 250px;">
                    </div>
                    <div class="col-md-7">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge bg-success fs-6">${curso.carga_horaria}</span>
                                <button class="btn btn-link p-0 fs-4 text-decoration-none" onclick="toggleFavorito(${curso.id})">
                                    ${iconeCoracao}
                                </button>
                            </div>
                            <h1 class="card-title h2 fw-bold mb-3" style="color: #6f42c1;">${curso.nome}</h1>
                            <p class="card-text fs-5 text-secondary mb-3"><em>${curso.descricao_curta}</em></p>
                            <p class="card-text">${curso.descricao_longa}</p>
                            <hr>
                            <p class="card-text mb-0"><small class="text-muted"><strong>Professor Responsável:</strong> ${curso.professor}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    if (infoModulos) {
        infoModulos.innerHTML = ""; 
        curso.modulos.forEach(modulo => {
            infoModulos.innerHTML += `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0">
                        <img src="${modulo.imagem}" class="card-img-top object-cover" alt="Foto de ${modulo.nome}" style="height: 180px;">
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-dark">${modulo.nome}</h5>
                            <p class="card-text text-muted small">${modulo.descricao}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

// ====== RENDERIZAR FAVORITOS (favoritos.html) ======
function renderFavoritos() {
    const usuario = getUsuarioLogado();
    const listaFavoritos = document.getElementById('listaFavoritos');
    
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    if (!listaFavoritos) return;
    listaFavoritos.innerHTML = "";

    const cursos = getCursos();
    const favoritosIds = getFavoritos(usuario.id);
    const meusFavoritos = cursos.filter(c => favoritosIds.includes(c.id));

    if (meusFavoritos.length === 0) {
        listaFavoritos.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="fs-5 text-muted">Você ainda não possui itens favoritos cadastrados.</p>
                <a href="index.html" class="btn text-white" style="background-color: #6f42c1;">Explorar Cursos</a>
            </div>`;
        return;
    }

    meusFavoritos.forEach(curso => {
        listaFavoritos.innerHTML += `
            <div class="col">
                <div class="card h-100 shadow-sm border-0 position-relative">
                    <button onclick="toggleFavorito(${curso.id})" class="btn btn-danger position-absolute top-0 end-0 m-2 rounded-circle border-0 bg-white shadow-sm fw-bold" style="z-index: 10; font-size: 1.3rem; padding: 2px 10px;">
                        ♥
                    </button>
                    <img src="${curso.imagem_principal}" class="card-img-top object-cover" alt="${curso.nome}" style="height: 200px;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold">${curso.nome}</h5>
                        <p class="card-text text-muted flex-grow-1">${curso.descricao_curta}</p>
                        <div class="d-flex gap-2 mt-auto">
                            <a href="detalhes.html?id=${curso.id}" class="btn text-white fw-bold flex-grow-1" style="background-color: #6f42c1;">Ver Detalhes</a>
                            <button onclick="toggleFavorito(${curso.id})" class="btn btn-outline-danger btn-sm">Remover</button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

// ====== GESTÃO DA INICIALIZAÇÃO ======
document.addEventListener("DOMContentLoaded", () => {
    ajustarNavbar();

    const campoPesquisa = document.getElementById('campoPesquisa');
    if (campoPesquisa) {
        campoPesquisa.addEventListener('input', (e) => {
            renderHome(e.target.value);
        });
    }

    if (document.getElementById('carouselInner') || document.getElementById('listaTodos')) {
        renderHome();
    } else if (document.getElementById('infoGerais')) {
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id'));
        renderDetails(id);
    } else if (document.getElementById('listaFavoritos')) {
        renderFavoritos();
    }
}); // CORREÇÃO: Chave intrusa removida com sucesso!