export interface Order {
    side : string;
    symbol : string;
    qty : number;
    price : number;
    orderType : string;
    tif : string;
    stopPrice : number;
    comment : string;
    success : boolean;
}

export interface IStoreProps {
    orders? : Order[];
    appendOrder ? : Function;
}
