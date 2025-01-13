//Usando Express, Body-parser e Cors para fazer a REST-API
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const DATABASE_FILE = "db.json";

app.use(bodyParser.json());
app.use(cors());

// Função para carregar os dados do arquivo JSON
const loadDatabase = () => {
    if (fs.existsSync(DATABASE_FILE)) {
        const data = fs.readFileSync(DATABASE_FILE, "utf-8");
        return JSON.parse(data);
    }
    return [];
};

// Função para salvar os dados no arquivo JSON
const saveDatabase = (data) => {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 2), "utf-8");
};

let companies = loadDatabase();

// Endpoints da API
// Listagem de empresa/s
app.get("/companies", (req, res) => {
    res.json({
        total: companies.length,
        companies: companies,
    });
});

// Buscar empresa pelo CNPJ
app.get("/companies/:cnpj", (req, res) => {
    const { cnpj } = req.params;
    // Remove caracteres especiais (como ".", "/", "-") do CNPJ da URL
    const normalizedCNPJ = decodeURIComponent(cnpj).replace(/[^\d]/g, "");

    // Busca com o CNPJ também normalizado
    const company = companies.find((c) => c.cnpj.replace(/[^\d]/g, "") === normalizedCNPJ);

    if (company) {
        res.json(company);
    } else {
        res.status(404).send("Company not found");
    }
});


// Adicionar uma empresa 
app.post("/companies", (req, res) => {
    const company = req.body;
    companies.push(company);
    saveDatabase(companies);
    res.status(201).json(company);
});

// Editar uma empresa
app.put("/companies/:cnpj", (req, res) => {
    const { cnpj } = req.params;
    // Remove caracteres especiais (como ".", "/", "-") do CNPJ da URL
    const normalizedCNPJ = decodeURIComponent(cnpj).replace(/[^\d]/g, "");

    const index = companies.findIndex((c) => c.cnpj.replace(/[^\d]/g, "") === normalizedCNPJ);

    if (index !== -1) {
        companies[index] = { ...companies[index], ...req.body };
        saveDatabase(companies);
        res.json(companies[index]);
    } else {
        res.status(404).send("Company not found");
    }
});


// Excluir uma empresa
app.delete("/companies/:cnpj", (req, res) => {
    const { cnpj } = req.params;
        // Remove caracteres especiais (como ".", "/", "-") do CNPJ da URL
    const normalizedCNPJ = decodeURIComponent(cnpj).replace(/[^\d]/g, "");

    const filteredCompanies = companies.filter((c) => c.cnpj.replace(/[^\d]/g, "") !== normalizedCNPJ);
    if (filteredCompanies.length !== companies.length) {
        companies = filteredCompanies;
        saveDatabase(companies);
        res.status(204).send();
    } else {
        res.status(404).send("Company not found");
    }
});


// Iniciar o servidor
app.listen(4200, () => console.log("API running on http://localhost:4200"));
