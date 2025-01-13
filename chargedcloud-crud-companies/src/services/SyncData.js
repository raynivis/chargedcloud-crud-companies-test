import OfflineDB from "./OfflineDB";
import CompanyService from "./API/tools/CompanyService";

const service = new CompanyService();

// Funcao para verificar a disponibilidade da API
async function checkApiAvailability() {
  try {
    const response = await fetch("http://localhost:4200/companies", {
      method: "GET",
    });
    if (response.ok) {
      return true;
    } else {
      console.warn(`API returned a non-OK status: ${response.status}`);
      return false;
    }
  } catch (error) {
    return false;
  }
}

// Funcao para verificar e concatenar os dados
async function fetchCompanies() {
  const apiAvailable = await checkApiAvailability();

  let companies = [];

  if (apiAvailable) {
    try {
      const apiCompanies = await service.list();
      companies = [...apiCompanies]; // Adiciona dados da API
    } catch (error) {
      console.error("Error fetching companies from API:", error);
    }
  } else {
    console.warn("Usando offline database!");
  }

  try {
    const localCompanies = await new Promise((resolve, reject) => {
      OfflineDB.getAllCompanies((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
    companies = [...companies, ...localCompanies]; // Concatena dados locais
  } catch (error) {
    console.error("Error fetching companies from IndexedDB:", error);
  }

  return companies;
}

export default { fetchCompanies, checkApiAvailability};
