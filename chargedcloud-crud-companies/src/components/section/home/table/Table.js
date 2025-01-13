import './Table.css';
import React from 'react';
import { Tooltip } from "react-tooltip";
import SyncData from '../../../../services/SyncData';
import ViewModal from '../../../modals/ViewModal';
import EditModal from '../../../modals/EditModal';
import DeleteModal from '../../../modals/DeleteModal';

class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            loading: true,
            selectedCompany: null, // Estado para a empresa selecionada para visualização ou edição
            isModalVisible: false, // Estado para controlar a visibilidade do modal de visualização
            isEditModalVisible: false, // Estado para controlar a visibilidade do modal de edição
            isDeleteModalVisible: false, // Estado para controlar a visibilidade do modal de exclusão
            companyToDelete: null, // Empresa que será deletada
        };
        this.loadData = this.loadData.bind(this); // Vinculando o contexto da função
    }

    async componentDidMount() {
        this.loadData();
    }

    // Método para carregar os dados
    loadData = async () => {
        this.setState({ loading: true });
        try {
            const companies = await SyncData.fetchCompanies();
            this.setState({ companies, loading: false });
        } catch (error) {
            console.error("Error loading companies:", error);
            this.setState({ loading: false });
        }
    };

    // Função para mostrar o modal de visualização
    showModal = (company) => {
        this.setState({ selectedCompany: company, isModalVisible: true });
    };

    // Função para fechar o modal de visualização
    closeModal = () => {
        this.setState({ isModalVisible: false });
    };

    // Função para mostrar o modal de edição
    showEditModal = (company) => {
        this.setState({ selectedCompany: company, isEditModalVisible: true });
    };

    // Função para fechar o modal de edição
    closeEditModal = () => {
        this.setState({ isEditModalVisible: false });
    };

    // Função para mostrar o modal de exclusão
    showDeleteModal = (company) => {
        this.setState({ companyToDelete: company, isDeleteModalVisible: true });
    };

    // Função para fechar o modal de exclusão
    closeDeleteModal = () => {
        this.setState({ isDeleteModalVisible: false, companyToDelete: null });
    };

    render() {
        const {
            companies,
            loading,
            selectedCompany,
            isModalVisible,
            isEditModalVisible,
            isDeleteModalVisible,
            companyToDelete
        } = this.state;

        return (
            <div className="table-wrapper">
                <div className="table-title">
                    <div className="row">
                        <div className="col-sm-8">
                            <h6>Registered <b>Companies</b></h6>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div>Loading data...</div>
                ) : companies.length === 0 ? (
                    <div className="shadow-sm p-3 mb-2 bg-white rounded text-center">
                        No records available :(
                    </div>
                ) : (
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>CNPJ</th>
                                <th>Name</th>
                                <th>Subscription Plan</th>
                                <th>Phone</th>
                                <th>E-mail</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((company, index) => (
                                <tr key={index}>
                                    <td>{company.cnpj || 'N/A'}</td>
                                    <td>{company.name || 'N/A'}</td>
                                    <td>{company.plan || 'N/A'}</td>
                                    <td>{company.phone || 'N/A'}</td>
                                    <td>{company.email || 'N/A'}</td>
                                    <td>
                                        <a
                                            data-tooltip-id="view-tooltip"
                                            data-tooltip-content="View"
                                            onClick={() => this.showModal(company)}
                                        >
                                            <i className="material-icons">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#38AFF1"><path d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
                                                </svg>
                                            </i>
                                        </a>
                                        <Tooltip id="view-tooltip" />

                                        <a
                                            data-tooltip-id="edit-tooltip"
                                            data-tooltip-content="Edit"
                                            onClick={() => this.showEditModal(company)}
                                        >
                                            <i className="material-icons">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFC107"><path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                                                </svg>
                                            </i>
                                        </a>
                                        <Tooltip id="edit-tooltip" />

                                        <a
                                            data-tooltip-id="delete-tooltip"
                                            data-tooltip-content="Delete"
                                            onClick={() => this.showDeleteModal(company)}
                                        >
                                            <i className="material-icons">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#E34724"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                                                </svg>
                                            </i>
                                        </a>
                                        <Tooltip id="delete-tooltip" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Exibindo o modal de visualização */}
                {isModalVisible && selectedCompany && (
                    <ViewModal company={selectedCompany} onClose={this.closeModal} />
                )}

                {/* Exibindo o modal de edição */}
                {isEditModalVisible && selectedCompany && (
                    <EditModal
                        company={selectedCompany}
                        onClose={this.closeEditModal}
                        reloadData={this.loadData} // Atualiza a lista após edição
                    />
                )}

                {/* Exibindo o modal de exclusão */}
                {isDeleteModalVisible && companyToDelete && (
                    <DeleteModal
                        company={companyToDelete}
                        onClose={this.closeDeleteModal}
                        reloadData={this.loadData} // Passando reloadData como prop
                    />
                )}
            </div>
        );
    }
}

export default Table;
