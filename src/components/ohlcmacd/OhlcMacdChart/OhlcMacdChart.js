import React, { useRef, useEffect, useState } from "react";
import * as d3 from 'd3';
import { OhlcMacdChartD3 } from './OhlcMacdChartD3';
import styles from './OhlcMacdChart.module.scss';

export default function OhlcMacdChart(props) {

    const d3Container = useRef(null);
    const [toolTip, setToolTip] = useState("");

    const onOver = d => {
        setToolTip(timeFormat(d.time) + ", close: " + d.close + "€");
    }
    const onOut = () => {
        setToolTip("");
    }
    const chart = new OhlcMacdChartD3({
        config: props.visual,
        onOver: onOver,
        onOut: onOut
      });

    const timeFormat = d3.timeFormat(props.visual.timeFormat);

    useEffect(() => {
        
        if (props.data && props.data.length > 0 && d3Container.current) {
            
            chart.setElement(d3Container.current);
            chart.draw(props.data);
        }
    // eslint-disable-next-line
    }, [props.data]);


    return <React.Fragment>
            <div className={styles.ToolTip}>{toolTip}</div>
            <div ref={d3Container}>Loading...</div>
        </React.Fragment>;
}