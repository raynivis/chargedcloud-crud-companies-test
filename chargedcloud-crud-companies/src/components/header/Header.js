//Cabeçalho do software
import './Header.css';
import { Link } from 'react-router';
function Header() {
    return (
        <header className="p-3 mb-3 border-bottom">
            <div className="container">
                {/*Navegação das rotas*/}
                <nav className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                            <li>
                                <Link to="/" className="nav-link px-3">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="nav-link px-3">
                                    Register Company
                                </Link>
                            </li>
                        </ul>
                        <Link to="/" className="nav-link px-3">
                            <img src="/chargedcloud_full_white_comapanies.png" alt="Company Logo" width={188} height={65} />
                        </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;