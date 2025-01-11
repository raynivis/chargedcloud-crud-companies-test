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

//Função genérica para tratar os erros de request!
db.onerror = function (event) {
    alert("Database Offline error: " + event.target.errorCode);
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

//
function getCompany(company, callback){
  const transaction = db.transaction(["companies"], "readonly");
  const store = transaction.objectStore("companies");
  const request = store.get(cnpj);

}

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
        // No more results
        callback(results);
      }
    };
  
    cursorRequest.onerror = () => {
      console.error("Error opening cursor for pagination.");
    };
}
  


