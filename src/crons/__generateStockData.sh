#! /bin/bash
source ./__libs.sh

generate_stock_data(){
    declare -A stock
    stock[RESPONSE_CODE]=1
    stock[RESPONSE_MESSAGE]=""        

    if [ $# -ne 1 ]; then
        echo "Usage: $0 <SYMBOL>"    
        log "<SYMBOL> not passed"
        exit 1
    fi

    log "Generating Stock Data: $1"
    symbol="$1"
    #scraped_data=$(cat /app/public/data/__$symbol)
    scraped_data=$(scrape_google_finance "$symbol")    
    log "Saving /app/public/data/__$symbol"
    echo "$scraped_data" > /app/public/data/__$symbol
    
    if [ $? -eq 0 ]; then        
        stock[NAME]=$(extract_name "$scraped_data")            
        price=$(extract_price "$scraped_data")
        stock[PRICE]=$price        
        stock_raw_datecurrencyexchange=$(extract_datecurrencyexchange "$scraped_data")        
        stock[DATETIME]=$(echo "$stock_raw_datecurrencyexchange" | cut -d'|' -f1)
        stock[CURRENCY]=$(echo "$stock_raw_datecurrencyexchange" | cut -d'|' -f2)
        stock[EXCHANGE]=$(echo "$stock_raw_datecurrencyexchange" | cut -d'|' -f3)            
        
        extracted_datapoints_string=$(extract_datapoints "$scraped_data")        
        previous_close=$(extract_datapoint "previous close" "$extracted_datapoints_string" "numeric")
        stock[PREVIOUS_CLOSE]=$previous_close
        
        IFS=' - '    
        read -ra parts <<< $(extract_datapoint "day range" "$extracted_datapoints_string")
        stock[DAY_RANGE_MIN]=$(convert_2_numeric "${parts[0]}")
        stock[DAY_RANGE_MAX]=$(convert_2_numeric "${parts[1]}")
        
        read -ra parts <<< $(extract_datapoint "year range" "$extracted_datapoints_string")
        stock[YEAR_RANGE_MIN]=$(convert_2_numeric "${parts[0]}")
        stock[YEAR_RANGE_MAX]=$(convert_2_numeric "${parts[1]}")

        stock[MARKET_CAP]=$(extract_datapoint "market cap" "$extracted_datapoints_string")
        stock[AVG_VOLUME]=$(extract_datapoint "avg volume" "$extracted_datapoints_string")
        stock[PE_RATIO]=$(extract_datapoint "p/e ratio" "$extracted_datapoints_string" "numeric")
        stock[DIVIDEND_YIELD]=$(extract_datapoint "dividend yield" "$extracted_datapoints_string")

        ## CALCULATED PRICE MOVEMENT        
        price_move=$(awk -v n1="$price" -v n2="$previous_close" 'BEGIN {print n1 - n2}')
        price_move_perc=$(awk -v n1="$price_move" -v n2="$previous_close" 'BEGIN {printf "%.2f", n1 / n2 * 100}')    
        stock[PRICE_MOVE]=$price_move    
        stock[PRICE_MOVE_PERC]=$price_move_perc            
    else
        stock[RESPONSE_CODE]=0
        stock[RESPONSE_MESSAGE]="Failed to scrape Google Finance data for $symbol."        
    fi

    json=$(convert_to_json stock)    
    echo "$json"
}