import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Section from './components/section/Section';
import { BrowserRouter } from 'react-router';


function App() {
  return (
    <div>
      <BrowserRouter> {/*Para o uso das rotas no sistema*/}
        <Header/>
        <Section/>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
