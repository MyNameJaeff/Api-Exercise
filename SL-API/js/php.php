curl -X POST -d '{
  "address": {
    "regionCode": "US",
    "locality": "Mountain View",
    "addressLines": ["1600 Amphitheatre Pkwy"]
  }
}' \
-H 'Content-Type: application/json' \
"https://addressvalidation.googleapis.com/v1:validateAddress?key=YOUR_API_KEY"
