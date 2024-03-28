#!/bin/bash
source /crons/__libs.sh
source /crons/__generateStockData.sh
holdings=$(jq '.' /crons/holdings.conf)
use_cache="${1:-false}"
#declare -A stocks
stocks=()
for item in $(echo "$holdings" | jq -c '.[]'); do
    symbol=$(echo "$item" | jq -r '.symbol')
    units=$(echo "$item" | jq -r '.units')
    category=$(echo "$item" | jq -r '.category')
    purchase_price=$(echo "$item" | jq -r '.purchase_price')
    # get stock data from web
    data__=$(generate_stock_data "$symbol" $use_cache)
    #add holdings    
    data__="${data__%?}\"UNITS\":$units, \"PURCHASE_PRICE\":$purchase_price, \"CATEGORY\":\"$category\"}"    
    stocks+=("$data__")
    #stocks[$symbol]=$data__
done

stocks_size=${#stocks[@]}
#echo "Bash array '\${stocks}' has total ${length} element(s) (length)"
json_stocks='['
for (( j=0; j<${stocks_size}; j++ ));
do
    if [ $j -ne 0 ];then
        json_stocks+=",${stocks[$j]}"
    else
        json_stocks+=${stocks[$j]}
    fi
done
json_stocks+=']'
#echo "$json_stocks"
echo "$json_stocks" > /app/public/data/stocks.json
