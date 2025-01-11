//Vou usar IndexedDB!!
var db;
const request = indexedDB.open("ChargeCloudDB", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    //Verificando a existencia do object
    if (!db.objectStoreNames.contains("companies")) {
        //chave e atributos
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
};

//Funcoes para ajudar a interação no software
// Adicionar Empresa
function addCompany(company) {
    const transaction = db.transaction(["companies"], "readwrite");
    const store = transaction.objectStore("companies");
    store.add(company);
}

//Buscar uma empresa e devolver ela pelo callback
function getCompany(cnpj, callback) {
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
}

//Atualizar dados de uma empresa
function updateCompany(company) {
    const transaction = db.transaction(["companies"], "readwrite");
    const store = transaction.objectStore("companies");
    const request = store.put(company);

    request.onerror = () => {
        alert("Failed to update company");
    };
}

//Apagar Empresa
function deleteCompany(cnpj, callback) {
    const transaction = db.transaction(["companies"], "readwrite");
    const store = transaction.objectStore("companies");
    const request = store.delete(cnpj);
  
    request.onerror = () => {
        alert("Failed to delete company");
    };
  }
  
//Paginacao da lista de empresas
function getPaginatedCompanies(page, pageSize, callback) {
    const transaction = db.transaction(["companies"], "readonly");
    const store = transaction.objectStore("companies");
    const cursorRequest = store.openCursor();

    const results = [];
    let currentIndex = 0;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            if (currentIndex >= start && currentIndex < end) {
                results.push(cursor.value);
            }
            currentIndex++;

            if (currentIndex < end) {
                cursor.continue();
            } else {
                callback(results);
            }
        } else {
            // Sem mais resultados
            callback(results);
        }
    };

    cursorRequest.onerror = () => {
        console.error("Error opening cursor for pagination.");
    };
}

export default {getPaginatedCompanies, deleteCompany, updateCompany, getCompany, addCompany};



