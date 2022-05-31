import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {

  const [stock, setStock] = useState('')
  // const [symbol, setSymbol] = useState()
  // const [shortName,setShortName] = useState()
  // const [marketPrice, setMarketPrice] = useState()
  // const [marketChange, setMarketChange] = useState()
  //
  useEffect(() => {
  axios.get('https://stockaid-back-end.herokuapp.com/stocks').then((response) => {
    setStock(response.data)
  })
}, [])


const handleNewStock = (event) => {
  event.preventDefault()
  axios.post(
      'https://stockaid-back-end.herokuapp.com/stocks',
      {
        symbol: newSymbol,
        shortName: newShortName,
        marketPrice: newMarketPrice,
        marketChange: newMarketChange
      }
    ).then(() => {
      axios
        .get('https://stockaid-back-end.herokuapp.com/stocks')
        .then((response) => {
            setStock(response.data)
        })
    })
}

const handleUpdate = (event, stockData) => {
  event.preventDefault()
  axios
    .put(`https://stockaid-back-end.herokuapp.com/stocks/${stockData._id}`,
      {
        symbol: newSymbol,
        shortName: newShortName,
        marketPrice: newMarketPrice,
        marketChange: newMarketChange
      }
    ).then(() => {
        axios
          .get('https://stockaid-back-end.herokuapp.com/stocks')
          .then((response) => {
            console.log(response.data);
              setStock(response.data)
          })
    })
}


  return (
    <>
    <div className = 'header'>
      <h1>Stock[AID]</h1>
      <h2>The Future of Personal Stock Management</h2>
    </div>

    <div className = 'addNew'>
      <input id='input' type="text" placeholder='Search for ticker...'/>
      <button id='button'>Add Ticker to Portfolio</button>
    </div>

    <div className = 'portfolio'>
      <h2>My Portfolio</h2>
      <section className = 'card'>
        <ul>
          <li>test1</li>
          <li>test2</li>
          <li>test3</li>
        </ul>
      </section>
    </div>

    <div className = 'popular'>
      <h2>Most Popular</h2>
      <section className = 'card'>
        <ul>
          <li>test1</li>
          <li>test2</li>
          <li>test3</li>
        </ul>
      </section>
    </div>
    </>
  );
}

export default App;
