import { Order } from "../Shared/interface";

const APPEND_ORDER = "APPEND_ORDER";

export function appendOrder(order: Order) {
  console.log("appending order", order.success);
  return {
    type: APPEND_ORDER,
    order
  };
}

export default function ordersReducer(state = [], action): Order[] {
  switch (action.type) {
    case APPEND_ORDER:
      return [...state, action.order];
    default:
      return state;
  }
}
