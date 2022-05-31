import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {

  const [stock, setStock] = useState('')
  const [stocks, setStocks] = useState([])
  const [newSymbol, setNewSymbol] = useState()
  const [newShortName, setNewShortName] = useState()
  const [newMarketPrice, setNewMarketPrice] = useState()
  const [newMarketChange, setNewMarketChange] = useState()


  useEffect(() => {
  axios.get('https://stockaid-back-end.herokuapp.com/stocks').then((response) => {
    setStocks(response.data)
  })
}, [])

const handleDeleteStock = (stockData) => {
  axios.delete(`https://stockaid-back-end.herokuapp.com/stocks/${stockData._id}`)
    .then(() => {
      axios.get('https://stockaid-back-end.herokuapp.com/stocks')
            .then((response) => {
              setStocks(response.data)
            })
    })
}


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
            setStocks(response.data)
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
              setStocks(response.data)
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
          {stocks.map((stock) => {
            return <li>
                    <h3>{stock.symbol}</h3>
                    <h2>{stock.shortName}</h2>
                    <h4>{stock.marketPrice}</h4>
                    <h4>{stock.marketChange}</h4>
                    <button onClick = {(event) => {handleUpdate(stock)}}>Update</button>
                    <button onClick = {(event) => {handleDeleteStock(stock)}}>Remove</button>
                  </li>

                })}
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
