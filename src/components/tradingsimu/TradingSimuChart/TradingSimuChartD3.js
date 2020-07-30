import * as d3 from "d3"
import { MacdSimulation } from "../../../utils/MacdSimulation"

export class TradingSimuChartD3 {
  constructor(opts) {
    this.macdSimulation = new MacdSimulation()

    this.config = opts.config
    this.margin = this.config.margin
    this.margin2 = this.config.margin2
    this.width = this.config.outerWidth - this.margin.left - this.margin.right
    this.height = this.config.outerHeight - this.margin.top - this.margin.bottom
    this.height2 =
      this.config.outerHeight2 - this.margin2.top - this.margin2.bottom
    this.legendOffset = this.config.legendOffset
    this.yMargin = this.config.yMargin

    /* css module classes */
    let cssClasses = opts.cssClasses
    this.simuLineClass = cssClasses.simuLine
    this.simuBalanceLineClass = cssClasses.simuBalanceLine
    this.simuZoomClass = cssClasses.simuZoom

    /* */
    this.updateSignalsList = opts.updateSignalsList
    this.onSignalClick = opts.onSignalClick
    this.updatePerformance = opts.updatePerformance
  }

  setElement(element) {
    this.element = element
  }

  draw(newData) {
    this.element.innerHTML = ""

    this.setupElements()

    this.createScales(newData)
    this.addAxes()

    this.closingPriceLine1 = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x(d => this.x(d.date))
      .y(d => this.y(d.closingPrice))

    this.closingPriceLine2 = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x(d => this.x2(d.date))
      .y(d => this.y2(d.closingPrice))

    this.zoom.on("zoom", () => this.zoomed(newData))

    this.focus
      .append("path")
      .datum(newData)
      .attr("class", this.simuLineClass)
      .attr("d", this.closingPriceLine1)

    this.focus
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis)

    this.yAxisG.call(this.yAxisLeft)
    this.yAxisRightG.call(this.yAxisRight)

    this.context
      .append("path")
      .datum(newData)
      .attr("class", this.simuLineClass)
      .attr("d", this.closingPriceLine2)

    this.context
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height2 + ")")
      .call(this.xAxis2)

    this.context
      .append("g")
      .attr("class", "brush")
      .call(this.brush)
      .call(this.brush.move, this.x.range())

    this.svg
      .append("rect")
      .attr("class", this.simuZoomClass)
      .attr("width", this.width)
      .attr("height", this.height)
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      )
      .call(this.zoom)

    const now = new Date()
    let oneYearBefore = new Date()
    oneYearBefore = oneYearBefore.setFullYear(now.getFullYear() - 1)
    this.updateGraphs([this.x2(oneYearBefore), this.x2(now)])
  }

  /**
   * static elements (do not depend on newData)
   */
  setupElements() {
    this.svg = d3
      .select(this.element)
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${this.width + this.margin.left + this.margin.right} ${
          this.height + this.margin.top + this.margin.bottom
        }`
      )

    this.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", this.width)
      .attr("height", this.height)

    this.focus = this.svg
      .append("g")
      .attr("class", "focus")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      )
      .on("signal-click", function (d, i) {
        var signal = d3.event.detail
        d3.selectAll("circle.trading-event").remove()
        let color = "red"
        if (signal.event === "BUY_SIGNAL") {
          color = "green"
        }
        d3.select(this)
          .append("circle")
          .attr("id", signal.id)
          .attr("class", "trading-event")
          .attr("cx", () => signal.x)
          .attr("cy", () => signal.y)
          .attr("r", 10)
          .style("fill", color)
          .style("fill-opacity", 0.4)
          .style("stroke", color)
      })

    this.context = this.svg
      .append("g")
      .attr("class", "context")
      .attr(
        "transform",
        "translate(" + this.margin2.left + "," + this.margin2.top + ")"
      )

    this.identity = d3.zoomIdentity

    this.brush = d3
      .brushX()
      .extent([
        [0, 0],
        [this.width, this.height2],
      ])
      .on("brush end", this.brushed.bind(this))

    this.zoom = d3
      .zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([
        [0, 0],
        [this.width, this.height],
      ])
      .extent([
        [0, 0],
        [this.width, this.height],
      ])

    this.drawLegend()
  }

  createScales(data) {
    this.x = d3.scaleTime().range([0, this.width])
    this.y = d3.scaleLinear().range([this.height, 0])
    this.yBalance = d3.scaleLinear().range([this.height, 0])
    this.x2 = d3.scaleTime().range([0, this.width])
    this.y2 = d3.scaleLinear().range([this.height2, 0])

    this.x.domain(
      d3.extent(data, function (d) {
        return d.date
      })
    )
    let yMin = d3.min(data, d => d.closingPrice) - this.yMargin
    let yMax = d3.max(data, d => d.closingPrice) + this.yMargin
    this.y.domain([yMin, yMax])
    this.yBalance.domain([0, 100])
    this.x2.domain(this.x.domain())
    this.y2.domain(this.y.domain())
  }

  addAxes() {
    this.xAxis = d3.axisBottom(this.x)
    this.yAxisLeft = d3.axisLeft(this.y).tickFormat(d => d + "€")
    this.yAxisRight = d3.axisRight(this.yBalance)
    this.xAxis2 = d3.axisBottom(this.x2)

    this.yAxisG = this.focus.append("g").attr("class", "axis axis--y")

    this.yAxisRightG = this.focus
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + this.width + " ,0)")
  }

  drawLegend() {
    /* legends */
    this.svg
      .append("line")
      .attr("x1", 5)
      .attr("y1", this.legendOffset)
      .attr("x2", 25)
      .attr("y2", this.legendOffset)
      .style("stroke-width", 4)
      .style("stroke", "steelblue")
      .style("fill", "none")
    this.svg
      .append("text")
      .attr("x", 30)
      .attr("y", this.legendOffset + 5)
      .text("ETHEUR market price")
      .style("font-size", "1rem")
    this.signalsLegendG = this.svg
      .append("g")
      .attr("transform", `translate(${this.width / 2}, ${this.legendOffset})`)
    this.signalsLegendG
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 6)
      .style("fill", "green")
    this.signalsLegendG
      .append("text")
      .attr("x", 15)
      .attr("y", 5)
      .text("Buy Signal")
      .style("font-size", "1rem")
    this.signalsLegendG
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 25)
      .attr("r", 6)
      .style("fill", "red")
    this.signalsLegendG
      .append("text")
      .attr("x", 15)
      .attr("y", 30)
      .text("Sell Signal")
      .style("font-size", "1rem")
    this.svg
      .append("line")
      .attr("x1", this.width - 135)
      .attr("y1", this.legendOffset)
      .attr("x2", this.width - 115)
      .attr("y2", this.legendOffset)
      .style("stroke-width", 4)
      .style("stroke", "#cfb53b")
      .style("fill", "none")
    this.svg
      .append("text")
      .attr("x", this.width - 110)
      .attr("y", this.legendOffset + 5)
      .text("Balance (base 100)")
      .style("font-size", "1rem")
  }

  /**
   * programmatically update the graphs
   * @param {*} s Array of two elements. Exemple [ 445, 890 ]
   */
  updateGraphs(s) {
    /* set a new x scale domain */ debugger
    this.x.domain(
      s.map(this.x2.invert, this.x2)
    ) 
    /* update the closingPriceLine1 and axis */
    this.focus
      .select(`.${this.simuLineClass}`)
      .attr("d", this.closingPriceLine1)
    this.focus.select(".axis--x").call(this.xAxis)
    this.svg
      .select(`.${this.simuZoomClass}`)
      .call(
        this.zoom.transform,
        d3.zoomIdentity.scale(this.width / (s[1] - s[0])).translate(-s[0], 0)
      )
  }

  /*
    updates the scale using d3.zoomIdentity, it must do this as it needs to update the 
    zoom function to reflect the current zoom scale and transform.
  */
  brushed() {
    /* check to see if the main body of the function should be executed */
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return // ignore brush-by-zoom
    var s = d3.event.selection || this.x2.range()
    this.updateGraphs(s)
  }

  /*
    manually sets the brush, it must do this because the brush needs to be updated.
  */
  zoomed(json) {
    /* check to see if the main body of the function should be executed */
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return // ignore zoom-by-brush
    /* set a new x scale domain */
    var t = d3.event.transform
    this.x.domain(t.rescaleX(this.x2).domain())

    /* visibleData: data to compute MACD */
    const [dateMin, dateMax] = this.x.domain()
    let visibleData = json.slice()
    visibleData.sort((a, b) => a.timeEpochTimestamp - b.timeEpochTimestamp)
    visibleData = visibleData.filter(
      (element, index) => dateMin <= element.date && element.date <= dateMax
    )

    /* updates y scale for the main graph */
    let yMin = d3.min(visibleData, d => d.closingPrice) - this.yMargin
    let yMax = d3.max(visibleData, d => d.closingPrice) + this.yMargin
    this.y.domain([yMin, yMax])
    this.yAxisG.call(this.yAxisLeft)

    /* update the closingPriceLine1 and axis */
    this.closingPriceLine1.y(d => this.y(d.closingPrice))
    this.focus
      .select(`.${this.simuLineClass}`)
      .attr("d", this.closingPriceLine1)
    this.focus.select(".axis--x").call(this.xAxis)

    /* update the balance line */
    const initialBalance = 100
    const fees = 0.0026
    let totalBalance = this.macdSimulation.computeMacdSimulation(
      initialBalance,
      fees,
      visibleData
    )

    let yBalanceMax = d3.max(visibleData, d => d.trading.balance) + this.yMargin
    this.yBalance.domain([0, yBalanceMax])
    this.yAxisRightG.call(this.yAxisRight)

    /* recrée la balanceLine */
    var balanceLine = d3
      .line()
      .x(d => this.x(d.date))
      .y(d => this.yBalance(d.trading.balance))
    var baselineBalanceLine = d3
      .line()
      .x(d => this.x(d.date))
      .y(d => this.yBalance(initialBalance))

    this.focus.selectAll(`.${this.simuBalanceLineClass}`).remove()
    this.focus
      .append("path")
      .datum(visibleData)
      .attr("class", this.simuBalanceLineClass)
      .attr("d", balanceLine)
    this.focus
      .append("path")
      .datum(visibleData)
      .attr("class", this.simuBalanceLineClass)
      .style("stroke-dasharray", "3, 3")
      .attr("d", baselineBalanceLine)

    let botPerformance = this.macdSimulation.formatPerf(
      this.macdSimulation.performance(initialBalance, totalBalance)
    )
    const initialClosingPrice = visibleData[0].closingPrice
    const finalClosingPrice = visibleData[visibleData.length - 1].closingPrice
    let marketPerformance = this.macdSimulation.formatPerf(
      this.macdSimulation.performance(initialClosingPrice, finalClosingPrice)
    )

    this.updatePerformance(
      `profit ${botPerformance}% / market ${marketPerformance}%`
    )

    this.context
      .select(".brush")
      .call(this.brush.move, this.x.range().map(t.invertX, t))

    this.focus.selectAll("circle").remove()

    let signalsList = []
    let visited = false
    /* trading events */
    for (let item of visibleData) {
      if (item.trading && item.trading.event) {
        const itemDate = this.macdSimulation.formatDate(item.date)
        const id = `${itemDate}_${item.trading.event}`

        let signal = {
          id: id,
          date: this.macdSimulation.formatDate(item.date),
          event: item.trading.event,
          amount: item.trading.cryptoBalance.toFixed(2),
          closingPrice: item.closingPrice.toFixed(2),
          payedFees: item.trading.payedFees.toFixed(2),
          balance: item.trading.balance.toFixed(2),
          x: this.x(item.date),
          y: this.y(item.closingPrice),
        }
        if (item.trading.quantitySold) {
          signal.quantitySold = item.trading.quantitySold.toFixed(2)
        }
        if (item.trading.amountSpent) {
          signal.amountSpent = item.trading.amountSpent.toFixed(2)
        }
        signalsList.push(signal)
        let color = "red"
        if (item.trading.event === "BUY_SIGNAL") {
          color = "green"
        }

        /* first one is highlighted */
        const itemX = this.x(item.date)
        const itemY = this.y(item.closingPrice)
        if (!visited) {
          d3.selectAll("circle.trading-event").remove()

          this.focus
            .append("circle")
            .attr("id", id)
            .attr("class", "trading-event")
            .attr("cx", () => itemX)
            .attr("cy", () => itemY)
            .attr("r", 10)
            .style("fill", color)
            .style("fill-opacity", 0.4)
            .style("stroke", color)

          visited = true
        }

        /* dots on the graph */
        this.focus
          .append("circle")
          .attr("id", id)
          .attr("cx", () => this.x(item.date))
          .attr("cy", () => this.y(item.closingPrice))
          .attr("r", 5)
          .style("fill", color)
      }
    }
    this.updateSignalsList(signalsList)
  }
}
