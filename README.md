# Project: Charged Cloud Companies  

Projeto desenvolvido como parte de uma avaliação técnica, com o objetivo de gerenciar um **CRUD de empresas** com **sincronização offline/online**.  

O sistema utiliza **React.js** para a interface e uma **API REST** para o backend.  

## 🎥 Demonstração  
![gif charged](https://github.com/user-attachments/assets/c02ca2aa-282c-4529-af90-879ae10d68e6)

---

## 🛠️ Tecnologias/Dependências Utilizadas  

### Interface com React (Frontend):  
- **Bootstrap**  
- **React-Router**  
- **React-Tooltip**  

### API REST (Backend):  
- **Express**  
- **Body-parser**  
- **Cors**  

### Persistência Local:  
- **IndexedDB**  

---

## 🚀 Como Executar  

### Instalação e Início do Frontend  
1. Navegue até o diretório raiz do projeto React.  
2. Execute os seguintes comandos:  
   ```bash
   npm install  # (apenas na primeira execução, para instalar as dependências)
   npm start    # (para iniciar o sistema)
   ```  

### Inicialização da API  
1. Navegue até o diretório da API:  
   ```
   chargedcloud-crud-companies/src/services/API/
   ```  
2. Inicie a API com o comando:  
   ```bash
   node API.js
   ```  

---

## 📋 Requisitos do Sistema  

- **CRUD de Empresas**: Criar, ler, atualizar e excluir empresas.  
- **Campos Obrigatórios**: Nome da empresa, CNPJ (com máscara de entrada e validação), endereço e telefone.  
- **Persistência Local**: Funcionalidade offline usando IndexedDB.  
- **API REST**: Endpoints CRUD para gerenciar empresas.  
- **Sincronização Offline/Online**: Sincronizar dados automaticamente quando a API estiver online.  

---

## ⚠️ Limitações Conhecidas  

- **Conflito de Dados**:  
  Durante a sincronização, se duas empresas com o mesmo CNPJ forem encontradas, as ações de **Delete** e **Update** serão compartilhadas entre elas.  

---

## 📂 Organização do Projeto  

Para mais informações, consulte o [documento de organização do projeto](https://docs.google.com/document/d/1bo7GNbuOLu7GoyCclitaMLCxOi_G8q_5uoqObdnnXms/edit?usp=sharing).  

---

## 🔗 Referências e Templates Utilizados  

- **Estética e referência de software WEB**: [Charged Cloud](https://chargedcloud.com.br/)  
- **Desenho da Engrenagem**: [PNGWing](https://www.pngwing.com/pt/free-png-vinng)  
- **Table Template**: [Tutorial Republic](https://www.tutorialrepublic.com/snippets/preview.php?topic=bootstrap&file=data-table-with-search-box)  
- **Footer Template**: [CodePen](https://codepen.io/scanfcode/pen/MEZPNd)  
- **Form Template**: [CodePen](https://codepen.io/juff03/pen/OXaXRG)  
- **Algoritmo e lógica do CNPJ**: [Gerador de CNPJ](https://www.geradorcnpj.com/javascript-validar-cnpj.htm)  
- **Uso de Máscara para CNPJ**: [DBins Blog](https://blog.dbins.com.br/mascaras-para-campos-de-formularios-com-javascript)  

---
