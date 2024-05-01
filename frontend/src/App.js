import React, {useEffect} from 'react';
import FormComponent from './components/Form';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from 'reactstrap';

const App = () => {
  useEffect(() => {
    fetch('http://10.25.10.186:5000').then(res => res.json()).then(data => {
      console.log(data);
    });
  }, []);

  return (
    <Container>
      <Header />
      <main>
        <FormComponent />
      </main>
      <Footer />
    </Container>
  );
};

export default App;