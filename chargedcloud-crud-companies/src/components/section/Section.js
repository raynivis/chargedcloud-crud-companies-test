//Seccao principal do software
import { Routes, Route } from 'react-router';
import Home from './home/Home';
import Register from './register/Register';

function Section() {
    return (
        <section className="container-fluid d-flex justify-content-center">
            <Routes>
                <Route path="/" index element={<Home />}></Route>
                <Route path="/register" element={<Register />}></Route>
            </Routes>
        </section>
    );
}

export default Section;