import * as React from "react";
import { Button, Progress, notification } from "antd";
import { IStoreProps } from "../Shared/interface";
import "antd/dist/antd.css";

interface ISendOrderProps extends IStoreProps {
  handleSubmit: Function;
  disabled: boolean;
}
interface ISendOrderState {
  sending: boolean;
  percent: number;
  status: string | any;
}

export default class SendOrder extends React.Component<
  ISendOrderProps,
  ISendOrderState
> {
  constructor(props: ISendOrderProps) {
    super(props);
    this.state = {
      sending: false,
      percent: 0,
      status: "active"
    };
  }
  // First sets an interval timer, then once completed, checks if 10th order.
  handleSubmit = e => {
    this.setState({ sending: true });
    let timer = setInterval(
      function() {
        if (this.state.percent === 100) {
          clearInterval(timer);
          if (
            this.props.orders.length &&
            (this.props.orders.length + 1) % 10 === 0
          ) {
            notification["error"]({
              message: "Order time has relapsed",
              btn: (
                <Button
                  onClick={() => {
                    this.setState({
                      sending: false,
                      percent: 0,
                      status: "active"
                    });
                    notification.close("1");
                  }}
                >
                  Ok{" "}
                </Button>
              ),
              duration: 0,
              key: "1"
            });
            this.setState({ status: "exception" });
            this.props.handleSubmit(false);
          } else {
            this.setState({ percent: 0, sending: false }, () => {
              this.props.handleSubmit(true);
            });
          }
        }
        this.setState(prevState => ({ percent: prevState.percent + 5 }));
      }.bind(this),
      100
    );
  };
  render() {
    return (
      <div>
        <Button
          style={{ width: "100%" }}
          disabled={this.props.disabled || this.state.sending}
          onClick={this.handleSubmit}
        >
          Submit
        </Button>
        {this.state.sending && (
          <Progress percent={this.state.percent} status={this.state.status} />
        )}
      </div>
    );
  }
}
