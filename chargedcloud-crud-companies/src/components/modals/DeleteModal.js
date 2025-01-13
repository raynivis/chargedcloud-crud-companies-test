import React from 'react';
import SyncData from '../../services/SyncData';
import CompanyService from '../../services/API/tools/CompanyService';
import OfflineDB from '../../services/OfflineDB';

class DeleteModal extends React.Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
        this.state = {
            isDeleting: false, // Estado para controlar o botão
        };
        
    }

    async DeleteCompany(cnpj) {
        const { onClose, reloadData } = this.props; // Recebendo a função de recarregar
        this.setState({ isDeleting: true });
        const apiAvailable = await SyncData.checkApiAvailability();

        //Desativar o botao pra evitar spam de deletes

        if (apiAvailable) {
            try {
                const companyService = new CompanyService(); // Instanciar a classe
                companyService.delete(cnpj); // Chamar o método de apagar
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (error) {
                console.error("Erro na API:", error);
            }
            try {
                OfflineDB.deleteCompany(cnpj);
            } catch (error) {
                console.error("Erro no IndexedDB:", error);
            }
        }
        else {
            OfflineDB.deleteCompany(cnpj);
        }
        
        this.setState({ isDeleting: false });
        reloadData(); // Recarregando o componente pai
        onClose(); // Fechando o modal
    }

    render() {
        const { company, onClose } = this.props;

        return (
            <div className="modal show" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title d-flex align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e74c3c"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                                </svg>
                                Delete Company Information
                            </h6>
                        </div>
                        <div className="modal-body">
                            <div className="container d-flex justify-content-center text-center">
                                Are you sure you want to delete the company with this CNPJ {company.cnpj}?
                            </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-end">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button id="btnDelete" type="button" className="btn btn-primary"
                                onClick={() => this.DeleteCompany(company.cnpj)}
                                disabled={this.state.isDeleting}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DeleteModal;
