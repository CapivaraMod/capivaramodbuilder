import { writable } from "svelte/store";

const translations = {
    en: {
        language: "Language",
        save: "Save",
        load: "Load",
        experiments: "Experiments",
        discord: "Discord",
        editor: "Editor",
        blocks: "Blocks",
        properties: "Properties",
        export: "Export",
        editBlock: "Edit Block",
        type: "Type",
        text: "Text",
        label: "Label",
        string: "String",
        number: "Number",
        boolean: "Boolean",
        defaultValue: "Default value",
        delete: "Delete",
        addField: "Add field",
        command: "Command",
        reporter: "Reporter",
        noBlocks: "no blocks yet!",
        createBlockConfirmation: "Are you sure you want to make a block?",
        deleteBlockConfirmation: "Are you sure you want to delete this block?",
        registerVariable: "Register Variable",
        variableName: "variable name",
        unknown: "Unknown",
        register: "Register",
        copy: "Copy",
        unsandboxed: "Make sure to run the extension unsandboxed.",
        id: "ID",
        color: "Color",
    },
    "pt-BR": {
        language: "Idioma",
        save: "Salvar",
        load: "Carregar",
        experiments: "Experimentos",
        discord: "Discord",
        editor: "Editor",
        blocks: "Blocos",
        properties: "Propriedades",
        export: "Exportar",
        editBlock: "Editar bloco",
        type: "Tipo",
        text: "Texto",
        label: "Rótulo",
        string: "Texto",
        number: "Número",
        boolean: "Booleano",
        defaultValue: "Valor padrão",
        delete: "Excluir",
        addField: "Adicionar campo",
        command: "Comando",
        reporter: "Repórter",
        noBlocks: "nenhum bloco ainda!",
        createBlockConfirmation: "Tem certeza de que deseja criar um bloco?",
        deleteBlockConfirmation: "Tem certeza de que deseja excluir este bloco?",
        registerVariable: "Registrar variável",
        variableName: "nome da variável",
        unknown: "Desconhecido",
        register: "Registrar",
        copy: "Copiar",
        unsandboxed: "Certifique-se de executar a extensão sem sandbox.",
        id: "ID",
        color: "Cor",
    },
    es: {
        language: "Idioma",
        save: "Guardar",
        load: "Cargar",
        experiments: "Experimentos",
        discord: "Discord",
        editor: "Editor",
        blocks: "Bloques",
        properties: "Propiedades",
        export: "Exportar",
        editBlock: "Editar bloque",
        type: "Tipo",
        text: "Texto",
        label: "Etiqueta",
        string: "Texto",
        number: "Número",
        boolean: "Booleano",
        defaultValue: "Valor predeterminado",
        delete: "Eliminar",
        addField: "Añadir campo",
        command: "Comando",
        reporter: "Reportero",
        noBlocks: "¡todavía no hay bloques!",
        createBlockConfirmation: "¿Seguro que quieres crear un bloque?",
        deleteBlockConfirmation: "¿Seguro que quieres eliminar este bloque?",
        registerVariable: "Registrar variable",
        variableName: "nombre de variable",
        unknown: "Desconocido",
        register: "Registrar",
        copy: "Copiar",
        unsandboxed: "Asegúrate de ejecutar la extensión sin sandbox.",
        id: "ID",
        color: "Color",
    },
};

export const supportedLanguages = [
    { id: "en", label: "English" },
    { id: "pt-BR", label: "Português (Brasil)" },
    { id: "es", label: "Español" },
];

function browserLanguage() {
    if (typeof navigator === "undefined") return "en";
    const preferred = navigator.language.toLowerCase();
    if (preferred.startsWith("pt")) return "pt-BR";
    if (preferred.startsWith("es")) return "es";
    return "en";
}

let currentLanguage = browserLanguage();
export const language = writable(currentLanguage);

export function setLanguage(value) {
    const next = translations[value] ? value : "en";
    currentLanguage = next;
    language.set(next);
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("language", next);
    }
}

export function getLanguage() {
    return currentLanguage;
}

export function loadSavedLanguage() {
    if (typeof localStorage === "undefined") return;
    setLanguage(localStorage.getItem("language") || browserLanguage());
}

export function t(key, currentLanguage = "en") {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

const blockWords = {
    "pt-BR": {
        move: "mova", steps: "passos", turn: "gire", left: "esquerda", right: "direita",
        degrees: "graus", go: "vá", to: "para", x: "x", y: "y", glide: "deslize",
        secs: "segundos", point: "aponte", towards: "em direção a", change: "mude",
        by: "por", set: "defina", position: "posição", direction: "direção",
        say: "diga", think: "pense", switch: "mude", costume: "fantasia",
        backdrop: "cenário", next: "próximo", size: "tamanho", effect: "efeito",
        show: "mostre", hide: "esconda", layer: "camada", when: "quando",
        extension: "extensão", loaded: "carregada", new: "nova", thread: "thread",
        broadcast: "transmita", and: "e", wait: "espere", until: "até",
        repeat: "repita", while: "enquanto", return: "retorne", true: "verdadeiro",
        false: "falso", random: "aleatório", pick: "escolha", log: "log",
        contains: "contém", item: "item", list: "lista", create: "crie",
        empty: "vazia", join: "junte", with: "com", delimiter: "delimitador",
        length: "comprimento", substring: "subtexto", replace: "substitua",
        in: "em", console: "console", error: "erro", parse: "analise",
        json: "json", fetch: "busque", method: "método", headers: "cabeçalhos",
        body: "corpo", current: "atual", username: "nome de usuário",
        mouse: "mouse", touching: "tocando", color: "cor", distance: "distância",
        ask: "pergunte", answer: "resposta", timer: "cronômetro",
        if: "se", then: "então", else: "senão", seconds: "segundos",
        next: "próximo", frame: "quadro", do: "faça", inline: "em linha",
        broadcasted: "transmitido", green: "verde", flag: "bandeira",
        clicked: "clicado", this: "este", sprite: "ator", switches: "muda",
        start: "início", clone: "clone", play: "toque", note: "nota",
        for: "por", beats: "batidas", stop: "pare", instrument: "instrumento",
        tempo: "tempo", volume: "volume", all: "todos", sounds: "sons",
        output: "saída", devices: "dispositivos", send: "envie", midi: "midi",
        off: "desligado", channel: "canal", received: "recebida",
        message: "mensagem", velocity: "velocidade", rotation: "rotação",
        style: "estilo", xor: "ou exclusivo", not: "não", eval: "avalie",
        try: "tente", catch: "capture", typeof: "tipo de", get: "obtenha",
        global: "global", split: "divida", times: "vezes", amount: "quantidade",
        of: "de", each: "cada", value: "valor", is: "é", key: "tecla",
        pressed: "pressionada", sprite: "ator", switches: "muda",
        invisible: "invisível", loudness: "volume", draggable: "arrastável",
        reset: "reinicie", days: "dias", since: "desde", project: "projeto",
        running: "executando", enabled: "ativado", rate: "taxa", before: "antes",
        tick: "ciclo", mode: "modo", set: "defina", use: "use",
        with: "com", delimiter: "delimitador", to: "para", string: "texto",
    },
    es: {
        move: "mueve", steps: "pasos", turn: "gira", left: "izquierda", right: "derecha",
        degrees: "grados", go: "ve", to: "a", x: "x", y: "y", glide: "desliza",
        secs: "segundos", point: "apunta", towards: "hacia", change: "cambia",
        by: "en", set: "fija", position: "posición", direction: "dirección",
        say: "di", think: "piensa", switch: "cambia", costume: "disfraz",
        backdrop: "fondo", next: "siguiente", size: "tamaño", effect: "efecto",
        show: "muestra", hide: "oculta", layer: "capa", when: "cuando",
        extension: "extensión", loaded: "cargada", new: "nuevo", thread: "hilo",
        broadcast: "envía", and: "y", wait: "espera", until: "hasta",
        repeat: "repite", while: "mientras", return: "devuelve", true: "verdadero",
        false: "falso", random: "aleatorio", pick: "elige", log: "registro",
        contains: "contiene", item: "elemento", list: "lista", create: "crea",
        empty: "vacía", join: "une", with: "con", delimiter: "delimitador",
        length: "longitud", substring: "subcadena", replace: "reemplaza",
        in: "en", console: "consola", error: "error", parse: "analiza",
        json: "json", fetch: "obtén", method: "método", headers: "encabezados",
        body: "cuerpo", current: "actual", username: "usuario",
        mouse: "ratón", touching: "tocando", color: "color", distance: "distancia",
        ask: "pregunta", answer: "respuesta", timer: "temporizador",
        if: "si", then: "entonces", else: "si no", seconds: "segundos",
        next: "siguiente", frame: "marco", do: "haz", inline: "en línea",
        broadcasted: "transmitido", green: "verde", flag: "bandera",
        clicked: "pulsado", this: "este", sprite: "objeto", switches: "cambia",
        start: "inicio", clone: "clon", play: "reproduce", note: "nota",
        for: "por", beats: "pulsos", stop: "detén", instrument: "instrumento",
        tempo: "tempo", volume: "volumen", all: "todos", sounds: "sonidos",
        output: "salida", devices: "dispositivos", send: "envía", midi: "midi",
        off: "apagado", channel: "canal", received: "recibido",
        message: "mensaje", velocity: "velocidad", rotation: "rotación",
        style: "estilo", xor: "o exclusivo", not: "no", eval: "evalúa",
        try: "intenta", catch: "captura", typeof: "tipo de", get: "obtén",
        global: "global", split: "divide", times: "veces", amount: "cantidad",
        of: "de", each: "cada", value: "valor", is: "está", key: "tecla",
        pressed: "pulsada", invisible: "invisible", loudness: "volumen",
        draggable: "arrastrable", reset: "reinicia", days: "días",
        since: "desde", project: "proyecto", running: "ejecutándose",
        enabled: "activado", rate: "tasa", before: "antes", tick: "ciclo",
        mode: "modo", use: "usa", string: "texto",
    },
};

export function translateBlockText(text, currentLanguage) {
    if (currentLanguage === "en" || typeof text !== "string") return text;
    return text.replace(/[A-Za-z]+/g, word => {
        const translated = blockWords[currentLanguage]?.[word.toLowerCase()];
        return translated || word;
    });
}

export function translateBlockJson(jsonData, currentLanguage = "en") {
    const localized = { ...jsonData };
    for (let index = 0; localized[`message${index}`]; index++) {
        localized[`message${index}`] = translateBlockText(
            localized[`message${index}`],
            currentLanguage,
        );
    }
    return localized;
}

export function translateToolbox(xml, currentLanguage = "en") {
    const categories = {
        "pt-BR": {
            Motion: "Movimento", Looks: "Aparência", Events: "Eventos",
            Control: "Controle", Math: "Matemática", Strings: "Textos",
            Vectors: "Vetores", Sensors: "Sensores", Variables: "Variáveis",
            Lists: "Listas", Blocks: "Blocos", Runtime: "Execução",
            Script: "Script", Music: "Música",
            Generic: "Genérico", Lambdas: "Lambdas", Sprites: "Sprites",
            Sound: "Som", Clones: "Clones", Targets: "Alvos", Browser: "Navegador",
        },
        es: {
            Motion: "Movimiento", Looks: "Apariencia", Events: "Eventos",
            Control: "Control", Math: "Matemáticas", Strings: "Textos",
            Vectors: "Vectores", Sensors: "Sensores", Variables: "Variables",
            Lists: "Listas", Blocks: "Bloques", Runtime: "Ejecución",
            Script: "Script", Music: "Música",
            Generic: "Genérico", Lambdas: "Lambdas", Sprites: "Sprites",
            Sound: "Sonido", Clones: "Clones", Targets: "Objetivos", Browser: "Navegador",
        },
    }[currentLanguage] || {};

    return xml.replace(/(<category\b[^>]*\bname=")([^"]+)(")/g, (match, start, name, end) => {
        return `${start}${categories[name] || name}${end}`;
    });
}
