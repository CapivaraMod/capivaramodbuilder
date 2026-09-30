// Sprite que esta EXECUTANDO o bloco.
// Dentro de um bloco de extensao o TurboWarp entrega `util` (util.target = ator dono da thread).
// `util` e repassado entre blocos personalizados, broadcasts e hats (clique / clone).
// Fora disso (hats globais) cai para o ator selecionado no editor.
export const UTIL = `(typeof util !== 'undefined' ? util : undefined)`;

export const TARGET = `((typeof util !== 'undefined' && util && util.target) || Scratch.vm.runtime.getEditingTarget() || Scratch.vm.runtime.targets.find(t => !t.isStage))`;

export default TARGET;
