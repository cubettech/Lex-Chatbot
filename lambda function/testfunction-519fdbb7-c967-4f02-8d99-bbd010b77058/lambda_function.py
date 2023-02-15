import os
import json
import boto3
# reuse client connection as global

import logging

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def lambda_handler(event, context):
    logger.debug(event["sessionState"]["intent"])
    intent = event["sessionState"]["intent"]
    nights = event["sessionState"]["intent"]["slots"]["Nights"]
    
    if event["invocationSource"] == "DialogCodeHook" and nights and int(nights["value"]["interpretedValue"]) > 20:
        intent =event["sessionState"]["intent"]
        intent["confirmationState"] = "Denied"
        return {
            "sessionState": {
                "dialogAction": {
                    "type": "Close",
                },
                "intent": intent
            },
           "messages": [{
                "content": "Sorry, we don't allow booking for more than 20 days",
                "contentType": "PlainText"
            }]
        }
    return {
            "sessionState": {
                "dialogAction": {
                    "type": "Delegate"
                },
                "intent":event["sessionState"]["intent"]
            }
            
        }