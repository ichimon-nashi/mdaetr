import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { bulletinData, ccomData } from './components/Data';

function App() {
  const [ startDate, setStartDate ] = useState(Date.now());
  const [ noOfBulletin, setNoOfBulletin ] = useState(5);
  const [ additionalRemark, setAdditionalRemark ] = useState("1.無。");
  const [textToCopy, setTextToCopy] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  
  const formattedMonth = moment(startDate).format("MM-DD");

  useEffect(() => {
    const ccomDataToBeCopied = document.querySelector("#ccomData").innerHTML
      .replaceAll(/(<h2>)/g,"")
      .replaceAll(/(<\/h2>)/g,"\r\n");
    const bulletinDataToBeCopied = document.querySelector("#bulletinData").innerHTML
      .replaceAll(/(<h2>|<\/h2>|<\/li>)/g,"")
      .replaceAll(/(<li>)/g,"\r\n");
    const additionalRemarkToBeCopied = document.querySelector("#textAreaData").innerHTML
    const combinedText = ccomDataToBeCopied + "\n\n" + bulletinDataToBeCopied + "\n\n" + `三、其他：\n` + additionalRemarkToBeCopied
    console.log(combinedText)
    setTextToCopy(combinedText);
  }, [])

  const getCCOMQuestion = () => {
    const randomCCOMQuestion = [];

    for (let i=0; i<ccomData.length; i++) {
      if ((formattedMonth >= ccomData[i]["startDate"]) && (formattedMonth <= ccomData[i]["endDate"])) {
        const randomNumber = Math.floor(Math.random()*(ccomData[i]["questionList"].length));
        randomCCOMQuestion.push(ccomData[i]["questionList"][randomNumber]);
        // console.log(`CCOM章節： ${ccomData[i]["chapter"]}`)
        // console.log(ccomData[i]["questionList"][randomNumber])
      } 
    }
    return <>{`1. 抽問 F2 CCOM Ch.${randomCCOMQuestion}，抽問結果正常。`}</>;
  }

  const newestBulletin = bulletinData
    .filter(criteria => moment(criteria.date).isSameOrBefore(startDate))
    .slice(-noOfBulletin) //No of bulletin displayed based on input
    .map((item, index) => {
      return (
        <li key={`id${item.id}`}>{`${index+1}. ${item.id} : ${item.title}`}</li>
      )
    });

  const handleCopyButton = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 3000); // Reset status after 2 seconds
    const ccomDataToBeCopied = document.querySelector("#ccomData").innerHTML
      .replaceAll(/(<h2>)/g,"")
      .replaceAll(/(<\/h2>)/g,"\r\n");
    const bulletinDataToBeCopied = document.querySelector("#bulletinData").innerHTML
      .replaceAll(/(<h2>|<\/h2>|<\/li>)/g,"")
      .replaceAll(/(<li>)/g,"\r\n");
    const additionalRemarkToBeCopied = document.querySelector("#textAreaData").innerHTML
    const combinedText = ccomDataToBeCopied + "\n\n" + bulletinDataToBeCopied + "\n\n" + `三、其他：\n` + additionalRemarkToBeCopied
    console.log(combinedText)
    setTextToCopy(combinedText);
  };

  return (
    <>
      <div className="header-Container">
        <h1 className="title neonText">e-<span className="redNeon neon-flicker">TAHI</span> Report</h1>
        <small className='versionNo'>v.1.0.0</small>
        <div className='datePicker-container'>
          <DatePicker 
            showIcon
            name="datepicker"
            selected={startDate} 
            onChange={(date) => setStartDate(date)} 
          />
        </div>
      </div>
      
      <fieldset className='ccom-Container'>
        <legend>CCOM抽問</legend>
        <div id="ccomData">
          <h2>一、飛安抽問合格，摘要如下：</h2>
        
          {/* {(() => {
            const randomCCOMQuestion = [];
            for (let i=0; i<ccomData.length; i++) {
              if ((formattedMonth >= ccomData[i]["startDate"]) && (formattedMonth <= ccomData[i]["endDate"])) {
                const randomNumber = Math.floor(Math.random()*(ccomData[i]["questionList"].length));
                randomCCOMQuestion.push(ccomData[i]["questionList"][randomNumber]);
                console.log(`CCOM章節： ${ccomData[i]["chapter"]}`)
                console.log(ccomData[i]["questionList"][randomNumber])
              } 
            }
            return <div>{`1. 抽問 F2 CCOM Ch.${randomCCOMQuestion}，抽問結果正常。`}</div>;
          })()} */}

          {(() => getCCOMQuestion())()}
        </div>
      </fieldset>

      <fieldset className='bulletin-Container'>
        <legend>公告宣導/抽問</legend>
        <label name="bulletinNo">
          公告數量<em> (最少5筆) </em>
          <input 
            className="bulletin-input"
            type="number"
            name="bulletinNo" 
            defaultValue={noOfBulletin} 
            min="5"
            onChange={(event) => setNoOfBulletin(event.target.value)}
          />
        </label>
        <div id="bulletinData">
          <h2>二、公告抽問合格，摘要如下:</h2>
          {newestBulletin}
        </div>
      </fieldset>

      <fieldset className='additionalRemarks-Container'>
        <legend>其他</legend>
        <div>
          <h2>三、其他：</h2>
          {/* <input 
            className="additionalRemark-input" 
            type="text" 
            name="addtionalRemark"
            placeholder='無。' 
            value={additionalRemark} 
            onChange={(event) => setAdditionalRemark(event.target.value)} 
          /> */}
          <textarea
          id="textAreaData"
          className="additionalRemark-input" 
          placeholder='無。' 
          name="addtionalRemark"
          value={additionalRemark} 
          onChange={(event) => setAdditionalRemark(event.target.value)} 
          >
          </textarea>
        </div>
      </fieldset>

      <CopyToClipboard text={textToCopy} >
        <button 
          className={`copyButton ${copyStatus ? "copied" : ""}`}
          onClick={handleCopyButton}
        >
          {copyStatus ? "COPIED ✅" : "COPY 📋"}
        </button>
      </CopyToClipboard>
    </>
  )
}

export default App
