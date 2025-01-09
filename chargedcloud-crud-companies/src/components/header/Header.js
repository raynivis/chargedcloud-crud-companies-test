//Cabeçalho do software
import './Header.css';

function Header() {
    return (
        <header className="p-3 mb-3 border-bottom">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <a href="#" className="nav-link px-3">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#" className="nav-link px-3">
                            Register Company
                            </a>
                        </li>
                    </ul>
                    <img src="/chargedcloud_full_white_comapanies.png" alt="Company Logo" width={188} height={65} />
                </div>
            </div>
        </header>
    );
}

export default Header;