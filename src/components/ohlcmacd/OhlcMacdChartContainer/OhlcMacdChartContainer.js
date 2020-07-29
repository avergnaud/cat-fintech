import React, { useState, useEffect } from "react"
import * as d3 from "d3"
import OhlcMacdChart from "../OhlcMacdChart/OhlcMacdChart"
import containerStyles from "./OhlcMacdChartContainer.module.scss"

export default function OhlcMacdChartContainer() {

    const [data, setData] = useState([]);

    const visual = {
        innerWidth: 435,
        innerOhlcHeight: 167,
        innerMacdHeight: 100,
        margin: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 0,
          xaxis: 50,
          yaxis: 50,
        },
        timeFormat: "%Y-%m-%d",
      };
    
      useEffect(() => {
        /* component did mount */
        Promise.all([
          d3.json("https://macd-definition.herokuapp.com/ohlc/?chartEntityId=2&last=100"),
          d3.json("https://macd-definition.herokuapp.com/macd/?macdDefinitionId=1&last=100")
        ])
          .then((data) => {
            const macdByTimestamp = new Map();
            data[1].forEach(item => {
                macdByTimestamp.set(item.timeEpochTimestamp, {
                macdValue: item.macdValue,
                signalValue: item.signalValue
                });
            });
            let ohlcData = data[0];
            let formattedData = ohlcData.map(item => {
                let macdObj = macdByTimestamp.get(item.timeEpochTimestamp);
                return {
                    timeStamp: item.timeEpochTimestamp * 1000,
                    time: new Date(item.timeEpochTimestamp * 1000),
                    open: item.openingPrice,
                    high: item.highPrice,
                    low: item.lowPrice,
                    close: item.closingPrice,
                    macd: macdObj ? macdObj.macdValue : undefined,
                    signal: macdObj ? macdObj.signalValue : undefined
                };
            });
            setData(formattedData);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);

    return (
      <React.Fragment>
        <section className={`container-fluid ${containerStyles.darkSection}`}>
          <div className="container">
            <div className="row">
              <div className="col-12 content quote">
                <p className={containerStyles.darkQuote}>
                  <i>MACD</i> : convergence et divergence des moyennes mobiles 
                  est un indicateur boursier qui participe de l'analyse technique 
                  et qui consiste en l’étude des graphiques de cours dans le but 
                  d'identifier les tendances et d'anticiper l'évolution des marchés. 
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className={containerStyles.wrapper}>
                        <div className={containerStyles.text}>
                          <p>
                          As stated by wikipedia , the trading strategy relies on the Signal-ligne crossovers: A “signal-line crossover” occurs when the MACD and Signal lines cross. The standard interpretation of such an event is a recommendation to buy if the MACD line crosses up through the average line (a “bullish” crossover), or to sell if it crosses down through the average line (a “bearish” crossover). These events are taken as indications that the trend in the stock is about to accelerate in the direction of the crossover.
                          </p>
                        </div>
                        <div className={containerStyles.chart}>
                          <OhlcMacdChart data={data} visual={visual} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      </React.Fragment>
      );
}