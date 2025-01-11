//Componente de inicial do software
import './Home.css';
import Table from './table/Table';

function Home() {
    return (
        <article className="container-xl">
            <div className="table-responsive">
                <Table/>
            </div>
        </article>
    );
}

export default Home;