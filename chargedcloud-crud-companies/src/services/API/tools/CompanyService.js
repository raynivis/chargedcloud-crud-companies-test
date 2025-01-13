//Auxiliar a comunicação entre o back-end (API) e front-end
export default class CompanyService {
  constructor() {
    this.API = "http://localhost:4200/companies"; // URL base da API
  }

  //Metodo para listar todas as empresas
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

  //Metodo para buscar uma empresa pelo CNPJ
  getByCNPJ(cnpj) {
    // Codifica o CNPJ antes de enviá-lo na URL
    const encodedCNPJ = encodeURIComponent(cnpj);
    return fetch(`${this.API}/${encodedCNPJ}`)
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


  //Metodo para adicionar uma nova empresa
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

  //Metodo para atualizar uma empresa pelo CNPJ
  update(cnpj, updates) {
    const encodedCNPJ = encodeURIComponent(cnpj);
    return fetch(`${this.API}/${encodedCNPJ}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
      .then((res) => {
        if (!res.ok) {
        }
        return res.json();
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }


  //Metodo para deletar uma empresa pelo CNPJ
  delete(cnpj) {
    const encodedCNPJ = encodeURIComponent(cnpj);
    return fetch(`${this.API}/${encodedCNPJ}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) {
        }
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }

}

