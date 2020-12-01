import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Apartments from './Apartments/Apartments';
import { Switch, Route, Redirect } from 'react-router';
import Owners from './Owners/Owners';
import Footer from './Footer';
import ManagementCompanies from './ManagementCompanies/ManagementCompanies';
import Utilities from './Utilities/Utilities';
import OPEX from './OPEX/OPEX';
import qwe from './OPEX/qwe';
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Login from './Login/Login';
import { proxyurl81 } from './services/services';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wrongData, setWrongData] = useState();

  const authenticateUser = (userData, event) => {
    event.preventDefault();
    event.stopPropagation();
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
    /*fetch(proxyurl81 + "login", {
      method: "POST",
      body: JSON.stringify(userData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          if (data.data.is_management) {
            localStorage.setItem("isAuthenticated", "true");
            setIsAuthenticated(true);
          }
          else
            setWrongData("Wrong credentials please try again!");
        } else {
          setWrongData("Wrong credentials please try again!");
        }
      })*/
  }

  let showData = (
    <Switch>
      <Route path="/login" exact
        render={() =>
          <Login authenticate={authenticateUser} wrongData={wrongData} />
        } />
      <Redirect from="/" to="login" />
    </Switch>
  );


  if (localStorage.getItem("isAuthenticated") === "true") {
    showData = (
      <>
        <header className="App-header">
        </header>
        <main>
          <Switch >
            <Route path="/apartments" exact component={Apartments} />
            <Route path="/owners" exact component={Owners} />
            <Route path="/management" component={ManagementCompanies} />
            <Route path="/utilities" component={Utilities} />
            <Route path="/opex" component={OPEX} />
            <Route path="/qwe" component={qwe} />
            <Redirect from="/" to="apartments" />
          </Switch>
        </main>
        <footer className=" mt-auto">
          <Footer />
        </footer>
      </>
    );
  }

  return (
    <div className="App d-flex flex-column">
      {showData}
    </div>
  );
}

export default App;
