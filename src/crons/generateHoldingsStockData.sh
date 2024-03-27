#!/bin/bash
source ./__libs.sh
source ./__generateStockData.sh

holdings=$(jq '.' holdings.conf)
declare -A stocks
for item in $(echo "$holdings" | jq -c '.[]'); do
    symbol=$(echo "$item" | jq -r '.symbol')
    units=$(echo "$item" | jq -r '.units')
    category=$(echo "$item" | jq -r '.category')
    purchase_price=$(echo "$item" | jq -r '.purchase_price')
    # get stock data from web
    data__=$(generate_stock_data "$symbol")
    #add holdings    
    data__="${data__%?}\"UNITS\":$units, \"PURCHASE_PRICE\":$purchase_price, \"CATEGORY\":\"$category\"}"    
    stocks[$symbol]=$data__
done

json_stocks='{'
for key in "${!stocks[@]}"; do
    json_stocks+=$(echo "\"$key\": ${stocks[$key]},")
done
json_stocks="${json_stocks%?}"
json_stocks+='}'
echo "$json_stocks"
echo "$json_stocks" > /app/public/data/stocks.json
