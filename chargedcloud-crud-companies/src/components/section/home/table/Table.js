import './Table.css';
import React from 'react';
import SyncData from '../../../../services/SyncData';
import TableHeader from './tools/TableHeader';
import TableBody from './tools/TableBody';
import ViewModal from '../../../modals/ViewModal';
import EditModal from '../../../modals/EditModal';
import DeleteModal from '../../../modals/DeleteModal';

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            loading: true,
            selectedCompany: null,
            isModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            companyToDelete: null,
        };
    }

    //Carregar os dados depois de montar o componente
    async componentDidMount() {
        this.loadData();
    }

    //Metodo para carregar os dados (usado varias vezes na Tabela)
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

    //Controle da visualizacao dos Modals
    showModal = (company) => this.setState({ selectedCompany: company, isModalVisible: true });
    closeModal = () => this.setState({ isModalVisible: false });

    showEditModal = (company) => this.setState({ selectedCompany: company, isEditModalVisible: true });
    closeEditModal = () => this.setState({ isEditModalVisible: false });

    showDeleteModal = (company) => this.setState({ companyToDelete: company, isDeleteModalVisible: true });
    closeDeleteModal = () => this.setState({ isDeleteModalVisible: false, companyToDelete: null });

    render() {
        const {
            companies, loading, selectedCompany,
            isModalVisible, isEditModalVisible, isDeleteModalVisible, companyToDelete
        } = this.state;

        return (
            <div className="table-wrapper">
                <div className="table-title">
                    <h6>Registered <b>Companies</b></h6>
                </div>
                {loading ? (
                    <div>Loading data...</div>
                ) : companies.length === 0 ? (
                    <div className="shadow-sm p-3 mb-2 bg-white rounded text-center">
                        No records available :(
                    </div>
                ) : (
                    <table className="table table-striped table-bordered">
                        {/*Deixei em varios componentes para melhorar a manutencao*/}
                        <TableHeader />
                        <TableBody
                            companies={companies}
                            onView={this.showModal}
                            onEdit={this.showEditModal}
                            onDelete={this.showDeleteModal}
                        />
                    </table>
                )}

                {isModalVisible && selectedCompany && <ViewModal company={selectedCompany} onClose={this.closeModal} />}
                {isEditModalVisible && selectedCompany && <EditModal company={selectedCompany} onClose={this.closeEditModal} reloadData={this.loadData} />}
                {isDeleteModalVisible && companyToDelete && <DeleteModal company={companyToDelete} onClose={this.closeDeleteModal} reloadData={this.loadData} />}
            </div>
        );
    }
}

export default Table;
