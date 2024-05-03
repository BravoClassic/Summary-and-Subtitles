import React from 'react';
import FormComponent from './components/Form';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from 'reactstrap';

const App = () => {
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