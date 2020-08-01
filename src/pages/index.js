import React from "react"
import { graphql } from "gatsby"
import Container from "../components/container/container"
import OhlcMacdChartContainer from "../components/ohlcmacd/OhlcMacdChartContainer/OhlcMacdChartContainer"
import TradingSimuChartContainer from "../components/tradingsimu/TradingSimuChartContainer/TradingSimuChartContainer"
import TradingSimuStats from "../components/tradingsimu/TradingSimuStats/TradingSimuStats"
import indexStyles from "./index.module.scss"

export default function Home({ data }) {
  return (
    <Container>
        {data.allContentfulFrontCover.edges.map(({ node }) => (
          <section key={node.id} className={indexStyles.frontSection}>
              <div 
                className={indexStyles.parallax}
                style={{backgroundImage: `url(${node.image.file.url})`}}
              ></div>
              <div className={indexStyles.description}>
                <div className={indexStyles.titleContainer}>
                  <div className={indexStyles.title}>
                    {node.title}
                  </div>
                  <hr></hr>
                  <div className={indexStyles.subtitle}>
                    {node.subtitle}
                  </div>
                </div>
              </div>
            </section>
          ))}
          <OhlcMacdChartContainer />
          <TradingSimuChartContainer />
          <TradingSimuStats />
          <hr />
    </Container>
  )
}

export const query = graphql`
  query {
    allContentfulFrontCover {
      edges {
        node {
          image {
            title
            file {
              url
            }
          }
          id
          title
          subtitle
        }
      }
    }
  }
`
