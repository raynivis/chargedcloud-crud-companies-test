//Usando Express, Body-parser e Cors para fazer a REST-API
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(require("cors")());

let companies = [];

//CRUDs da REST API e seus Endpoints
//Listagem por paginacao
app.get("/companies", (req, res) => {
    const page = parseInt(req.query.page) || 1; // Página atual 
    const size = parseInt(req.query.size) || 5; // Tamanho por página 

    // Determina os limites para a paginação
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    const paginatedCompanies = companies.slice(startIndex, endIndex);
    res.json({
        page,
        size,
        total: companies.length,
        companies: paginatedCompanies,
    });
});

//Buscar empresa pelo CNPJ
app.get("/companies/:cnpj", (req, res) => {
  const { cnpj } = req.params;
  const company = companies.find((c) => c.cnpj == cnpj);

  if (company) {
    res.json(company);
  } else {
    res.status(404).send("Company not found");
  }
});

//Adicionar uma empresa ao DataBase
app.post("/companies", (req, res) => {
    const company = req.body;
    companies.push(company);
    res.status(201).json(company);
});

//Editar empresa
app.put("/companies/:cnpj", (req, res) => {
    const { cnpj } = req.params;
    const index = companies.findIndex((c) => c.cnpj == cnpj);
    //Verificar se encontrou
    if (index !== -1) {
        companies[index] = { ...companies[index], ...req.body };
        res.json(companies[index]);
    } else {
        res.status(404).send("Company not found");
    }
});

//Excluir empresa
app.delete("/companies/:cnpj", (req, res) => {
    const { cnpj } = req.params;
    companies = companies.filter((c) => c.cnpj != cnpj);
    res.status(204).send();
});

//Mensagem de abertura de servidor
app.listen(4200, () => console.log("API running on http://localhost:4200"));


