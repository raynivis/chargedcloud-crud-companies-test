import OfflineDB from "./OfflineDB";

// Função para verificar a disponibilidade da API
async function checkApiAvailability() {
  try {
    const response = await fetch("http://localhost:4200/companies?page=1&size=1", {
      method: "GET",
    });
    if (response.ok) {
      console.log("API is available.");
      return true;
    } else {
      console.warn(`API returned a non-OK status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("API is not reachable:", error);
    return false;
  }
}

// Função para buscar empresas, considerando o estado de conectividade
async function fetchCompanies(page = 1, pageSize = 5, callback) {
  
  const isApiAvailable = await checkApiAvailability(); // Verifica a disponibilidade da API

  if (isApiAvailable) {
    // Online: buscar dados do servidor
    console.log("Você está online.");
    fetch(`http://localhost:4200/companies?page=${page}&size=${pageSize}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        callback(data.companies || []); // Garante um array mesmo se `data.companies` estiver indefinido
      })
      .catch((err) => {
        console.error("Error fetching online data:", err);
      });
  } else {
    // Offline: buscar dados do IndexedDB
    console.warn("API não está disponível. Utilizando IndexedDB.");
    OfflineDB.getPaginatedCompanies(page, pageSize, (results) => {
      if (results && results.length > 0) {
        callback(results);
      } else {
        console.warn("Sem dados disponiveis no IndexedDB.");
        callback([]);
      }
    });
  }
}

export default { fetchCompanies };
