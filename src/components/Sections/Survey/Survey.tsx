"use client"
import 'survey-core/defaultV2.min.css';
import './survey.scss'
import { useCallback } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { json } from "../../../assets/data/survey";
import { themeJson } from "./theme";

const SurveySection = () => {
  const survey = new Model(json);

  // const dbFeedback = "https://us-west-2.aws.data.mongodb-api.com/app/datemarks-staging-yzsgy/endpoint/feedback"

  const surveyComplete = useCallback((sender: any) => {
    saveSurveyResults(
      "https://api.telegram.org/bot6373603798:AAG-9NK-LpX6D3wZOTIpsOTie3n0jB23Q_c/sendMessage",
      sender.data,
      -4569601002
    )
  }, []);

  survey.onComplete.add(surveyComplete);
  survey.applyTheme(themeJson as any);

  return (
    <section className='section_markets section_text'>
      <div className="section__content">
        <div className="container_page container_content">
          <Survey model={survey} />
        </div>
      </div>
    </section>
  )
}

const saveSurveyResults = (url: string, json: {}, chatId: number) => {
  const formattedJson = JSON.stringify(json, null, 2);

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({ chat_id: chatId, text: formattedJson })
  })
    .then(response => {
      if (response.ok) {
        // Handle success
      } else {
        // Handle error
      }
    })
    .catch(error => {
      // Handle error
    });
}

export default SurveySection