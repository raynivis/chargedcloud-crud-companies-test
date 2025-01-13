//Componente formulario
import "./Form.css";
import React from 'react';
import CheckCNPJ from "../tools/CheckCNPJ";
import ToastDanger from "../../../toasts/ToastDanger";
import ToastSuccess from "../../../toasts/ToastSuccess";
import { Toast } from "bootstrap";
import OfflineDB from "../../../../services/OfflineDB";
import CompanyService from "../../../../services/API/tools/CompanyService";
import SyncData from "../../../../services/SyncData";

//Os codigos de formulario ficaram muito grandes e eu nao consegui modularizar
class Form extends React.Component {

    constructor(props) {
        super(props);
        this.handleCNPJKeyUp = this.handleCNPJKeyUp.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Evento de aplicacao da mascara
    handleCNPJKeyUp(event) {
        CheckCNPJ.mascaraCNPJ(event);
    }

    //Envio dos dados
    async handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const btn = document.getElementById("btnSubmit");
        btn.disabled = true; // Desativar o botão

        const cnpjInput = document.getElementById("CNPJInput");
        const cnpjValue = cnpjInput.value;

        //Verificar a validade do CNPJ para o insert
        if (!CheckCNPJ.validarCNPJ(cnpjValue)) {
            this.showToast("CnpjFormatError");
            cnpjInput.focus();
            btn.disabled = false; // Reativar o botão
            window.scrollTo({ top: 0, behavior: "smooth" }); // Levar a página ao topo
            return;
        }

        const company = {
            name: form.elements["name"].value,
            cnpj: cnpjValue,
            plan: form.elements["plan"].value,
            phone: form.elements["phone"].value,
            email: form.elements["email"].value,
            address: form.elements["address"].value,
        };

        try {
            const apiAvailable = await SyncData.checkApiAvailability();
            //Se a API estiver disponivel, a adicao é na API, se nao a adicao é no IndexedDB
            if (apiAvailable) {
                await this.handleAPISubmission(company);
            } else {
                this.handleIndexedDBSubmission(company);
            }
            form.reset(); // Limpar o formulário
            window.scrollTo({ top: 0, behavior: "smooth" }); // Levar a página ao topo
        } catch (error) {
            console.error("Erro no envio do formulário:", error);
        } finally {
            btn.disabled = false; // Reativar o botão
        }
    }

    //Metodo para adicionar na API
    async handleAPISubmission(company) {
        const companyService = new CompanyService();
        try {
            const existingCompany = await companyService.getByCNPJ(company.cnpj);
            if (existingCompany) {
                this.showToast("ExistingCNPJ");
                return;
            }
        } catch (error) {
            if (error.message === "Company not found.") {
                // Se o CNPJ não for encontrado, criar novo registro
                await companyService.create(company);
                this.showToast("InsertAPI");
            } else {
                throw error;
            }
        }
    }

    //Metodo para adicionar no IndexedDB
    async handleIndexedDBSubmission(company) {
        try {
            // Usando a função OfflineDB.getCompany para buscar pelo CNPJ
            const existingCompany = await OfflineDB.getCompany(company.cnpj);
            // Se o CNPJ já existe, exibe a mensagem de aviso
            if (existingCompany) {
                this.showToast("ExistingCNPJ");
                return;
            }
        } catch (error) {
            // Se a empresa não for encontrada (error = "Company not found"), adiciona
            if (error === "Company not found") {
                OfflineDB.addCompany(company);
                this.showToast("InsertIndexedDB");
            } else {
                console.error("Error accessing IndexedDB:", error);
                throw error;
            }
        }
    }

    //Mostrar o toast
    showToast(toastId) {
        const toastElement = document.getElementById(toastId);
        const toast = new Toast(toastElement);
        toast.show();
    }

    render() {
        return (
            <form className="form-horizontal" id="companyForm" onSubmit={this.handleSubmit}>
                <ToastDanger id="CnpjFormatError" mensagem="Invalid CNPJ! Please try typing it again!" />
                <ToastSuccess id="InsertAPI" mensagem="API Online: Company added to API!" />
                <ToastSuccess id="InsertIndexedDB" mensagem="API Offline: Company added to IndexedDB!" />
                <ToastDanger id="ExistingCNPJ" mensagem="The provided CNPJ already exists in our database!" />

                <fieldset className="d-flex row justify-content-center">
                    <legend className="mb-5 text-center">Company Info</legend>
                    {/*Campos do formulario da empresa*/}
                    <div className="container">
                        {/*Campo do nome da empresa*/}
                        <p className="m-1 text-left">Name of Company <i>*</i> </p>
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-building" viewBox="0 0 16 16">
                                    <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"></path>
                                    <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"></path>
                                </svg>
                            </span>
                            <input required type="text" className="form-control" name="name" placeholder="Corporation Name" aria-label="Corporation Name" aria-describedby="addon-wrapping" />
                        </div>

                        {/*Campo do CNPJ da empresa*/}
                        <p className="m-1 text-left">CNPJ <i>*</i> </p>
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-binary" viewBox="0 0 16 16">
                                    <path d="M7.05 11.885c0 1.415-.548 2.206-1.524 2.206C4.548 14.09 4 13.3 4 11.885c0-1.412.548-2.203 1.526-2.203.976 0 1.524.79 1.524 2.203m-1.524-1.612c-.542 0-.832.563-.832 1.612q0 .133.006.252l1.559-1.143c-.126-.474-.375-.72-.733-.72zm-.732 2.508c.126.472.372.718.732.718.54 0 .83-.563.83-1.614q0-.129-.006-.25zm6.061.624V14h-3v-.595h1.181V10.5h-.05l-1.136.747v-.688l1.19-.786h.69v3.633z"></path>
                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"></path>
                                </svg>
                            </span>
                            <input onKeyUp={this.handleCNPJKeyUp} maxLength="18" id="CNPJInput" required type="text" className="form-control" placeholder="00.000.000/0000-00" aria-label="CNPJ" aria-describedby="addon-wrapping" />
                        </div>

                        {/*Extra: Campo do plano solicitado pela empresa*/}
                        <p className="m-1 text-left">Subscription Plan</p>
                        <div className="input-group mb-3">
                            <label className="input-group-text" htmlFor="Plan">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-wallet2" viewBox="0 0 16 16">
                                    <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"></path>
                                </svg>
                            </label>
                            <select name="plan" className="form-select" id="inputGroupSelectPlan">
                                <option defaultValue value="Iniciante">Iniciante</option>
                                <option value="Intermediário">Intermediário</option>
                                <option value="Premium">Premium</option>
                            </select>
                        </div>

                        {/*Campo do telefone da empresa*/}
                        <p className="m-1 text-left">Phone <i>*</i> </p>
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-inbound" viewBox="0 0 16 16">
                                    <path d="M15.854.146a.5.5 0 0 1 0 .708L11.707 5H14.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 1 0v2.793L15.146.146a.5.5 0 0 1 .708 0m-12.2 1.182a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"></path>
                                </svg>
                            </span>
                            <input required type="tel" className="form-control" name="phone" placeholder="+55000000000" aria-label="phone" aria-describedby="addon-wrapping" />
                        </div>

                        {/*Extra: Campo do e-mail da empresa*/}
                        <p className="m-1 text-left">E-mail </p>
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-at" viewBox="0 0 16 16">
                                    <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"></path>
                                    <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z"></path>
                                </svg>
                            </span>
                            <input type="email" className="form-control" name="email" placeholder="company@domain.com" aria-label="email" aria-describedby="addon-wrapping" />
                        </div>

                        {/*Campo do endereço completo da empresa*/}
                        <p className="m-1 text-left">Address <i>*</i> </p>
                        <div className="input-group">
                            <span className="input-group-text">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"></path>
                                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path>
                                </svg>
                            </span>
                            <textarea required className="form-control" name="address" placeholder="Street, Number, Neighborhood, City/State" aria-label="address"></textarea>
                        </div>
                    </div>
                </fieldset>

                <button id="btnSubmit" className="btn btn-primary mt-3 ps-4 pe-4 btn-form" type="submit">Submit</button>
            </form>
        );


    }
}

export default Form;