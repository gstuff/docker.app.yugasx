#! /bin/bash
log(){        
    lgfle="./logs/$(TZ='Australia/Sydney' date '+%Y%m%d').log"    
    echo "$(TZ='Australia/Sydney' date '+%H:%M:%S'):    $1" >> $lgfle
}


# Function to scrape Google Finance data
scrape_google_finance(){
    local symbol=$(echo "$1" | tr '[:lower:]' '[:upper:]')
    IFS='.' read -r code exchange <<< "$symbol"
    local url="https://www.google.com/finance/quote/${code}:${exchange}"
    log "$url"
    curl -s "$url"
}


get_trimmed_string() {
    local input_string="$1"
    local trimmed_string=$(echo "$input_string" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
    echo "$trimmed_string"
}

extract_datapoints(){
    echo $1 | pup 'div.eYanAe > div.gyFHrc text{}' | jq -R '[inputs]'
}

extract_name(){
    echo $1 | pup 'div[role="heading"].zzDege text{}'
}

extract_datecurrencyexchange(){    
    raw_data__=$(echo $1| pup 'div[jsname="Vebqub"].ygUjEc text{}')
    raw_data__="${raw_data__//·/|}"
    clean_string=$(echo "$raw_data__" | sed 's/[^[:print:]]//g')    
    OLD_IFS=$IFS
    # Set IFS to the pipe character
    IFS="|"
    # Split the string into an array
    read -ra parts <<< "$clean_string"

    output__=""
    for part in "${parts[@]}"; do
        trimmed_string="${part#"${part%%[![:space:]]*}"}"
        trimmed_string="${trimmed_string%"${trimmed_string##*[![:space:]]}"}"        
        output__+="$trimmed_string|"        
    done  
    echo "$output__"
}

extract_datapoints(){
    local input="$1"
    local raw_string=$(echo "$input" | pup 'div.gyFHrc text{}')
    
    line_number=0 # loop over text ignore extended information
    while IFS= read -r line; do         
        if [ "$((line_number % 3))" -ne 1 ]; then        
            rtn_array+="$line|"
        fi
        ((line_number++))
    done <<< "$raw_string"
    echo "${rtn_array[@]}"    
}

extract_datapoint(){    
    declare -a datapoints
    IFS='|' read -r -a datapoints <<< "$2"
    index=$(printf "%s\n" "${datapoints[@]}" | grep -in -m 1 "$1" | cut -d: -f1)
    if [ -n "$index" ]; then
        index=$((index - 1))
        result=${datapoints[((index + 1))]}        
        if [ "$3" = "numeric" ]; then
            result=$(convert_2_numeric "$result")
        fi
        echo $result
    else
        echo ""
    fi    
}

extract_price(){
    stock_price=$(echo "$1" | pup 'div[class="YMlKec fxKbKc"] text{}' | sed 's/[$,]//g')    
    echo $stock_price
}

convert_2_numeric(){    
    output_string=$(echo "$1" | sed 's/[^0-9.]//g')    
    echo $output_string
}

convert_to_json() {        
    local -n assoc_array="$1"    
    listNumericKeys=("PRICE" "VALUE" "COST","PREVIOUS_CLOSE","DAY_RANGE_MIN","DAY_RANGE_MAX","YEAR_RANGE_MIN","YEAR_RANGE_MAX","RESPONSE_CODE","PRICE_MOVE")
    json_string="{"
    for key in "${!assoc_array[@]}"; do
        case "${listNumericKeys[@]}" in
        *"$key"*)
            json_string+="\"$key\":${assoc_array[$key]},"
            ;;
        *)
            json_string+="\"$key\":\"${assoc_array[$key]}\","
            ;;
        esac        
    done
    json_string+="}"

    echo "$json_string"
}