#!/bin/bash

holdings=$(jq '.' holdings.conf)
echo "Parsed JSON data:"
echo "$holdings"

for item in $(echo "$holdings" | jq -c '.[]'); do
    # Extract fields from each object
    symbol=$(echo "$item" | jq -r '.symbol')
    units=$(echo "$item" | jq -r '.units')
    purchase_price=$(echo "$item" | jq -r '.purchase_price')

    # Output the extracted fields
    echo "Symbol: $symbol"
    echo "---------------------"

    source __getStock.sh "$symbol"
    break
