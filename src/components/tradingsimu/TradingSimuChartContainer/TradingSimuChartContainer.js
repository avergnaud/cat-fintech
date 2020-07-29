import React, { useState, useEffect } from "react"
import * as d3 from "d3"
import TradingSimuChart from "../TradingSimuChart/TradingSimuChart"
import containerStyles from "./TradingSimuChartContainer.module.scss"

export default function TradingSimuChartContainer() {

  const [data, setData] = useState([])

  const visual = {
    margin: { top: 50, right: 30, bottom: 110, left: 40 },
    margin2: { top: 430, right: 30, bottom: 30, left: 40 },
    outerWidth: 960,
    outerHeight: 500,
    outerHeight2: 500,
    legendOffset: 20,
    yMargin: 30
  }

  useEffect(() => {
    /* component did mount */
    d3.json("https://macd-definition.herokuapp.com/macd/?macdDefinitionId=1")
      .then(json => {

        /* skip the first incomplete items (before 12+26+9) */
        json = json.filter((item) => item.macdValue && item.signalValue);

        let data = json.map((item) => ({
        ...item,
        date: new Date(item.timeEpochTimestamp * 1000),
        }));

        setData(data)
      })
      .catch(err => {
        console.log(err)
      })
  }, []);

  return (
    <React.Fragment>
      <section className={`container-fluid ${containerStyles.darkSection}`}>
          <div className="container">
            <div className="row">
              <div className="col-12 content quote">
                <p className={containerStyles.darkQuote}>
                  Simulation de trading...
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <TradingSimuChart data={data} visual={visual} />
            </div>
          </div>
        </div>
    </React.Fragment>
  );
}
