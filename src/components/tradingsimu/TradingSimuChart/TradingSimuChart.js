import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { TradingSimuChartD3 } from "./TradingSimuChartD3";
import styles from "./TradingSimuChart.module.scss";

export default function TradingSimuChart(props) {

    const [signalsList, setSignalsList] = useState([]);
    const [performance, setPerformance] = useState("");

    const d3Container = useRef(null);

    /* from d3 to this React component */
    const updateSignalsList = (newList) => {
        setSignalsList(newList);
    };
    const updatePerformance = (perf) => {
        setPerformance(perf);
    }

    /* From this React component to d3 */
    const onSignalClick = (event, clickedSignal) => {
        event.preventDefault();
        d3.selectAll('.focus').dispatch('signal-click', {detail: clickedSignal})

        let newSignalsList = signalsList.filter(signal => signal.id !== clickedSignal.id);

        newSignalsList.forEach(signal => signal.selected = false);
        let newClickedSignal = {
            ...clickedSignal,
            selected: true
        };
        newSignalsList.push(newClickedSignal);
        newSignalsList.sort(function(a,b) {
            return new Date(a.date) - new Date(b.date);
        })
        setSignalsList(newSignalsList);
    }

    const chart = new TradingSimuChartD3({
        config: props.visual,
        cssClasses: {
            simuLine: styles.simuLine,
            simuBalanceLine: styles.simuBalanceLine,
            simuZoom: styles.simuZoom
        },
        updateSignalsList: updateSignalsList,
        onSignalClick: onSignalClick,
        updatePerformance: updatePerformance
    });

    useEffect(() => {
        
        if (props.data && props.data.length > 0 && d3Container.current) {
            
            chart.setElement(d3Container.current);
            chart.draw(props.data);
        }
    // eslint-disable-next-line
    }, [props.data]);

    const signals = signalsList.map(signal => {

        let liClasses = "list-group-item";
        let message = signal.date + ": ";
        if(signal.event === "BUY_SIGNAL") {
            liClasses += " list-group-item-success";
            if(signal.selected) {
                liClasses += ` ${styles.selectedBuy}`;
            }
            message += `Buying ${signal.amount}ETH for ${signal.closingPrice}€ `;
        } else {
            liClasses += " list-group-item-danger";
            message += `Selling ${signal.quantitySold}ETH for ${signal.closingPrice}€ `;
            if(signal.selected) {
                liClasses += ` ${styles.selectedSell}`;
            }
        }
        
        message += `(payed fees ${signal.payedFees}€) `;
        message += `. Balance: ${signal.balance}€ `;

        return (
            <li 
                key={signal.date} 
                className={liClasses}
                onClick={e => onSignalClick(e, signal)}
                onKeyDown={e => onSignalClick(e, signal)}
            >
                {message}
            </li>
        );
    });

    return (
        <React.Fragment>
            <div className={styles.performance}>
                <h5>{performance}</h5>
            </div>
            <div ref={d3Container}>Loading...</div>
            <div className={styles.fixedHeightContainer}>
                <div className={styles.scrollableContent}>
                    <ul className={`${styles.customUl} list-group`}>
                        {signals}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    )
}