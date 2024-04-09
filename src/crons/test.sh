#! /bin/bash
# source ./__libs.sh
# source ./__generateStockData.sh

# declare -A stocks
 
# stocks[ar3.asx]='{"price":10}'
# stocks[ivv.asx]='{"price":11}'

# # Create an empty JSON object
# json_stocks=$(echo "{}" | jq -c '.')
# for key in "${!stocks[@]}"; do
#     value="${stocks[$key]}"
#     json_stocks=$(echo "$json_stocks" | jq --arg key "$key" --argjson value "$value" '. + {($key): $value}')
# done

# echo "$json_stocks"

# WebSocket server URL
WS_URL="ws://host.docker.internal:8100"
# Message to send
#MESSAGE='{ "type": "message", "channel": "channel1", "content": "Hello, world!" }';
#DATA_JSON='{ "type": "subscribe", "channel": "asx" }'
DATA_JSON='{ "type": "message", "channel": "asx", "content": "Hello, world!" }';
# Send WebSocket message using websocat
#websocat $WS_URL --text "$MESSAGE"
echo "$DATA_JSON" | websocat "$WS_URL"
# RabbitMQ server URL
# RabbitMQ server URL

# RabbitMQHost='10.79.55.12'
# RabbitMQUn='guest'
# RabbitMQPw='iloveguy!'
# vHost='%2F'
# name='amq.direct'
# routing_key='hello'
# #curl -i -u ${RabbitMQUn}:${RabbitMQPw} "http://${RabbitMQHost}:15672/api/vhosts"

# curl -i -u ${RabbitMQUn}:${RabbitMQPw} http://${RabbitMQHost}:15672/api/queues/%2F/test/bindings

# curl -i -u ${RabbitMQUn}:${RabbitMQPw} -H "Content-Type: application/json" -X POST -d '{"properties":{},"routing_key":"${routing_key}","payload":"Hello, RabbitMQ!","payload_encoding":"string"}' http://${RabbitMQHost}:15672/api/exchanges/${vHost}/${name}/publish



#'http://10.79.55.12:15672/api/channels?sort=message_stats.publish_details.rate&sort_reverse=true&columns=name,message_stats.publish_details.rate,message_stats.deliver_get_details.rate'



# stocks[ar3.asx]=$(generate_stock_data "ar3.asx")

# for key in "${!stocks[@]}"; do
#     value="${stocks[$key]}"
#     echo "Key: $key, Value: $value"
# done

#stock_data=$(generate_stock_data "ar3.asx")
#echo $stock_data
#     stock[NAME]=$(extract_name "$scraped_data")            

# # Check if argument is provided
# if [ $# -ne 1 ]; then
#     echo "Usage: $0 <SYMBOL>"    
#     log "<SYMBOL> not passed"
#     exit 1
# fi

# log "Running Get Stocks: $1"
# symbol="$1"
# scraped_data=$(scrape_google_finance "$symbol")
# log "Saving ./data/$symbol"
# echo "$scraped_data" > ./data/$symbol
# declare -A stock
# if [ $? -eq 0 ]; then
#     stock[NAME]=$(extract_name "$scraped_data")            
#     price=$(extract_price "$scraped_data")
#     stock[PRICE]=$price        
#     stock_raw_datecurrencyexchange=$(extract_datecurrencyexchange "$scraped_data")        
#     stock[DATETIME]=$(echo "$stock_raw_datecurrencyexchange" | cut -d'|' -f1)
#     stock[CURRENCY]=$(echo "$stock_raw_datecurrencyexchange" | cut -d'|' -f2)
#     stock[EXCHANGE]=$(echo "$stock_raw_datecurrencyexchange" | cut -d'|' -f3)            
    
#     extracted_datapoints_string=$(extract_datapoints "$scraped_data")        
#     previous_close=$(extract_datapoint "previous close" "$extracted_datapoints_string" "numeric")
#     stock[PREVIOUS_CLOSE]=$previous_close
    
#     IFS=' - '    
#     read -ra parts <<< $(extract_datapoint "day range" "$extracted_datapoints_string")
#     stock[DAY_RANGE_MIN]=$(convert_2_numeric "${parts[0]}")
#     stock[DAY_RANGE_MAX]=$(convert_2_numeric "${parts[1]}")
    
#     read -ra parts <<< $(extract_datapoint "year range" "$extracted_datapoints_string")
#     stock[YEAR_RANGE_MIN]=$(convert_2_numeric "${parts[0]}")
#     stock[YEAR_RANGE_MAX]=$(convert_2_numeric "${parts[1]}")

#     stock[MARKET_CAP]=$(extract_datapoint "market cap" "$extracted_datapoints_string")
#     stock[AVG_VOLUME]=$(extract_datapoint "avg volume" "$extracted_datapoints_string")
#     stock[PE_RATIO]=$(extract_datapoint "p/e ratio" "$extracted_datapoints_string" "numeric")
#     stock[DIVIDEND_YIELD]=$(extract_datapoint "dividend yield" "$extracted_datapoints_string")

#     ## CALCULATED PRICE MOVEMENT        
#     price_move=$(awk -v n1="$price" -v n2="$previous_close" 'BEGIN {print n1 - n2}')
#     price_move_perc=$(awk -v n1="$price_move" -v n2="$previous_close" 'BEGIN {printf "%.2f", n1 / n2 * 100}')    
#     stock[PRICE_MOVE]=$price_move    
#     stock[PRICE_MOVE_PERC]=$price_move_perc    

#     json=$(convert_to_json stock)    
#     echo "$json"
# else
#     log "Failed to scrape Google Finance data for $symbol."    
# fi