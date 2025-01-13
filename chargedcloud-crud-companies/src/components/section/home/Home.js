import './Home.css';
import Table from './table/Table';
import React from 'react';
import SyncData from '../../../services/SyncData';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiOnline: false, // Estado para controlar o status da API
    };
  }

  async componentDidMount() {
    try {
      const isOnline = await SyncData.checkApiAvailability();
      this.setState({ apiOnline: isOnline });
    } catch (error) {
      this.setState({ apiOnline: false });
    }
  }

  render() {
    const { apiOnline } = this.state;

    return (
      <article className="container-xl">
        {apiOnline ? (
          <span className="badge bg-success rounded-pill text-left float-end">
            API
          </span>
        ) : (
          <span className="badge bg-danger rounded-pill text-left float-end">
            API
          </span>
        )}
        <div className="table-responsive">
          <Table />
        </div>
      </article>
    );
  }
}

export default Home;
