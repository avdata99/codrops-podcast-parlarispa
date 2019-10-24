const CACHE_KEY_EPISODES = "pc_data";

/** Devuelve la cantidad de milisegundos equivalentes a 24 horas. */
function setCacheTTL() {
    let hour = 1000*60*60;
    let day = hour*24;

    return day;
}

/**
 * Establece el tiempo de expiración para la data en storage.
 */
function setExpirationTime() {
    let curTTL = this.setCacheTTL();
    return new Date().getTime() + curTTL;
}

/**
 * Verifica si el TTL de la data en storage ha expirado.
 * @param data Datos obtenidos desde storage
 */
function isDataOutdated(data) {
    let dataExpTime = parseInt(data.ExpDate, 10);
    let curTime = new Date().getTime();

    if (curTime >= dataExpTime) return true;
    else return false;
}

/**
 * Almacena la lista de episodios en storage con un tiempo de expiración.
 */
function saveDataToStorage(curData) {
    var data = {
        Data: curData,
        ExpDate: setExpirationTime()
    };

    if (!getDataFromStorage()) localStorage.setItem(CACHE_KEY_EPISODES, JSON.stringify(data));
}

/**
 * Obtiene la lista de episodios desde storage.
 */
function getDataFromStorage() {
    let data = localStorage.getItem(CACHE_KEY_EPISODES);
    
    // No existen datos en storage.
    if (!data) return null;

    let parsedData = JSON.parse(data);

    // En caso que existan datos en storage, debemos verificar el tiempo de expiración.
    if (isDataOutdated(parsedData)) return null;

    // Si todo esta Ok, devolvemos la data completa.
    return parsedData.Data;
}