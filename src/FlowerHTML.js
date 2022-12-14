// import { forwardRef } from "react";

// export const FlowerHTML = forwardRef(({}, ref) => (
//   <div ref={ref} id="rootflower" className="flower-container">
//     <div className="gline-container left-gl top-gl" id="tl-glc">
//       <div className="line-item" id="tl-line-01"></div>
//       <div className="line-item" id="tl-line-02"></div>
//       <div className="line-item" id="tl-line-03"></div>
//       <div className="line-item" id="tl-line-04"></div>
//       <div className="line-item" id="tl-line-05"></div>
//       <div className="line-item" id="tl-line-06"></div>
//       <div className="line-item" id="tl-line-07"></div>
//       <div className="line-item" id="tl-line-08"></div>
//       <div className="line-item" id="tl-line-09"></div>
//       <div className="line-item" id="tl-line-10"></div>
//       <div className="line-item" id="tl-line-11"></div>
//       <div className="line-item" id="tl-line-12"></div>
//       <div className="line-item" id="tl-line-13"></div>
//       <div className="line-item" id="tl-line-14"></div>
//       <div className="line-item" id="tl-line-15"></div>
//       <div className="line-item" id="tl-line-16"></div>
//       <div className="line-item" id="tl-line-17"></div>
//       <div className="line-item" id="tl-line-18"></div>
//       <div className="line-item" id="tl-line-19"></div>
//       <div className="line-item" id="tl-line-20"></div>
//       <div className="line-item" id="tl-line-21"></div>
//       <div className="line-item" id="tl-line-22"></div>
//       <div className="line-item" id="tl-line-23"></div>
//       <div className="line-item" id="tl-line-24"></div>
//       <div className="line-item" id="tl-line-25"></div>
//       <div className="line-item" id="tl-line-26"></div>
//       <div className="line-item" id="tl-line-27"></div>
//       <div className="line-item" id="tl-line-28"></div>
//       <div className="line-item" id="tl-line-29"></div>
//       <div className="line-item" id="tl-line-30"></div>
//       <div className="line-item" id="tl-line-31"></div>
//       <div className="line-item" id="tl-line-32"></div>
//       <div className="line-item" id="tl-line-33"></div>
//       <div className="line-item" id="tl-line-34"></div>
//       <div className="line-item" id="tl-line-35"></div>
//       <div className="line-item" id="tl-line-36"></div>
//       <div className="line-item" id="tl-line-37"></div>
//       <div className="line-item" id="tl-line-38"></div>
//       <div className="line-item" id="tl-line-39"></div>
//       <div className="line-item" id="tl-line-40"></div>
//       <div className="line-item" id="tl-line-41"></div>
//       <div className="line-item" id="tl-line-42"></div>
//       <div className="line-item" id="tl-line-43"></div>
//       <div className="line-item" id="tl-line-44"></div>
//       <div className="line-item" id="tl-line-45"></div>
//       <div className="line-item" id="tl-line-46"></div>
//       <div className="line-item" id="tl-line-47"></div>
//       <div className="line-item" id="tl-line-48"></div>
//       <div className="line-item" id="tl-line-49"></div>
//       <div className="line-item" id="tl-line-50"></div>
//     </div>
//     <div className="gline-container left-gl bottom-gl" id="bl-glc">
//       <div className="line-item" id="bl-line-01"></div>
//       <div className="line-item" id="bl-line-02"></div>
//       <div className="line-item" id="bl-line-03"></div>
//       <div className="line-item" id="bl-line-04"></div>
//       <div className="line-item" id="bl-line-05"></div>
//       <div className="line-item" id="bl-line-06"></div>
//       <div className="line-item" id="bl-line-07"></div>
//       <div className="line-item" id="bl-line-08"></div>
//       <div className="line-item" id="bl-line-09"></div>
//       <div className="line-item" id="bl-line-10"></div>
//       <div className="line-item" id="bl-line-11"></div>
//       <div className="line-item" id="bl-line-12"></div>
//       <div className="line-item" id="bl-line-13"></div>
//       <div className="line-item" id="bl-line-14"></div>
//       <div className="line-item" id="bl-line-15"></div>
//       <div className="line-item" id="bl-line-16"></div>
//       <div className="line-item" id="bl-line-17"></div>
//       <div className="line-item" id="bl-line-18"></div>
//       <div className="line-item" id="bl-line-19"></div>
//       <div className="line-item" id="bl-line-20"></div>
//       <div className="line-item" id="bl-line-21"></div>
//       <div className="line-item" id="bl-line-22"></div>
//       <div className="line-item" id="bl-line-23"></div>
//       <div className="line-item" id="bl-line-24"></div>
//       <div className="line-item" id="bl-line-25"></div>
//       <div className="line-item" id="bl-line-26"></div>
//       <div className="line-item" id="bl-line-27"></div>
//       <div className="line-item" id="bl-line-28"></div>
//       <div className="line-item" id="bl-line-29"></div>
//       <div className="line-item" id="bl-line-30"></div>
//       <div className="line-item" id="bl-line-31"></div>
//       <div className="line-item" id="bl-line-32"></div>
//       <div className="line-item" id="bl-line-33"></div>
//       <div className="line-item" id="bl-line-34"></div>
//       <div className="line-item" id="bl-line-35"></div>
//       <div className="line-item" id="bl-line-36"></div>
//       <div className="line-item" id="bl-line-37"></div>
//       <div className="line-item" id="bl-line-38"></div>
//       <div className="line-item" id="bl-line-39"></div>
//       <div className="line-item" id="bl-line-40"></div>
//       <div className="line-item" id="bl-line-41"></div>
//       <div className="line-item" id="bl-line-42"></div>
//       <div className="line-item" id="bl-line-43"></div>
//       <div className="line-item" id="bl-line-44"></div>
//       <div className="line-item" id="bl-line-45"></div>
//       <div className="line-item" id="bl-line-46"></div>
//       <div className="line-item" id="bl-line-47"></div>
//       <div className="line-item" id="bl-line-48"></div>
//       <div className="line-item" id="bl-line-49"></div>
//       <div className="line-item" id="bl-line-50"></div>
//     </div>

//     <div className="gline-container right-gl top-gl" id="tr-glc">
//       <div className="line-item" id="tr-line-01"></div>
//       <div className="line-item" id="tr-line-02"></div>
//       <div className="line-item" id="tr-line-03"></div>
//       <div className="line-item" id="tr-line-04"></div>
//       <div className="line-item" id="tr-line-05"></div>
//       <div className="line-item" id="tr-line-06"></div>
//       <div className="line-item" id="tr-line-07"></div>
//       <div className="line-item" id="tr-line-08"></div>
//       <div className="line-item" id="tr-line-09"></div>
//       <div className="line-item" id="tr-line-10"></div>
//       <div className="line-item" id="tr-line-11"></div>
//       <div className="line-item" id="tr-line-12"></div>
//       <div className="line-item" id="tr-line-13"></div>
//       <div className="line-item" id="tr-line-14"></div>
//       <div className="line-item" id="tr-line-15"></div>
//       <div className="line-item" id="tr-line-16"></div>
//       <div className="line-item" id="tr-line-17"></div>
//       <div className="line-item" id="tr-line-18"></div>
//       <div className="line-item" id="tr-line-19"></div>
//       <div className="line-item" id="tr-line-20"></div>
//       <div className="line-item" id="tr-line-21"></div>
//       <div className="line-item" id="tr-line-22"></div>
//       <div className="line-item" id="tr-line-23"></div>
//       <div className="line-item" id="tr-line-24"></div>
//       <div className="line-item" id="tr-line-25"></div>
//       <div className="line-item" id="tr-line-26"></div>
//       <div className="line-item" id="tr-line-27"></div>
//       <div className="line-item" id="tr-line-28"></div>
//       <div className="line-item" id="tr-line-29"></div>
//       <div className="line-item" id="tr-line-30"></div>
//       <div className="line-item" id="tr-line-31"></div>
//       <div className="line-item" id="tr-line-32"></div>
//       <div className="line-item" id="tr-line-33"></div>
//       <div className="line-item" id="tr-line-34"></div>
//       <div className="line-item" id="tr-line-35"></div>
//       <div className="line-item" id="tr-line-36"></div>
//       <div className="line-item" id="tr-line-37"></div>
//       <div className="line-item" id="tr-line-38"></div>
//       <div className="line-item" id="tr-line-39"></div>
//       <div className="line-item" id="tr-line-40"></div>
//       <div className="line-item" id="tr-line-41"></div>
//       <div className="line-item" id="tr-line-42"></div>
//       <div className="line-item" id="tr-line-43"></div>
//       <div className="line-item" id="tr-line-44"></div>
//       <div className="line-item" id="tr-line-45"></div>
//       <div className="line-item" id="tr-line-46"></div>
//       <div className="line-item" id="tr-line-47"></div>
//       <div className="line-item" id="tr-line-48"></div>
//       <div className="line-item" id="tr-line-49"></div>
//       <div className="line-item" id="tr-line-50"></div>
//     </div>
//     <div className="gline-container right-gl bottom-gl" id="br-glc">
//       <div className="line-item" id="br-line-01"></div>
//       <div className="line-item" id="br-line-02"></div>
//       <div className="line-item" id="br-line-03"></div>
//       <div className="line-item" id="br-line-04"></div>
//       <div className="line-item" id="br-line-05"></div>
//       <div className="line-item" id="br-line-06"></div>
//       <div className="line-item" id="br-line-07"></div>
//       <div className="line-item" id="br-line-08"></div>
//       <div className="line-item" id="br-line-09"></div>
//       <div className="line-item" id="br-line-10"></div>
//       <div className="line-item" id="br-line-11"></div>
//       <div className="line-item" id="br-line-12"></div>
//       <div className="line-item" id="br-line-13"></div>
//       <div className="line-item" id="br-line-14"></div>
//       <div className="line-item" id="br-line-15"></div>
//       <div className="line-item" id="br-line-16"></div>
//       <div className="line-item" id="br-line-17"></div>
//       <div className="line-item" id="br-line-18"></div>
//       <div className="line-item" id="br-line-19"></div>
//       <div className="line-item" id="br-line-20"></div>
//       <div className="line-item" id="br-line-21"></div>
//       <div className="line-item" id="br-line-22"></div>
//       <div className="line-item" id="br-line-23"></div>
//       <div className="line-item" id="br-line-24"></div>
//       <div className="line-item" id="br-line-25"></div>
//       <div className="line-item" id="br-line-26"></div>
//       <div className="line-item" id="br-line-27"></div>
//       <div className="line-item" id="br-line-28"></div>
//       <div className="line-item" id="br-line-29"></div>
//       <div className="line-item" id="br-line-30"></div>
//       <div className="line-item" id="br-line-31"></div>
//       <div className="line-item" id="br-line-32"></div>
//       <div className="line-item" id="br-line-33"></div>
//       <div className="line-item" id="br-line-34"></div>
//       <div className="line-item" id="br-line-35"></div>
//       <div className="line-item" id="br-line-36"></div>
//       <div className="line-item" id="br-line-37"></div>
//       <div className="line-item" id="br-line-38"></div>
//       <div className="line-item" id="br-line-39"></div>
//       <div className="line-item" id="br-line-40"></div>
//       <div className="line-item" id="br-line-41"></div>
//       <div className="line-item" id="br-line-42"></div>
//       <div className="line-item" id="br-line-43"></div>
//       <div className="line-item" id="br-line-44"></div>
//       <div className="line-item" id="br-line-45"></div>
//       <div className="line-item" id="br-line-46"></div>
//       <div className="line-item" id="br-line-47"></div>
//       <div className="line-item" id="br-line-48"></div>
//       <div className="line-item" id="br-line-49"></div>
//       <div className="line-item" id="br-line-50"></div>
//     </div>
//     <style jsx>{`
//       #random-btn {
//         margin-top: 16px;
//       }
//       .flower-container {
//         width: 500px;
//         height: 700px;
//         background-color: #c11f3d;
//         background-image: url("/img/base_flower.png");
//         background-size: 85%;
//         background-position: center;
//         background-repeat: no-repeat;
//         overflow: hidden;
//         position: relative;
//       }

//       .gline-container {
//         position: absolute;
//       }

//       .right-gl {
//         right: 0;
//       }

//       .left-gl {
//         left: 0;
//       }

//       .top-gl {
//         top: 80px;
//       }

//       .bottom-gl {
//         bottom: 80px;
//       }

//       .gline-container > .line-item {
//         position: relative;
//         width: 200px;
//         height: 2px;
//         background-image: url("/img/line_gold.png");
//         background-size: 100%;
//         margin-top: 2px;
//       }

//       .line-item:nth-child(even) {
//         background-image: url("/img/line_red.png");
//       }

//       .line-item:last-child {
//         margin-bottom: 2px;
//       }

//       .gline-container.left-gl > .line-item {
//         left: -100px;
//       }

//       .gline-container.right-gl > .line-item {
//         right: -100px;
//       }
//     `}</style>
//   </div>
// ));
