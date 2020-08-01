import React, { useState, useEffect } from "react";
import { MacdSimulation } from "../../../utils/MacdSimulation";
import styles from "./TradingSimuStats.module.scss";

export default function TradingSimuStats() {

    const [simulations, setSimulations] = useState([]);
    const [rangeFrom, setRangeFrom] = useState("");
    const [rangeTo, setRangeTo] = useState("");
    const [numberOfSims, setNumberOfSims] = useState(null);
    const [statMakeProfit, setStatMakeProfit] = useState(null);
    const [statBeatTheMarket, setStatBeatTheMarket] = useState(null);
    const [avgMarketPerformance, setAvgMarketPerformance] = useState(null);
    const [avgSimulationsPerformance, setAvgSimulationsPerformance] = useState(null);

    useEffect(() => {

        const ms = new MacdSimulation();
        /* component did mount */
        fetch("https://macd-definition.herokuapp.com/macd/?macdDefinitionId=1")
            .then((data) => data.json())
            .then((json) => {

                /* skip the first incomplete items (before 12+26+9) */
                json = json.filter((item) => item.macdValue && item.signalValue);
                let macdData = json.map((item) => ({
                ...item,
                date: new Date(item.timeEpochTimestamp * 1000),
                }));
                macdData.sort((a, b) => a.timeEpochTimestamp - b.timeEpochTimestamp);

                setRangeFrom(ms.formatDate(macdData[0].date));
                setRangeTo(ms.formatDate(macdData[macdData.length - 1].date));
                const nos = macdData.length - 365;
                setNumberOfSims(nos);

                let newSimulations = [];
                const initialBalance = 100;
                const fees = 0.0026;
                let sumBeatMarket = 0;
                let sumMakeProfit = 0;
                let sumMarketPerformances = 0;
                let sumSimulationsPerformances = 0;
                for(let i = 0; i < nos; i++) {
                    let simulationData = macdData.slice(i, i + 365);
                    /* from, to */
                    const from = ms.formatDate(simulationData[0].date);
                    const to = ms.formatDate(simulationData[simulationData.length - 1].date);
                    let totalBalance = ms.computeMacdSimulation(initialBalance, fees, simulationData);
                    /* simulation performance */
                    let simulationPerformance = ms.performance(initialBalance, totalBalance);
                    sumSimulationsPerformances += simulationPerformance;
                    let formattedSimulationPerformance = ms.formatPerf(simulationPerformance) + '%';
                    /* market performance */
                    const initialClosingPrice = simulationData[0].closingPrice;
                    const finalClosingPrice = simulationData[simulationData.length - 1].closingPrice;
                    let marketPerformance = ms.performance(initialClosingPrice, finalClosingPrice);
                    sumMarketPerformances += marketPerformance;
                    let formattedMarketPerformance = ms.formatPerf(marketPerformance) + '%';
                    /* beats the market */
                    let beatsTheMarket = false;
                    if(simulationPerformance > marketPerformance) {
                        beatsTheMarket = true;
                        sumBeatMarket++;
                    } 
                    /* makes a profit */
                    let makesAProfit = false;
                    if(simulationPerformance > 0) {
                        makesAProfit = true;
                        sumMakeProfit++;
                    }

                    newSimulations.push({
                        from: from,
                        to: to,
                        marketPerf: formattedMarketPerformance,
                        tradingPerf: formattedSimulationPerformance,
                        beatsTheMarket: beatsTheMarket,
                        makesAProfit: makesAProfit
                    });
                }/* end for */
                setStatMakeProfit(sumMakeProfit);
                setStatBeatTheMarket(sumBeatMarket);
                setSimulations(newSimulations);
                const averageSimulationsPerformance = ms.formatPerf(
                    (sumSimulationsPerformances / nos).toFixed(0)
                ) + "%";
                setAvgSimulationsPerformance(averageSimulationsPerformance);
                const averageMarketPerformance = ms.formatPerf
                    ((sumMarketPerformances / nos).toFixed(0)
                ) + "%";
                setAvgMarketPerformance(averageMarketPerformance);
            });
      }, []);

      const simulationsRows = simulations.map((simulation, index) => (
          <tr key={index}>
              <td>{simulation.from}</td>
              <td>{simulation.to}</td>
              <td>{simulation.marketPerf}</td>
              <td>{simulation.tradingPerf}</td>
              <td>{simulation.beatsTheMarket.toString()}</td>
              <td>{simulation.makesAProfit.toString()}</td>
          </tr>
      ));

    return (
        <React.Fragment>
            <section className={`container-fluid ${styles.darkSection}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 content quote">
                            <div className={styles.darkQuote}>
                                <b>Résultats</b> avec des données de marché comprises entre :
                                <ul style={{ margin: "25px 100px" }}>
                                    <li>{rangeFrom}</li>
                                    <li>et {rangeTo}</li>
                                </ul>
                                Pour {numberOfSims} simulations de 1 an de trading...
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="jumbotron">
                        <h5 className="display-5">Performance moyenne de trading
                          &nbsp;<span className="badge badge-success">{avgSimulationsPerformance}</span>
                        </h5>
                        <p className="lead">
                            contre <span className="badge">{avgMarketPerformance}</span> pour le marché
                        </p>
                        <hr className="my-4"></hr>
                            <div>
                                <ul>
                                    <li>{statBeatTheMarket} / {numberOfSims} font mieux que le marché</li>
                                    <li>{statMakeProfit} / {numberOfSims} font du profit</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className={styles.tableFixHeadContainer}>
                            Détail :
                            <table className={`${styles.tableFixHead} table table-sm`}>
                                <thead>
                                    <tr>
                                        <th scope="col">From</th>
                                        <th scope="col">To</th>
                                        <th scope="col">Market Perf</th>
                                        <th scope="col">Trading Perf</th>
                                        <th scope="col">Beats the market</th>
                                        <th scope="col">Makes a profit</th>
                                    </tr>
                                </thead>
                                <tbody id="results-tbody">
                                    {simulationsRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
