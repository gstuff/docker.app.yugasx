#! /bin/bash
source ./libs.sh
# Check if argument is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <SYMBOL>"    
    log "<SYMBOL> not passed"
    exit 1
fi

log "Running Get Stocks: $1"

# symbol="$1"
# scraped_data=$(scrape_google_finance "$symbol")
scraped_data=$(cat ./data/ar3.asx)

# Check if data is successfully scraped
if [ $? -eq 0 ]; then
    # Extract the previous close price using grep
    stock_name=$(echo "$scraped_data" | grep -oP '(?<=<div role="heading" aria-level="1" class="zzDege">)[^<]+')    
    stock_datetime=$(echo "$scraped_data" | grep -oP '(?<=<div class="ygUjEc" jsname="Vebqub">)[^<]+')
    stock_price=$(echo "$scraped_data" | grep -oP '(?<=<div class="YMlKec fxKbKc">)[^<]+')        
    readarray -t pricepoints <<< "$(echo "$scraped_data" | grep -oP '(?<=<div class="P6K39c">)[^<]+')"
    if [ -n "$stock_price" ]; then
        SYMBOL=$symbol
        NAME=$stock_name
        PRICE=$(echo "$stock_price" | sed 's/[$,]//g')
        PREVIOUS_CLOSE=$(echo "${pricepoints[0]}" | sed 's/[$,]//g')

        DAY_RANGE=$(echo "${pricepoints[1]}" | sed 's/[$,]//g')
        DAY_RANGE_MIN=$(echo "$DAY_RANGE" | awk '{print $1}')
        DAY_RANGE_MAX=$(echo "$DAY_RANGE" | awk '{print $NF}')

        YEAR_RANGE=$(echo "${pricepoints[2]}" | sed 's/[$,]//g')
        YEAR_RANGE_MIN=$(echo "$YEAR_RANGE" | awk '{print $1}')
        YEAR_RANGE_MAX=$(echo "$YEAR_RANGE" | awk '{print $NF}')
        AVG_VOLUME="${pricepoints[3]}"

        DATETIME=$(get_trimmed_string "$(echo "$stock_datetime" | awk -F "&middot;" '{print $1}')")
        CURRENCY=$(get_trimmed_string "$(echo "$stock_datetime" | awk -F "&middot;" '{print $2}')")
        EXCHANGE=$(get_trimmed_string "$(echo "$stock_datetime" | awk -F "&middot;" '{print $3}')")
        
        ## CALCULATED PRICE MOVEMENT
        PRICE_MOVE=$(awk "BEGIN {print $PRICE - $PREVIOUS_CLOSE}")
        PRICE_PERC=$(awk "BEGIN {printf \"%.2f\", $PRICE_MOVE / $PREVIOUS_CLOSE * 100}")                
        
        JSON_STRING=$( jq -n \
                        --arg _symbol "$SYMBOL" \
                        --arg _name "$NAME" \
                        --arg _price "$PRICE" \
                        --arg _previous_close "$PREVIOUS_CLOSE" \
                        --arg _day_range "$DAY_RANGE" \
                        --arg _day_range_min "$DAY_RANGE_MIN" \
                        --arg _day_range_max "$DAY_RANGE_MAX" \
                        --arg _year_range "$YEAR_RANGE" \
                        --arg _year_range_min "$YEAR_RANGE_MIN" \
                        --arg _year_range_max "$YEAR_RANGE_MAX" \
                        --arg _avg_volume "$AVG_VOLUME" \
                        --arg _datetime "$DATETIME" \
                        --arg _currency "$CURRENCY" \
                        --arg _exchange "$EXCHANGE" \
                        --arg _price_move "$PRICE_MOVE" \
                        --arg _price_move_perc "$PRICE_PERC" \
                        '{
                            symbol: $_symbol, name: $_name,
                            price: $_price | tonumber, previous_close: $_previous_close | tonumber,
                            day_range: $_day_range, day_range_min: $_day_range_min | tonumber, day_range_max: $_day_range_max | tonumber,
                            year_range: $_year_range, year_range_min: $_year_range_min | tonumber, year_range_max: $_year_range_max | tonumber,
                            avg_volume: $_avg_volume, datetime: $_datetime,
                            currency: $_currency, exchange: $_exchange,
                            price_move: $_price_move, price_move_perc: $_price_move_perc
                        }' )
        echo "$JSON_STRING"
    else
        echo `{"message":"Failed to extract stock price for $symbol."}`
    fi
else
    echo `{"message":"Failed to scrape Google Finance data for $symbol."}`
fi
