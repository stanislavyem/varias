export const json = {
  "title": "Send Feedback to the Team",
  // "description": "Need Help? Visit our support page",
  "completedHtml": "<h3>Thank you for your feedback</h3>",
  "pages": [{
    "elements": [
      {
        name: "email",
        title: "Enter your email:",
        type: "text"
      }, {
        name: "firstName",
        title: "Enter your first name:",
        type: "text"
      },
      {
        type: "dropdown",
        name: "status",
        title: "Relationship status",
        choices: ["Single", "Taken"],
      },
      {
        "type": "matrix",
        "name": "qualities",
        "title": "Please indicate if you agree or disagree with the following statements",
        "columns": [{
          "value": 5,
          "text": "Strongly agree"
        }, {
          "value": 4,
          "text": "Agree"
        }, {
          "value": 3,
          "text": "Neutral"
        }, {
          "value": 2,
          "text": "Disagree"
        }, {
          "value": 1,
          "text": "Strongly disagree"
        }],
        "rows": [{
          "value": "affordable",
          "text": "Product is affordable"
        }, {
          "value": "does-what-it-claims",
          "text": "Product does what it claims"
        }, {
          "value": "better-than-others",
          "text": "Product is better than other products on the market"
        }, {
          "value": "easy-to-use",
          "text": "Product is easy to use"
        }]
      }, {
        "type": "rating",
        "name": "satisfaction-score",
        "title": "How satisfied are you with our product?",
        "mininumRateDescription": "Not satisfied",
        "maximumRateDescription": "Completely satisfied"
      }, {
        "type": "rating",
        "name": "recommend",
        "visibleIf": "{satisfaction-score} > 3",
        "title": "How likely are you to recommend our product to a friend or co-worker?",
        "mininumRateDescription": "Will not recommend",
        "maximumRateDescription": "I will recommend"
      }, {
        "type": "comment",
        "name": "suggestions",
        "title": "What would make you more satisfied with our product?"
      }]
  }, {
    "elements": [{
      "type": "radiogroup",
      "name": "price-comparison",
      "title": "Compared to our competitors, do you feel our product is:",
      "choices": [
        "Less expensive",
        "Priced about the same",
        "More expensive",
        "Not sure"
      ]
    }, {
      "type": "radiogroup",
      "name": "current-price",
      "title": "Do you feel our current price is merited by our product?",
      "choices": [
        "correct|Yes, the price is about right",
        "low|No, the price is too low for your product",
        "high|No, the price is too high for your product"
      ]
    }, {
      "type": "multipletext",
      "name": "price-limits",
      "title": "What is the highest and lowest price you would pay for a product like ours?",
      "items": [{
        "name": "highest",
        "title": "Highest"
      }, {
        "name": "lowest",
        "title": "Lowest"
      }]
    }]
  }, {
    "elements": [{
      "type": "text",
      "name": "email",
      "title": "Please leave your email address if you would like us to contact you."
    }]
  }],
  "completeText": "Send",
  "widthMode": "responsive",
  "showQuestionNumbers": false
};