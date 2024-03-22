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