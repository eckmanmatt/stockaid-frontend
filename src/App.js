import './App.css';
import {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {

  const [stocks, setStocks] = useState([])
  const [newSymbol, setNewSymbol] = useState()
  const [newShortName, setNewShortName] = useState()
  const [newMarketPrice, setNewMarketPrice] = useState()
  const [newMarketChange, setNewMarketChange] = useState()
  const [recommendations, setRecommendations] = useState()
  const [recSymbol, setRecSymbol] = useState([])
  const [recShortName, setRecShortName] = useState([])
  const [recMarketPrice, setRecMarketPrice] = useState([])
  const [recMarketChange, setRecMarketChange] = useState([])
  const [toggleConfirmationForm, setToggleConfirmationForm] = useState(false)

  useEffect(() => {
    axios.get('https://stockaid-back-end.herokuapp.com/stocks').then((response) => {
      setStocks(response.data)
    })
    axios.get('https://stockaid-back-end.herokuapp.com/recommendations').then((response) => {
      setRecommendations(response.data)
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
    axios.request(`https://api.polygon.io/v3/reference/tickers?ticker=${newSymbol}&active=true&sort=ticker&order=asc&limit=10&apiKey=93iCvd9wrOUYmz69ZzVj6w32X5rPT2bR`).then((response) => {
      setNewShortName(response.data.results[0].name)
    }).then((response) => {
      axios.request(`https://api.polygon.io/v2/aggs/ticker/${newSymbol}/prev?adjusted=true&apiKey=93iCvd9wrOUYmz69ZzVj6w32X5rPT2bR`).then(function (response) {
      setNewMarketPrice(response.data.results[0].c)
      setNewMarketChange((response.data.results[0].c - response.data.results[0].o) / response.data.results[0].o)
    }).catch(function (error) {
      console.error(error);
    })
    })
    handleToggleConfirmationForm()
  }

  const confirmStock = (event) => {
    event.preventDefault()
    axios.post(
      'https://stockaid-back-end.herokuapp.com/stocks',
      {
        symbol: newSymbol,
        shortName: newShortName,
        marketPrice: newMarketPrice,
        marketChange: newMarketChange
      }
    ).then((response) => {
      axios
        .get('https://stockaid-back-end.herokuapp.com/stocks')
        .then((response) => {
            setStocks(response.data)
        })
    })
    handleToggleConfirmationForm()
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

  const handleToggleConfirmationForm = () => {
    if (toggleConfirmationForm) {
      setToggleConfirmationForm(false)
    } else {
      setToggleConfirmationForm(true)
    }
  }

  // recommendations.map((recommendedStock) => {
    // axios.request(`https://api.polygon.io/v3/reference/tickers?ticker=${recommendedStock.ticker}&active=true&sort=ticker&order=asc&limit=10&apiKey=93iCvd9wrOUYmz69ZzVj6w32X5rPT2bR`).then((response) => {
    //   setRecShortName(recShortName.push(response.data.results[0].name))
    // }).then((response) => {
    //   axios.request(`https://api.polygon.io/v2/aggs/ticker/${recommendedStock.ticker}/prev?adjusted=true&apiKey=93iCvd9wrOUYmz69ZzVj6w32X5rPT2bR`).then((response) => {
    //     setRecMarketPrice(recMarketPrice.push(response.data.results[0].c))
    //     setRecMarketChange(recMarketChange.push((response.data.results[0].c - response.data.results[0].o) / response.data.results[0].o))
    // }).catch(function (error) {
    //   console.error(error);
    // })
    // })
  // })

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
      {toggleConfirmationForm ?
        <div className='confirmation-form'>
          <br />
          <h3>{newSymbol}</h3>
          <h3>{newShortName}</h3>
          <h3>{newMarketPrice}</h3>
          <h3>{newMarketChange}</h3>
          <button onClick={confirmStock}>CONFIRM STOCK</button>
        </div>
      : null}
    </div>

    <div className = 'portfolio'>
      <h2>My Portfolio</h2>
      <section>
        <ul>
          {stocks.map((stock) => {
            return (
              <li className='card' key={stock._id}>
                <h3>{stock.symbol}</h3>
                <h2>{stock.shortName}</h2>
                <h4>Market Price: {stock.marketPrice}</h4>
                <h4>Market Change: {stock.marketChange}</h4>
                <div id = 'cardButton'>
                  <button onClick = {(event) => {handleUpdate(stock)}}>Update</button>
                  <button onClick = {(event) => {handleDeleteStock(stock)}}>Remove</button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>

    <div className = 'popular'>
      <h2>Recommended Stocks</h2>
        {recommendations ?
          <section className = 'card'>
            {recommendations.map((recommendation) => {
              return (
                <div>
                  <h3>{recommendation.ticker}</h3>
                  <h2>{recommendation.name}</h2>
                  <h4>Postion: #{recommendation.position}</h4>
                </div>
              )
            })}
          </section>
        : null}
    </div>
    </>
  );
}

export default App;
