//Vou usar IndexedDB!!
var db;
const request = indexedDB.open("ChargeCloudDB", 1);

function openDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }
        const request = indexedDB.open("ChargeCloudDB", 1);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains("companies")) {
                const objectStore = db.createObjectStore("companies", { keyPath: "cnpj" });
                objectStore.createIndex("name", "name", { unique: false });
                objectStore.createIndex("plan", "plan", { unique: false });
                objectStore.createIndex("phone", "phone", { unique: false });
                objectStore.createIndex("email", "email", { unique: false });
                objectStore.createIndex("address", "address", { unique: false });
            }
        };
        //Em caso de sucesso do Request
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

//Funcoes para ajudar a interação no software
// Adicionar Empresa
function addCompany(company) {
    openDB().then(() => {
        const transaction = db.transaction(["companies"], "readwrite");
        const store = transaction.objectStore("companies");
        store.add(company);
    });
}

//Buscar uma empresa e devolver ela pelo callback
function getCompany(cnpj, callback) {
    openDB().then(() => {
        const transaction = db.transaction(["companies"], "readonly");
        const store = transaction.objectStore("companies");
        const request = store.get(cnpj);

        request.onsuccess = () => {
            if (request.result) {
                callback(null, request.result); // Chama o callback com os dados encontrados
            } else {
                callback("Company not found", null); // Caso não encontre a empresa
            }
        };
    });
}

//Atualizar dados de uma empresa
function updateCompany(company) {
    openDB().then(() => {
        const transaction = db.transaction(["companies"], "readwrite");
        const store = transaction.objectStore("companies");
        const request = store.put(company);

        request.onerror = () => {
            alert("Failed to update company");
        };
    });
}

//Apagar Empresa
function deleteCompany(cnpj, callback) {
    openDB().then(() => {
        const transaction = db.transaction(["companies"], "readwrite");
        const store = transaction.objectStore("companies");
        const request = store.delete(cnpj);

        request.onerror = () => {
            alert("Failed to delete company");
        };
    });
}

//Lista de empresas
function getAllCompanies(callback) {
    openDB().then(() => {
        const transaction = db.transaction(["companies"], "readonly");
        const store = transaction.objectStore("companies");
        const cursorRequest = store.openCursor();
        const results = [];
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                callback(results);
            }
        };
        cursorRequest.onerror = () => {
            console.error("Error opening cursor for retrieving all companies.");
        };
    }).catch((error) => {
        console.error("Error opening database:", error);
    });
}

export default { getAllCompanies, deleteCompany, updateCompany, getCompany, addCompany };



