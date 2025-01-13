import React from 'react';
import SyncData from '../../services/SyncData';
import CompanyService from '../../services/API/tools/CompanyService';
import OfflineDB from '../../services/OfflineDB';

//Os codigos de formulario ficaram muito grandes e eu nao consegui modularizar
class EditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false, 
            company: { ...props.company },
        };

        this.modalRef = React.createRef();
    }

    handleClose = () => {
        if (this.modalRef.current) {
            this.modalRef.current.style.display = 'none';
        }
        const { onClose } = this.props;
        onClose(); // Garantindo que a função de fechar passada por props seja chamada
    };

    // Manipulador genérico para atualização de campo
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            company: {
                ...prevState.company,
                [name]: value,
            },
        }));
    };

    handleSubmit = async (event, cnpj) => {
        event.preventDefault(); // Prevenir o comportamento padrão do formulário
    
        this.setState({ isSubmitting: true });
    
        // Obter os dados atualizados do formulário
        const formData = new FormData(event.target);
        const updatedCompany = {
            name: formData.get("name"),
            cnpj: cnpj, // Usando o cnpj passado como argumento
            plan: formData.get("plan"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            address: formData.get("address"),
        };
    
        try {
            const apiAvailable = await SyncData.checkApiAvailability();
    
            if (apiAvailable) {
                const companyService = new CompanyService();
                await companyService.update(cnpj, updatedCompany); // Atualizar na API
                await OfflineDB.updateCompany(updatedCompany); // Atualizar no IndexedDB
            } else {
                await OfflineDB.updateCompany(updatedCompany); // Atualizar no IndexedDB
            }
        } catch (error) {
            console.error("Erro ao atualizar a empresa:", error);
        } finally {
            this.setState({ isSubmitting: false });
            const { reloadData, onClose } = this.props;
            reloadData(); // Recarregar os dados do componente pai
            onClose(); // Fechar o modal
        }
    };
    

    render() {
        const { onClose } = this.props;
        const { isSubmitting, company } = this.state;

        return (
            <div className="modal show" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title d-flex align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#d4ac0d"><path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                                </svg>
                                Edit Company Information
                            </h6>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                            <form className="form-horizontal" id="companyForm" onSubmit={(event) => this.handleSubmit(event, company.cnpj)}>
                                    <fieldset className="d-flex row justify-content-center">
                                        {/*Campos do formulario da empresa*/}
                                        <div className="container">
                                            {/*Campo do nome da empresa*/}
                                            <p className="m-1 text-left">Name of Company </p>
                                            <div className="input-group flex-nowrap">
                                                <span className="input-group-text" id="addon-wrapping">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-building" viewBox="0 0 16 16">
                                                        <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"></path>
                                                        <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z"></path>
                                                    </svg>
                                                </span>
                                                <input
                                                    value={company.name}
                                                    required
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    placeholder="Corporation Name"
                                                    aria-label="Corporation Name"
                                                    aria-describedby="addon-wrapping"
                                                    onChange={this.handleInputChange}
                                                />
                                            </div>

                                            {/*Campo do plano solicitado pela empresa*/}
                                            <p className="m-1 text-left">Subscription Plan</p>
                                            <div className="input-group mb-3">
                                                <label className="input-group-text" htmlFor="Plan">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-wallet2" viewBox="0 0 16 16">
                                                        <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"></path>
                                                    </svg>
                                                </label>
                                                <select value={company.plan} name="plan" className="form-select" id="inputGroupSelectPlan" onChange={this.handleInputChange}>
                                                    <option value="Iniciante">Iniciante</option>
                                                    <option value="Intermediário">Intermediário</option>
                                                    <option value="Premium">Premium</option>
                                                </select>
                                            </div>

                                            {/*Campo do telefone da empresa*/}
                                            <p className="m-1 text-left">Phone  </p>
                                            <div className="input-group flex-nowrap">
                                                <span className="input-group-text" id="addon-wrapping">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-inbound" viewBox="0 0 16 16">
                                                        <path d="M15.854.146a.5.5 0 0 1 0 .708L11.707 5H14.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 1 0v2.793L15.146.146a.5.5 0 0 1 .708 0m-12.2 1.182a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"></path>
                                                    </svg>
                                                </span>
                                                <input
                                                    value={company.phone}
                                                    required
                                                    type="tel"
                                                    className="form-control"
                                                    name="phone"
                                                    placeholder="+55000000000"
                                                    aria-label="phone"
                                                    aria-describedby="addon-wrapping"
                                                    onChange={this.handleInputChange}
                                                />
                                            </div>

                                            {/*Campo do e-mail da empresa*/}
                                            <p className="m-1 text-left">E-mail </p>
                                            <div className="input-group flex-nowrap">
                                                <span className="input-group-text" id="addon-wrapping">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-at" viewBox="0 0 16 16">
                                                        <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"></path>
                                                        <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z"></path>
                                                    </svg>
                                                </span>
                                                <input
                                                    value={company.email}
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    placeholder="company@domain.com"
                                                    aria-label="email"
                                                    aria-describedby="addon-wrapping"
                                                    onChange={this.handleInputChange}
                                                />
                                            </div>

                                            {/*Campo do endereço completo da empresa*/}
                                            <p className="m-1 text-left">Address </p>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                                                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"></path>
                                                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path>
                                                    </svg>
                                                </span>
                                                <textarea
                                                    value={company.address}
                                                    required
                                                    className="form-control"
                                                    name="address"
                                                    placeholder="Street, Number, Neighborhood, City/State"
                                                    aria-label="address"
                                                    onChange={this.handleInputChange}>
                                                </textarea>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <button
                                        id="btnSubmit"
                                        className="btn btn-primary mt-3 ps-4 pe-4  btn-form"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Save
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditModal;
