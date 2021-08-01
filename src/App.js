import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from 'react-bootstrap'
import MemesScreen from "./screens/MemesScreen";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";

function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/dashboard' component={DashboardScreen} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/' component={MemesScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;