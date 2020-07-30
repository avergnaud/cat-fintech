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

    const ms = new MacdSimulation();

    useEffect(() => {
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
                setNumberOfSims(macdData.length - 365);

                let newSimulations = [];
                const initialBalance = 100;
                const fees = 0.0026;
                let sumBeatMarket = 0;
                let sumMakeProfit = 0;
                for(let i = 0; i < macdData.length - 365; i++) {
                    let simulationData = macdData.slice(i, i + 365);
                    /* from, to */
                    const from = ms.formatDate(simulationData[0].date);
                    const to = ms.formatDate(simulationData[simulationData.length - 1].date);
                    let totalBalance = ms.computeMacdSimulation(initialBalance, fees, simulationData);
                    /* simulation performance */
                    let simulationPerformance = ms.performance(initialBalance, totalBalance);
                    let formattedSimulationPerformance = ms.formatPerf(simulationPerformance) + '%';
                    /* market performance */
                    const initialClosingPrice = simulationData[0].closingPrice;
                    const finalClosingPrice = simulationData[simulationData.length - 1].closingPrice;
                    let marketPerformance = ms.performance(initialClosingPrice, finalClosingPrice);
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
            });
      }, []);

    return (
        <React.Fragment>
            <section className={`container-fluid ${styles.darkSection}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 content quote">
                            <p className={styles.darkQuote}>
                                Résultats
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <p>
                            Données de marché comprises entre {rangeFrom} et {rangeTo}
                        </p>
                        <p>
                            {numberOfSims} simulations de 1 an de trading
                        </p>
                        <ul>
                            <li>{statBeatTheMarket} font mieux que le marché</li>
                            <li>{statMakeProfit} font du profit</li>
                        </ul>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
