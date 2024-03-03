import React from 'react';
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./components/navigation/Home";
import Buy from "./components/navigation/Buy";
import Faq from "./components/navigation/Faq";
import Shipment from "./components/navigation/Shipment";
import Liked from "./components/navigation/Liked";
import Basket from "./components/navigation/basket";
import Opt from "./components/navigation/Opt";
import Reg from "./components/navigation/Reg";
import ContactsS from "./components/navigation/ContactsS";
import About from "./components/navigation/About";

const router = createBrowserRouter([
  {
    path: "/opt",
    element: <Opt/>,
  },
  {
    path: "/reg",
    element: <Reg/>,
  },
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "buy",
    element: <Buy/>,
  },
  {
    path: "faq",
    element: <Faq/>,
  },
  {
    path: "shipment",
    element: <Shipment/>,
  },
  {
    path: "liked",
    element: <Liked/>,
  },
  {
    path: "basket",
    element: <Basket/>,
  },
  {
    path: "contacts",
    element: <ContactsS/>,
  },
  {
    path: "about",
    element: <About/>,
  },
]);

class App extends React.Component {
  render() {
    return(
        <div className="App">
          <RouterProvider router={router} />
        </div>
    );
  }
}
export default App;
