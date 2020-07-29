import React, { useRef, useEffect } from "react";
import { TradingSimuChartD3 } from "./TradingSimuChartD3";
import styles from "./TradingSimuChart.module.scss";

export default function TradingSimuChart(props) {

    const d3Container = useRef(null);

    const chart = new TradingSimuChartD3({
        config: props.visual,
        cssClasses: {
            simuLine: styles.simuLine,
            simuBalanceLine: styles.simuBalanceLine,
            simuZoom: styles.simuZoom
        }
    });

    useEffect(() => {
        
        if (props.data && props.data.length > 0 && d3Container.current) {
            
            chart.setElement(d3Container.current);
            chart.draw(props.data);
        }
    // eslint-disable-next-line
    }, [props.data]);

    return <div ref={d3Container}>Loading...</div>
}