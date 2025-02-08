const db = new Dexie("database")
    db.version(1).stores({
    basedb: '++id,nome,base'
})
db.open()

window.engineBase = {
    info: {
        id: 0,
        base: 1,
        editor: "editorWorld"
    },
    world: {
    },
    object: {
    }
}
window.engine = {}

/*

██    ██ ████████ ██ ██      ██ ████████  █████  ██████  ██  ██████  
██    ██    ██    ██ ██      ██    ██    ██   ██ ██   ██ ██ ██    ██ 
██    ██    ██    ██ ██      ██    ██    ███████ ██████  ██ ██    ██ 
██    ██    ██    ██ ██      ██    ██    ██   ██ ██   ██ ██ ██    ██ 
 ██████     ██    ██ ███████ ██    ██    ██   ██ ██   ██ ██  ██████  
                                                                     
*/
window._engine_atual_projeto = null

window._engine_pegar_id = function () {
    engine.info.id += 1
    return engine.info.id
}

window._engine_abrir_alerta = function (_html, _texto) {
    _l_alerta_div = document.getElementById("alerta")
    _l_alerta_div.innerHTML = _html 
    if (_html == "alerta") {
        _l_alerta_div.innerHTML = `
        <div style="background-color: #191A24; padding: 10px; width: 300px; margin: 10px;">
            <h3 style="font-family: Arial, Helvetica, sans-serif; font-weight: 200;">${_texto}</h3>
            <div style="display: flex; justify-content: end; width: 100%; padding-top: 10px;">
                <button style="background-color: #21212b; padding: 10px;" onclick="_engine_fechar_alerta()">Continue</button>
            </div>
        </div>
        `
    }
    if (_html == "input") {
        _l_alerta_div.innerHTML = `
        <div style="background-color: #191A24; padding: 10px; width: 300px; margin: 10px;">
            <input style="background-color: #21212b; border: none; padding: 10px; width: calc(100% - 20px); outline: none;" type="text" placeholder="Name" id="input-alerta">
            <div style="display: flex; justify-content: end; width: 100%; padding-top: 10px;">
                <button style="background-color: #21212b; width: 50%; padding: 10px;" onclick="${_texto}">continue</button>
                <button style="background-color: #21212b; width: 50%; padding: 10px; margin-left: 2px;" onclick="_engine_fechar_alerta()">Cancel</button>
            </div>
        </div>
        `
    }
    _l_alerta_div.style.display = "flex"
}
window._engine_fechar_alerta = function () {
    _l_alerta_div = document.getElementById("alerta")
    _l_alerta_div.style.display = "none"
    _l_alerta_div.innerHTML = '' 
}

/*

 ██████  ██████  ███    ██ ████████ ██████   ██████  ██      ███████     ██████  ██████   ██████       ██ ███████ ████████  ██████  
██      ██    ██ ████   ██    ██    ██   ██ ██    ██ ██      ██          ██   ██ ██   ██ ██    ██      ██ ██         ██    ██    ██ 
██      ██    ██ ██ ██  ██    ██    ██████  ██    ██ ██      █████       ██████  ██████  ██    ██      ██ █████      ██    ██    ██ 
██      ██    ██ ██  ██ ██    ██    ██   ██ ██    ██ ██      ██          ██      ██   ██ ██    ██ ██   ██ ██         ██    ██    ██ 
 ██████  ██████  ██   ████    ██    ██   ██  ██████  ███████ ███████     ██      ██   ██  ██████   █████  ███████    ██     ██████  

*/ 

window._engine_projeto_criar = async function (_nome) {
    let _l_sql = await db.basedb.where('nome').equals(_nome).count()
    if (_l_sql > 0) {
        return {
            resultado: false,
            codigo: "1-1",
            erro: "A project with this name already exists."
        }
    }
    if (localStorage.getItem('engine') == null) {
        localStorage.setItem('engine', JSON.stringify({[_nome]: {nome: _nome, base: 1}}))
    } else {
        let _l_arquivo = JSON.parse(localStorage.getItem('engine'))
        _l_arquivo[_nome] = {nome: _nome, base: 1}
        localStorage.setItem('engine', JSON.stringify(_l_arquivo))
    }
    await db.basedb.add({ nome: _nome, base: engineBase })
    return {resultado: true}
}

window._engine_projeto_ler = async function (_nome) {
    _engine_atual_projeto = _nome
    let _l_basedb = await db.basedb.where('nome').equals(_nome).toArray();
    if (_l_basedb.length > 0) {
        _l_basedb.forEach(friend => { engine = friend.base })
        return {resultado: true}
    }
    return {
        resultado: false,
        codigo: "1-2",
        erro: "This project does not exist."
    }
}

window._engine_projeto_atualizar = async function (_nome) {
    let _l_sql = await db.basedb.where('nome').equals(_nome).toArray()
    if (_l_sql[0].nome == _nome) {
        await db.basedb.update(_l_sql[0].id, { base: engine })
        return {resultado: true}
    }
    return {
        resultado: false,
        codigo: "1-3",
        erro: "Error updating project."
    }
}

window._engine_projeto_deletar = async function (_nome) {
    let l_sql = await db.basedb.where('nome').equals(_nome).count();
    if (l_sql > 0) {
        await db.basedb.where('nome').equals(_nome).delete();
        return {resultado: true}
    }
    return {
        resultado: false,
        codigo: "1-4",
        erro: "Error deleting project."
    }
}

/*

 █████  ██████   ██████  ██    ██ ██ ██    ██  ██████       ██████  ██████       ██ ███████ ████████  ██████  
██   ██ ██   ██ ██    ██ ██    ██ ██ ██    ██ ██    ██     ██    ██ ██   ██      ██ ██         ██    ██    ██ 
███████ ██████  ██    ██ ██    ██ ██ ██    ██ ██    ██     ██    ██ ██████       ██ █████      ██    ██    ██ 
██   ██ ██   ██ ██ ▄▄ ██ ██    ██ ██  ██  ██  ██    ██     ██    ██ ██   ██ ██   ██ ██         ██    ██    ██ 
██   ██ ██   ██  ██████   ██████  ██   ████    ██████       ██████  ██████   █████  ███████    ██     ██████  
                    ▀▀                                                                                                                         
*/ 

window._engine_arquivo_objeto_criar_pasta = function (_nome) {
    if (!engine.object[_nome]) {
        engine.object[_nome] = {}
        return {resultado: true}
    }
    return {
        resultado: false,
        codigo: "2-1",
        erro: "A folder with this name already exists."
    }
}

window._engine_arquivo_objeto_deletar_pasta = function (_nome) {
    delete engine.object[_nome]
    return {resultado: true}
}

let _g_selecionado_pasta_object = null
window._engine_arquivo_objeto_abrir_pasta = function (_nome) {
    if (engine.object[_nome]) {
        _g_selecionado_pasta_object = _nome
        return {
            resultado: true,
            arquivos: engine.object[_nome]
        }
    }
    return {
        resultado: false,
        codigo: "2-2",
        erro: "This folder does not exist."
    }
}

window._engine_arquivo_objeto_pasta_atual = function () {
    if (_g_selecionado_pasta_object) {
        return {
            resultado: true,
            pasta: _g_selecionado_pasta_object,
            arquivos: engine.object[_g_selecionado_pasta_object]
        }
    }
    return {
        resultado: false,
        codigo: "2-3",
        erro: "Current folder not found."
    }
}

window._engine_arquivo_objeto_criar_objeto = function (_nome) {
    if (_engine_arquivo_objeto_encontra_objeto(_nome).resultado) {
        return {
            resultado: false,
            codigo: "2-5",
            erro: "This object already exists."
        }
    }
    if (_g_selecionado_pasta_object == null) {
        return {
            resultado: false,
            codigo: "2-6",
            erro: "No folder selected."
        }
    }
    if (!engine.object[_g_selecionado_pasta_object][_nome]) {
        engine.object[_g_selecionado_pasta_object][_nome] = {}
        return {resultado: true}
    }
    return {
        resultado: false,
        codigo: "2-7",
        erro: "Error creating object."
    }
}

window._engine_arquivo_objeto_encontra_objeto = function (_nome) {
    for (let _key_pasta in engine.object) {
        for (let _key_objeto in engine.object[_key_pasta]) {
            if (_key_objeto == _nome) {
                return {
                    resultado: true,
                    pasta: _key_objeto,
                    arquivos: engine.object[_key_pasta][_nome]
                }
            }
        }
    }
    return {
        resultado: false,
        codigo: "2-4",
        erro: "This object does not exist."
    }
}

window._engine_arquivo_objeto_pegar_objeto = function (_nome) {
    _objeto = _engine_arquivo_objeto_encontra_objeto(_nome)
    if (!_objeto.resultado) {
        return {
            resultado: false,
            codigo: "2-8",
            erro: "Object not found."
        }
    }
    if (!engine.object[_objeto.pasta][_nome]) {
        engine.object[_objeto.pasta][_nome] = {}
        return {
            resultado: true
        }
    }
    return {
        resultado: false,
        codigo: "2-9",
        erro: "Error finding the object."
    }
}

/*

███████ ██████  ██ ████████  ██████  ██████      ██     ██  ██████  ██████  ██      ██████  
██      ██   ██ ██    ██    ██    ██ ██   ██     ██     ██ ██    ██ ██   ██ ██      ██   ██ 
█████   ██   ██ ██    ██    ██    ██ ██████      ██  █  ██ ██    ██ ██████  ██      ██   ██ 
██      ██   ██ ██    ██    ██    ██ ██   ██     ██ ███ ██ ██    ██ ██   ██ ██      ██   ██ 
███████ ██████  ██    ██     ██████  ██   ██      ███ ███   ██████  ██   ██ ███████ ██████  
                                                                                                                           
*/ 

window._engine_arquivo_world_criar_pasta = function (_nome) {
    if (!engine.world[_nome]) {
        engine.world[_nome] = {}
        return {resultado: true}
    }
    return {
        resultado: false,
        codigo: "3-1",
        erro: "A folder with this name already exists."
    }
}

window._engine_arquivo_world_deletar_pasta = function (_nome) {
    delete engine.world[_nome]
}

let _g_selecionado_pasta_world = null
window._engine_arquivo_world_abrir_pasta = function (_nome) {
    if (engine.world[_nome]) {
        _g_selecionado_pasta_world = _nome
        return {
            resultado: true,
            arquivos: engine.world[_nome]
        }
    }
    return {
        resultado: false,
        codigo: "3-2",
        erro: "This folder does not exist."
    }
}

window._engine_arquivo_world_pasta_atual = function () {
    if (_g_selecionado_pasta_world) {
        return {
            resultado: true,
            pasta: _g_selecionado_pasta_world,
            arquivos: engine.world[_g_selecionado_pasta_world]
        }
    }
    return {
        resultado: false,
        codigo: "3-3",
        erro: "Current folder not found."
    }
}

window._engine_arquivo_world_adicionar_objeto = function (_objeto_nome) {
    if (!_g_selecionado_pasta_world) {
        return {
            resultado: false,
            codigo: "3-4",
            erro: "No folder selected."
        }
    }
    _l_objeto = _engine_arquivo_objeto_encontra_objeto(_objeto_nome)
    if (_l_objeto.resultado) {
        engine.world[_g_selecionado_pasta_world][_objeto_nome + _engine_pegar_id()] = _l_objeto.arquivos
        return {resultado: true}
    }
    return {
        resultado: false,
        codigo: "3-5",
        erro: _l_objeto.erro
    }
}

window._engine_arquivo_objeto_encontra_objeto = function (_nome) {
    for (let _key_pasta in engine.object) {
        for (let _key_objeto in engine.object[_key_pasta]) {
            if (_key_objeto == _nome) {
                return {
                    resultado: true,
                    pasta: _key_objeto,
                    arquivos: engine.object[_key_pasta][_nome]
                }
            }
        }
    }
    return {
        resultado: false,
        codigo: "2-4",
        erro: "This object does not exist."
    }
}

/*

 ██████  ██████  ███    ██ ████████ ██████   ██████  ███████     ████████ ███████ ██       █████  ███████ 
██      ██    ██ ████   ██    ██    ██   ██ ██    ██ ██             ██    ██      ██      ██   ██ ██      
██      ██    ██ ██ ██  ██    ██    ██████  ██    ██ █████          ██    █████   ██      ███████ ███████ 
██      ██    ██ ██  ██ ██    ██    ██   ██ ██    ██ ██             ██    ██      ██      ██   ██      ██ 
 ██████  ██████  ██   ████    ██    ██   ██  ██████  ███████        ██    ███████ ███████ ██   ██ ███████ 
                                                                                                          
*/

window._engine_tela_inicial = function () {
    document.getElementById("screen").innerHTML = `
        <div style="background-color: #191A24; display: flex; flex-direction: column; position: absolute; left: 0px; top: 0px; height: 100vh;">
            <img style="width: 55px;" src="img/logo.png" onclick="_voltar_parar_engine()">
            <img style="width: 55px;" src="img/createFile.png" onclick="_abrir_tela_criar_projeto()">
            <img style="width: 55px;" src="img/importFile.png" onclick="importFile()">
        </div>
        <div style="position: absolute; left: 50px; top: 0px; width: 250px; height: 100vh; overflow-y: auto;" id="projetos">
        </div>
        <div style="background-color: #191A24; position: absolute; left: 305px; top: 0px; width: calc(100vw - 305px); height: 100vh;" id="anuc">
            <iframe style="width: 100%; height: 100%; border: none;" src="" id="iframeDoc"></iframe>
            <button id="btnDoc" style="display: none; position: absolute; top: 10px; left: 10px; width: 30px; height: 30px; border-radius: 50%;" onclick="loadIframe()">&lt;</button>
        </div>
        <div style="background-color: #191A24; position: absolute; display: none; flex-direction: column; left: 305px; top: 0px; width: calc(100vw - 305px); height: 100vh;" id="tela-de-criar">
            <div style="height: calc(100vh - 30px);">
                <input style="background-color: #21212b; border: none; padding: 10px; width: calc(100% - 40px); margin-left: 10px; margin-top: 10px; outline: none;" type="text" placeholder="Name" id="inp-nome">
                <select style="background-color: #21212b; border: none; padding: 10px; width: calc(100% - 20px); margin-left: 10px; margin-top: 10px; outline: none;" id="world">
                    <option value="empty">Empty</option>
                </select>
            </div>
            <button style="background-color: #21212b; width: calc(100% - 20px); padding: 10px; margin-left: 10px; margin-bottom: 10px;" onclick="_criar_projeto()">Create</button>
        </div>
    `
}

window._engine_tela_engine = function () {
    document.getElementById("screen").innerHTML = `
        <div class="left">
            <button class="btn_inc" style="padding: 0px;" onclick="_voltar_parar_menu()"><img style="width: 55px; border-radius: 5px;" src="img/logo.png"></button>
            <button style="background-color: #191A24; color: #EEEEEE; border: none;" onclick="_abrir_editor_world()"><img style="width: 45px;" src="img/worldEdit.png"></button>
            <button style="background-color: #191A24; color: #EEEEEE; border: none;" onclick="_abrir_editor_objeto()"><img style="width: 45px;" src="img/object.png"></button>
            <button class="btn_inc" onclick="screen.world()"><img style="width: 45px; border-radius: 5px;" src="img/world.png"></button>
            <button class="btn_inc" onclick="screen.play()"><img style="width: 45px; border-radius: 5px;" src="img/start.png"></button>
        </div>
        <div class="screen" style="display: none;" id="screen-script">
            <div id="editor" style="width: 100%; height: 100%;"></div>
        </div>
        <div class="screen" style="display: block;" id="screen-world">
            <div style="display: flex; flex-direction: row; width: 100%; height: 100%;">
                <div style="width: calc(100% - 345px); height: 100vh; border: block;" id="container">
                </div>
                <div style="background-color: #191A24; display: flex; flex-direction: column; height: 100vh;" id="worldSelec">
                    <button class="engineBtn" onclick="transform('t')"><img style="width: 45px;" src="img/t.png"></button>
                    <button class="engineBtn" onclick="transform('s')"><img style="width: 45px;" src="img/s.png"></button>
                    <button class="engineBtn" onclick="transform('r')"><img style="width: 45px;" src="img/r.png"></button>
                    <button style="border: none;" onclick="copiarObject()"><img style="width: 45px;" src="img/copiar.png"></button>
                </div>
                <div style="background-color: #21212b; width: 300px; height: 100%; overflow-y: auto;" id="arquivos">
                </div>
            </div>
        </div>
    `
}

