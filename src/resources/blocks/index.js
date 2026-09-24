import registerGeneric from "./generic";
import registerEvents from "./events";
import registerMotion from "./motion";
import registerLooks from "./looks";
import registerControl from "./control";
import registerMath from "./math";
import registerStrings from "./strings";
import registerVectors from "./vectors";
import registerInputs from "./inputs";
import registerVariables from "./variables";
import registerLists from "./lists";
import registerBlocks from "./blocks";

import registerRuntime from "./runtime";
import registerScript from "./script";
import registerMusic from "./music";
import registerImage from "./image"

export default (language = "en") => {
    registerGeneric(language);
    registerMotion(language);
    registerLooks(language);
    registerEvents(language);
    registerControl(language);
    registerMath(language);
    registerStrings(language);
    registerVectors(language);
    registerInputs(language);
    registerVariables(language);
    registerLists(language);
    registerBlocks(language);

    registerRuntime(language);
    registerScript(language);
    registerMusic(language);
    registerImage(language)
}