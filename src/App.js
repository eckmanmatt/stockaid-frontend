import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {

  const [stock, setStock] = useState('')
  const [stocks, setStocks] = useState([])
  const [newSymbol, setNewSymbol] = useState('')
  const [newShortName, setNewShortName] = useState('')
  const [newMarketPrice, setNewMarketPrice] = useState('')
  const [newMarketChange, setNewMarketChange] = useState('')


  //API connection
  const options = {
  method: 'GET',
  url: 'https://yh-finance.p.rapidapi.com/stock/v2/get-summary',
  params: {symbol: newSymbol},
  headers: {
    'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
    'X-RapidAPI-Key': '314777666cmsha0de50e0f014d15p144d54jsn22d0daba111e'
  }
};




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

const handleInputStock = (event) => {
  setNewSymbol(event.target.value)
}

const handleNewStock = (event) => {
  event.preventDefault()
  axios.request(options).then(function (response) {
    // setNewSymbol(response.data.price.symbol)
    setNewShortName(response.data.price.shortName)
    setNewMarketPrice(response.data.price.regularMarketPrice.raw)
    setNewMarketChange(response.data.price.regularMarketChange.raw)
  }).catch(function (error) {
    console.error(error);
  }).then((response) => {
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
      <form onSubmit={handleNewStock}>
        <input id='input' type="text" placeholder='Search for ticker.' onChange={handleInputStock}/>
        <input type='submit' value='Add Stock'/>
      </form>
    </div>

    <div className = 'portfolio'>
      <h2>My Portfolio</h2>
      <section>
        <ul>
          {stocks.map((stock) => {
            return <li className = 'card'>
                    <h3>{stock.symbol}</h3>
                    <h2>{stock.shortName}</h2>
                    <h4>Market Price:{stock.marketPrice}</h4>
                    <h4>Market Change: {stock.marketChange}</h4>
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
