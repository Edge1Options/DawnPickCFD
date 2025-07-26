import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Result "mo:base/Result";
import Principal "mo:base/Principal";

actor DawnPickCFD {
    // 类型定义
    public type Position = {
        id: Text;
        user: Principal;
        symbol: Text;
        positionType: Text; // "long" or "short"
        size: Float;
        entryPrice: Float;
        leverage: Nat;
        timestamp: Int;
        isActive: Bool;
    };

    public type Order = {
        id: Text;
        user: Principal;
        symbol: Text;
        orderType: Text; // "market" or "limit"
        side: Text; // "buy" or "sell"
        size: Float;
        price: Float;
        leverage: Nat;
        timestamp: Int;
        status: Text; // "pending", "filled", "cancelled"
    };

    public type PriceData = {
        symbol: Text;
        price: Float;
        timestamp: Int;
        volume: Float;
        change24h: Float;
    };

    public type UserBalance = {
        user: Principal;
        balance: Float;
        lockedBalance: Float;
    };

    // 状态变量
    private stable var positionCounter: Nat = 0;
    private stable var orderCounter: Nat = 0;
    
    private var positions = HashMap.HashMap<Text, Position>(10, Text.equal, Text.hash);
    private var orders = HashMap.HashMap<Text, Order>(10, Text.equal, Text.hash);
    private var balances = HashMap.HashMap<Principal, UserBalance>(10, Principal.equal, Principal.hash);
    private var priceFeeds = HashMap.HashMap<Text, PriceData>(10, Text.equal, Text.hash);

    // 初始化价格数据
    private func initializePrices() {
        let symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA", "META", "SPY", "QQQ", "IWM"];
        let prices = [175.43, 2847.52, 378.85, 248.50, 3342.88, 875.28, 485.59, 445.20, 378.45, 195.30];
        
        for (i in symbols.keys()) {
            let priceData: PriceData = {
                symbol = symbols[i];
                price = prices[i];
                timestamp = Time.now();
                volume = 1000000.0;
                change24h = (Float.fromInt(Int.abs(Time.now() % 1000)) / 1000.0 - 0.5) * 10.0;
            };
            priceFeeds.put(symbols[i], priceData);
        };
    };

    // 系统初始化
    system func preupgrade() {
        initializePrices();
    };

    system func postupgrade() {
        initializePrices();
    };

    // 公共方法
    public query func getPrices(): async [PriceData] {
        Array.map<(Text, PriceData), PriceData>(priceFeeds.entries() |> Array.fromIter(_), func(entry) = entry.1)
    };

    public query func getPrice(symbol: Text): async ?PriceData {
        priceFeeds.get(symbol)
    };

    public func updatePrice(symbol: Text, price: Float): async Bool {
        switch (priceFeeds.get(symbol)) {
            case (?existing) {
                let updated: PriceData = {
                    symbol = existing.symbol;
                    price = price;
                    timestamp = Time.now();
                    volume = existing.volume;
                    change24h = ((price - existing.price) / existing.price) * 100.0;
                };
                priceFeeds.put(symbol, updated);
                true
            };
            case null { false };
        }
    };

    public func deposit(amount: Float): async Bool {
        let caller = Principal.fromActor(DawnPickCFD);
        switch (balances.get(caller)) {
            case (?existing) {
                let updated: UserBalance = {
                    user = existing.user;
                    balance = existing.balance + amount;
                    lockedBalance = existing.lockedBalance;
                };
                balances.put(caller, updated);
            };
            case null {
                let newBalance: UserBalance = {
                    user = caller;
                    balance = amount;
                    lockedBalance = 0.0;
                };
                balances.put(caller, newBalance);
            };
        };
        true
    };

    public query func getBalance(): async ?UserBalance {
        let caller = Principal.fromActor(DawnPickCFD);
        balances.get(caller)
    };

    public func placeOrder(symbol: Text, orderType: Text, side: Text, size: Float, price: Float, leverage: Nat): async Result.Result<Text, Text> {
        let caller = Principal.fromActor(DawnPickCFD);
        orderCounter += 1;
        let orderId = "order_" # Nat.toText(orderCounter);
        
        let order: Order = {
            id = orderId;
            user = caller;
            symbol = symbol;
            orderType = orderType;
            side = side;
            size = size;
            price = price;
            leverage = leverage;
            timestamp = Time.now();
            status = "pending";
        };
        
        orders.put(orderId, order);
        #ok(orderId)
    };

    public func executeOrder(orderId: Text): async Result.Result<Text, Text> {
        switch (orders.get(orderId)) {
            case (?order) {
                if (order.status != "pending") {
                    return #err("Order already processed");
                };
                
                positionCounter += 1;
                let positionId = "pos_" # Nat.toText(positionCounter);
                
                let position: Position = {
                    id = positionId;
                    user = order.user;
                    symbol = order.symbol;
                    positionType = if (order.side == "buy") "long" else "short";
                    size = order.size;
                    entryPrice = order.price;
                    leverage = order.leverage;
                    timestamp = Time.now();
                    isActive = true;
                };
                
                positions.put(positionId, position);
                
                let updatedOrder: Order = {
                    id = order.id;
                    user = order.user;
                    symbol = order.symbol;
                    orderType = order.orderType;
                    side = order.side;
                    size = order.size;
                    price = order.price;
                    leverage = order.leverage;
                    timestamp = order.timestamp;
                    status = "filled";
                };
                orders.put(orderId, updatedOrder);
                
                #ok(positionId)
            };
            case null { #err("Order not found") };
        }
    };

    public query func getUserPositions(): async [Position] {
        let caller = Principal.fromActor(DawnPickCFD);
        Array.filter<Position>(
            Array.map<(Text, Position), Position>(positions.entries() |> Array.fromIter(_), func(entry) = entry.1),
            func(pos) = pos.user == caller and pos.isActive
        )
    };

    public query func getUserOrders(): async [Order] {
        let caller = Principal.fromActor(DawnPickCFD);
        Array.filter<Order>(
            Array.map<(Text, Order), Order>(orders.entries() |> Array.fromIter(_), func(entry) = entry.1),
            func(order) = order.user == caller
        )
    };

    public func closePosition(positionId: Text): async Result.Result<Text, Text> {
        let caller = Principal.fromActor(DawnPickCFD);
        switch (positions.get(positionId)) {
            case (?position) {
                if (position.user != caller) {
                    return #err("Unauthorized");
                };
                if (not position.isActive) {
                    return #err("Position already closed");
                };
                
                let updatedPosition: Position = {
                    id = position.id;
                    user = position.user;
                    symbol = position.symbol;
                    positionType = position.positionType;
                    size = position.size;
                    entryPrice = position.entryPrice;
                    leverage = position.leverage;
                    timestamp = position.timestamp;
                    isActive = false;
                };
                positions.put(positionId, updatedPosition);
                
                #ok("Position closed successfully")
            };
            case null { #err("Position not found") };
        }
    };

    // 健康检查
    public query func healthCheck(): async Text {
        "DawnPick CFD Backend is running"
    };
}