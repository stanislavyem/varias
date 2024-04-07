"use client"
import 'survey-core/defaultV2.min.css';
import { useCallback } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { json } from "../../../assets/data/survey";
import { themeJson } from "./theme";
import './survey.scss'

export default function App() {
  const survey = new Model(json);

  const surveyComplete = useCallback((sender: any) => {
    saveSurveyResults(
      "https://us-west-2.aws.data.mongodb-api.com/app/datemarks-staging-yzsgy/endpoint/feedback",
      sender.data
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

function saveSurveyResults(url: string, json: {}) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(json)
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