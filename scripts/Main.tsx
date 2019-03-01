import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Ticket from "./Ticket/Ticket";
import store from "./store/store";
import { Provider } from "react-redux";
import OrderGrid from "./OrderGrid/OrderGrid";
import "./Main.scss";

function Main(props) {
  return (
    <section id="ticket_app">
        <section id="order_entry">
          <div className="header">
            <span
              style={{ color: "gray", fontStyle: "italic", marginRight: "5px" }}
            >
              Tiny OMS
            </span>
            Order Entry
          </div>
          <Ticket />
        </section>
        <OrderGrid />
    </section>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);
