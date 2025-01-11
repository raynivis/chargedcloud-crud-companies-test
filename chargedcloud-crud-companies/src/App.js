import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Section from './components/section/Section';
import { BrowserRouter } from 'react-router';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Header />
        <Section />
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
