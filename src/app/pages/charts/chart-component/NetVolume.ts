//   import { IPineStudyResult, LibraryPineStudy, RawStudyMetaInfoId, StudyMetaInfo, StudyPlotType } from "src/assets/charting_library/charting_library";
 
 
//   interface Indicator {
//     name: string;
//     format: string;
//     // Define other properties of the indicator as needed
// }

// const volumeDeltaIndicator: Indicator = {
//     name: "Volume Delta",
//     format: "volume",
//     // Define other properties of the indicator as needed
// };

// const upAndDownVolume = (): number => {
//     let posVol = 0.0;
//     let negVol = 0.0;
//     let isBuyVolume = true;

//     switch (true) {
//         case close > open:
//             isBuyVolume = true;
//             break;
//         case close < open:
//             isBuyVolume = false;
//             break;
//         case close > close[1]:
//             isBuyVolume = true;
//             break;
//         case close < close[1]:
//             isBuyVolume = false;
//             break;
//     }

//     if (isBuyVolume)
//         posVol += volume;
//     else
//         negVol -= volume;

//     return posVol + negVol;
// };

// const lowerTimeframe: string = useCustomTimeframeInput ? lowerTimeframeInput : (
//     timeframe.isseconds ? "1S" :
//     timeframe.isintraday ? "1" :
//     timeframe.isdaily ? "5" :
//     "60"
// );

// const diffVolArray: number[] = request.security_lower_tf(syminfo.tickerid, lowerTimeframe, upAndDownVolume);

// const getHighLow = (arr: number[]): [number, number, number] => {
//     let cumVolume = 0.0;
//     let maxVolume = 0.0;
//     let minVolume = 0.0;

//     for (const item of arr) {
//         cumVolume += item;
//         maxVolume = Math.max(maxVolume, cumVolume);
//         minVolume = Math.min(minVolume, cumVolume);
//     }

//     return [maxVolume, minVolume, cumVolume];
// };

// const [maxVolume, minVolume, lastVolume]: [number, number, number] = getHighLow(diffVolArray);
// const col: string = lastVolume > 0 ? "#008000" : "#FF0000";

// const plotConfig = {
//     type: "candlestick",
//     data: [
//         { time: 0, high: maxVolume, low: minVolume, open: 0, close: lastVolume }
//     ],
//     options: {
//         borderColor: col,
//         wickColor: col,
//         color: col
//     }
// };

// // Display plotConfig on the chart, using Charting Library's API

// // const name: string = "Net Volume";
// // const metainfo: StudyMetaInfo = {
// //   _metainfoVersion: 52,
// //   is_hidden_study: false,
// //   defaults: {
// //     styles: {
// //       plot_0: {
// //         linestyle: 0,
// //         linewidth: 1,
// //         plottype: 0,
// //         trackPrice: false,
// //         transparency: 0,
// //         visible: true,
// //         color: "#2196F3"
// //       }
// //     },
// //     inputs: {}
// //   },
// //   plots: [{
// //     id: "plot_0",
// //     type: StudyPlotType.Line 
// //   }],
// //   styles: {
// //     plot_0: {
// //       title: "Plot",
// //       histogramBase: 0,
// //       joinPoints: false
// //     }
// //   },
// //   description: "Net Volume",
// //   shortDescription: "Net Volume",
// //   is_price_study: false,
// //   inputs: [],
// //   id: "Net Volume@tv-basicstudies-1"as RawStudyMetaInfoId,
// //   name: "Net Volume",
// //   format: {
// //     type: "volume"
// //   }
// // };

// // class NetVolume {
// //   private _context: any;
// //   private _input: any;

// //   constructor: function (this: LibraryPineStudy<IPineStudyResult>) {
// //     this.init = function (context, inputCallback) {
// //         console.log(context);
// //         this._context = context;
// //         this._input = inputCallback;
// //     this.f_0 = function(e: number, t: number, i: number): number {
// //       return r.gt(e, 0) ? t : r.lt(i, 0) ? -t : 0 * t;
// //     };

// //     this.main = function(context, inputCallback): number[] {
// //       this._context = e;
// //       this._input = t;
// //       const i = r.close(this._context);
// //       const s = this._context.new_var(i);
// //       const n = r.change(s);
// //       return [this.f_0(n, r.volume(this._context), n)];
// //     };
// //   }
// // }