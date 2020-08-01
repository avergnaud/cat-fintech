import React, { useState, useEffect } from "react"
import { StaticQuery, graphql } from "gatsby"
import * as d3 from "d3"
import OhlcMacdChart from "../OhlcMacdChart/OhlcMacdChart"
import containerStyles from "./OhlcMacdChartContainer.module.scss"

export default function OhlcMacdChartContainer() {
  const [tradingData, setTradingData] = useState([])

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
  }

  useEffect(() => {
    /* component did mount */
    Promise.all([
      d3.json(
        "https://macd-definition.herokuapp.com/ohlc/?chartEntityId=2&last=100"
      ),
      d3.json(
        "https://macd-definition.herokuapp.com/macd/?macdDefinitionId=1&last=100"
      ),
    ])
      .then(jsonData => {
        const macdByTimestamp = new Map()
        jsonData[1].forEach(item => {
          macdByTimestamp.set(item.timeEpochTimestamp, {
            macdValue: item.macdValue,
            signalValue: item.signalValue,
          })
        })
        let ohlcData = jsonData[0]
        let formattedData = ohlcData.map(item => {
          let macdObj = macdByTimestamp.get(item.timeEpochTimestamp)
          return {
            timeStamp: item.timeEpochTimestamp * 1000,
            time: new Date(item.timeEpochTimestamp * 1000),
            open: item.openingPrice,
            high: item.highPrice,
            low: item.lowPrice,
            close: item.closingPrice,
            macd: macdObj ? macdObj.macdValue : undefined,
            signal: macdObj ? macdObj.signalValue : undefined,
          }
        })
        setTradingData(formattedData)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <StaticQuery
      query={graphql`
        query {
          contentfulMainSection(postId: { eq: 1 }) {
            misEnAvant {
              childMarkdownRemark {
                html
              }
            }
            texteSecondaire {
              childMarkdownRemark {
                html
              }
            }
          }
        }
      `}
      render={data => (
        <React.Fragment>
          <section className={`container-fluid ${containerStyles.darkSection}`}>
            <div className="container">
              <div className="row">
                <div className="col-12 content quote">
                  <p 
                    className={containerStyles.darkQuote}
                    dangerouslySetInnerHTML={{
                      __html: data.contentfulMainSection.misEnAvant.childMarkdownRemark.html,
                    }}
                  >
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
                    <p
                      dangerouslySetInnerHTML={{
                        __html: data.contentfulMainSection.texteSecondaire.childMarkdownRemark.html,
                      }}
                    >
                    </p>
                  </div>
                  <div className={containerStyles.chart}>
                    <OhlcMacdChart data={tradingData} visual={visual} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    />
  )
}
