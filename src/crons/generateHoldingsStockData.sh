#!/bin/bash
source /crons/__libs.sh
source /crons/__generateStockData.sh
holdings=$(jq '.' /crons/holdings.conf)
use_cache="${1:-false}"
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
echo "$json_stocks" > /app/public/data/stocks.json

echo "Sending data to Socket Server"
WS_URL="ws://host.docker.internal:8100"
TYPE="message"
CHANNEL="asx"
CONTENT=$json_stocks
DATA_JSON=$(jq --null-input \
  --arg type "$TYPE" \
  --arg channel "$CHANNEL" \
  --arg content "$CONTENT" \
  '{"type": $type, "channel": $channel, "content": $content}')

# Send WebSocket message using websocat
#websocat $WS_URL --text "$MESSAGE"
#echo $DATA_JSON
echo $DATA_JSON | websocat "$WS_URL"


#json_stocks=$(cat /app/public/data/stocks.json)
# WS_URL="ws://host.docker.internal:8100"
# DATA_JSON='{ "type": "message", "channel": "asx", "content":[DATA_JS_ARRAY]}';
# # # Send WebSocket message using websocat
# # #websocat $WS_URL --text "$MESSAGE"
# # DATA_JSON=$(jq --null-input \
# #     --arg type "message" \
# #     --arg channel "asx" \
# #     --arg content "${json_stocks}" \
# #     '{"type": $type, "channel": $channel, "content": $content}')

# # echo $DATA_JSON
# echo "$DATA_JSON" | websocat "$WS_URL"
#WS_URL="ws://host.docker.internal:8100"
# Message to send
#MESSAGE='{ "type": "message", "channel": "channel1", "content": "Hello, world!" }';
#DATA_JSON='{ "type": "subscribe", "channel": "asx" }'
#DATA_JSON='{ "type": "message", "channel": "asx", "content": "Hello World?" }';
# DATA_JSON=$(jq --null-input \
#     --arg type "message" \
#     --arg channel "asx" \
#     --arg content "${json_stocks}" \
#     '{ "type": "$type", "channel": "$channel", "content": "Hello World?" }')
