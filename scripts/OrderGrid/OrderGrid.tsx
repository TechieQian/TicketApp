import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { connect } from "react-redux";
import { Order } from "../Shared/interface";
import * as moment from "moment";

interface IOrderGridProps {
  orders?: Order[];
}

interface IOrderGridState {
  columnDefs: any[];
  lastUpdated: string;
  rowData: Order[];
}

class OrderGrid extends React.PureComponent<IOrderGridProps, IOrderGridState> {
  constructor(props: IOrderGridProps) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: "Action", field: "action", cellRenderer, sortable: true },
        { headerName: "Symbol", field: "symbol", cellRenderer, sortable: true },
        { headerName: "Quantity", field: "qty", cellRenderer, sortable: true },
        {
          headerName: "Order Type",
          field: "orderType",
          cellRenderer,
          sortable: true
        },
        { headerName: "TIF", field: "tif", cellRenderer, sortable: true },
        { headerName: "Price", field: "price", cellRenderer, sortable: true },
        {
          headerName: "Stop Price",
          field: "stopPrice",
          cellRenderer,
          sortable: true
        },
        {
          headerName: "Comment",
          field: "comment",
          cellRenderer,
          sortable: true
        }
      ],
      rowData: this.props.orders.filter(order => order.success),
      lastUpdated: moment().format("hh:mm:ss A")
    };
    function cellRenderer(params) {
      // wanted to use Tooltip component here but no go. Using HTML title instead.
      return `<Tooltip><span title=${params.value}>${
        params.value
      }</span></Tooltip>`;
    }
  }
  static getDerivedStateFromProps(props) {
    return {
      rowData: props.orders.filter(order => order.success),
      lastUpdated: moment().format("hh:mm:ss A")
    };
  }
  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }
  filterSuccessfulOrders(orders) {
    return orders.filter(order => order.sucess);
  }
  render() {
    return (
      <div id="order_blotter">
        <div className="header">
          <span>Order Blotter</span>
          <span>Last Updated : {this.state.lastUpdated} </span>
        </div>
        <div id="order_grid" className="ag-theme-balham">
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            onGridReady={this.onGridReady}
            headerHeight={40}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ orders }) {
  return { orders };
}

export default connect(mapStateToProps)(OrderGrid);
