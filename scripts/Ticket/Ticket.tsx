import * as React from "react";
import {
  Row,
  Col,
  Input,
  InputNumber,
  Dropdown,
  Button,
  Menu,
  Icon,
  Form,
  Select
} from "antd";
import { connect } from "react-redux";
import { IStoreProps } from "../Shared/interface";
import SendOrder from "./SendOrder";
import * as store from "../store/store";
import "antd/dist/antd.css";
import "./Ticket.scss";
const Option = Select.Option;
const TextArea = Input.TextArea;

interface ITicketProps extends IStoreProps {}

interface ITicketState {
  action: string;
  symbol: string;
  qty: number;
  price: number;
  orderType: string;
  tif: string;
  stopPrice: number;
  comment: string;
}

class Ticket extends React.Component<ITicketProps, ITicketState> {
  constructor(props: ITicketProps) {
    super(props);
    this.state = {
      action: "Buy",
      symbol: "",
      qty: 0,
      price: 0,
      orderType: "",
      tif: "",
      stopPrice: 0,
      comment: ""
    };

    //hard-coded option values. Usually just enums on backend.
    this.tifOptions = ["GTC", "DAY", "FOK", "IOC"];
    this.actionOptions = ["Buy", "Sell"];
    this.orderTypeOptions = ["Market", "Limit"];
    this.symbolOptions = [
      "AAPL",
      "MSFT",
      "GOOGL",
      "VZ",
      "MMM",
      "NFLX",
      "FB",
      "TWTR",
      "AMZN",
      "EBAY"
    ];

    //creates menu component for dropdowns.
    this.actionMenu = this.optionsCreator(this.actionOptions, "action");
    this.tifMenu = this.optionsCreator(this.tifOptions, "tif");
    this.orderTypeMenu = this.optionsCreator(
      this.orderTypeOptions,
      "orderType"
    );
  }

  private tifOptions: string[];
  private actionOptions: string[];
  private orderTypeOptions: string[];
  private symbolOptions: string[];

  private tifMenu: JSX.Element;
  private actionMenu: JSX.Element;
  private orderTypeMenu: JSX.Element;

  // Using any as type in dynamic keys - https://github.com/Microsoft/TypeScript/issues/13948
  // One handler for each type of control.
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value } as any);
  };

  handleInputNumberChange = (number: number, name: string) => {
    this.setState({ [name]: number } as any);
  };

  handleSymbolSelect = (symbol: string) => {
    this.setState({ symbol });
  };

  handleSelection = (selection, menu) => {
    this.setState({ [menu]: selection.key } as any);
  };

  handleOrderSubmit = (success: boolean) => {
    this.props.appendOrder(Object.assign({}, this.state, { success }));
  };

  static validateForm(state) {
    let formOk = true;
    Object.keys(state).forEach(key => {
      if (key !== "comment" && !state[key]) {
        // implying qty price fields cannot be 0.
        formOk = false;
      }
    });
    return formOk;
  }
  optionsCreator(options: string[], name: string): JSX.Element {
    return (
      <Menu onClick={cb => this.handleSelection(cb, name)}>
        {options.map(option => (
          <Menu.Item key={option}>{option}</Menu.Item>
        ))}
      </Menu>
    );
  }
  render() {
    const actionBackground = this.state.action === "Buy" ? "green" : "red";
    return (
      <Form id="ticket">
        <Row gutter={15}>
          <Col span={5}>
            <Form.Item label="Action:">
              <Dropdown overlay={this.actionMenu}>
                <Button
                  style={{ color: "white", backgroundColor: actionBackground }}
                >
                  {this.state.action} <Icon type="down" />
                </Button>
              </Dropdown>
            </Form.Item>
          </Col>
          <Col span={7}>
            {" "}
            <Form.Item label="Symbol:">
              <Select
                showSearch
                placeholder="<Enter Symbol>"
                value={this.state.symbol || "<Enter Symbol>"}
                onChange={this.handleSymbolSelect}
                notFoundContent="Not Found"
              >
                {this.symbolOptions.map(option => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Qty:">
              <InputNumber
                min={0}
                max={999}
                value={this.state.qty}
                onChange={cb =>
                  this.handleInputNumberChange(Math.floor(cb) || 0, "qty")
                }
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Price:">
              <InputNumber
                min={0}
                step={0.01}
                precision={2}
                value={this.state.price}
                onChange={cb => this.handleInputNumberChange(cb, "price")}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={5}>
            <Form.Item label="Order Type:">
              <Dropdown overlay={this.orderTypeMenu}>
                <Button>
                  {this.state.orderType} <Icon type="down" />
                </Button>
              </Dropdown>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="TIF:">
              <Dropdown overlay={this.tifMenu}>
                <Button>
                  {this.state.tif} <Icon type="down" />
                </Button>
              </Dropdown>
            </Form.Item>
          </Col>
          <Col span={6} />
          <Col span={6}>
            <Form.Item label="Stop Price:">
              <InputNumber
                min={0}
                precision={2}
                step={0.01}
                value={this.state.stopPrice}
                onChange={cb => this.handleInputNumberChange(cb, "stopPrice")}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={12}>
            <Form.Item>
              <TextArea
                value={this.state.comment}
                name="comment"
                placeholder="<COMMENT>"
                autosize={{ minRows: 3, maxRows: 6 }}
                onChange={this.handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={6} />
          <Col span={6}>
            <Form.Item>
              <SendOrder
                disabled={!Ticket.validateForm(this.state)}
                handleSubmit={this.handleOrderSubmit}
                orders={this.props.orders}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

function mapPropsToState({ orders }) {
  return { orders };
}
function mapDispatchToProps(dispatch) {
  return {
    appendOrder: order => {
      dispatch(store.appendOrder(order));
    }
  };
}

export default connect(
  mapPropsToState,
  mapDispatchToProps
)(Ticket);
