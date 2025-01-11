//Auxiliar a comunicação entre o back-end e front-end
export default class CompanyService{
    constructor() {
      this.API = "http://localhost:4200/companies"; // URL base API
    }
  
    // Método para listar todas as empresas
    list() {
      return fetch(this.API)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch companies.");
          }
          return res.json();
        })
        .then((data) => data.companies)
        .catch((err) => {
          console.error(err);
          throw err;
        });
    }
  
    // Método para buscar uma empresa pelo CNPJ
    getByCNPJ(cnpj) {
      return fetch(`${this.API}/${cnpj}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Company not found.");
          }
          return res.json();
        })
        .catch((err) => {
          console.error(err);
          throw err;
        });
    }
  
    // Método para adicionar uma nova empresa
    create(company) {
      return fetch(this.API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to create company.");
          }
          return res.json();
        })
        .catch((err) => {
          console.error(err);
          throw err;
        });
    }
  
    // Método para atualizar uma empresa pelo CNPJ
    update(cnpj, updates) {
      return fetch(`${this.API}/${cnpj}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to update company.");
          }
          return res.json();
        })
        .catch((err) => {
          console.error(err);
          throw err;
        });
    }
  
    // Método para deletar uma empresa pelo CNPJ
    delete(cnpj) {
      return fetch(`${this.API}/${cnpj}`, { method: "DELETE" })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete company.");
          }
        })
        .catch((err) => {
          console.error(err);
          throw err;
        });
    }
  }
  
