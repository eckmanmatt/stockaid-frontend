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
  const [toggleConfirmationForm, setToggleConfirmationForm] = useState(false)
  const [editStock, setEditStock] = useState({_id: null})
  const [seeEditForm, setSeeEditForm] = useState(false)
  const [seeConfirmEdit, setSeeConfirmEdit] = useState(false)

  useEffect(() => {
    axios
      .get('https://stockaid-back-end.herokuapp.com/stocks')
      .then((response) => {
        setStocks(response.data)
      })
    axios
      .get('https://stockaid-back-end.herokuapp.com/recommendations')
      .then((response) => {
        setRecommendations(response.data)
      })
  }, [])

  const handleDeleteStock = (stockData) => {
    axios
      .delete(`https://stockaid-back-end.herokuapp.com/stocks/${stockData._id}`)
      .then(() => {
        axios
          .get('https://stockaid-back-end.herokuapp.com/stocks')
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
    axios
      .request(`https://api.polygon.io/v3/reference/tickers?ticker=${newSymbol}&active=true&sort=ticker&order=asc&limit=10&apiKey=93iCvd9wrOUYmz69ZzVj6w32X5rPT2bR`)
      .then((response) => {
        setNewShortName(response.data.results[0].name)
      })
      .then((response) => {
        axios
          .request(`https://api.polygon.io/v2/aggs/ticker/${newSymbol}/prev?adjusted=true&apiKey=93iCvd9wrOUYmz69ZzVj6w32X5rPT2bR`)
          .then(function (response) {
            setNewMarketPrice(response.data.results[0].c)
            setNewMarketChange((response.data.results[0].c - response.data.results[0].o) / response.data.results[0].o)
          })
          .catch(function (error) {
            console.error(error);
          })
        })
    handleToggleConfirmationForm()
  }

  const confirmStock = (event) => {
    event.preventDefault()
    axios
      .post('https://stockaid-back-end.herokuapp.com/stocks',
        {
          symbol: newSymbol,
          shortName: newShortName,
          marketPrice: newMarketPrice,
          marketChange: newMarketChange
        }
      )
      .then((response) => {
        axios
          .get('https://stockaid-back-end.herokuapp.com/stocks')
          .then((response) => {
            setStocks(response.data)
          })
      })
    handleToggleConfirmationForm()
  }

  const handleUpdate = (event) => {
    axios.put(`https://stockaid-back-end.herokuapp.com/stocks/${editStock._id}`,
        {
          symbol: newSymbol,
          shortName: newShortName,
          marketPrice: newMarketPrice,
          marketChange: newMarketChange
        })
        .then(() => {
            axios.get(`https://stockaid-back-end.herokuapp.com/stocks`).then((response) => {
              setStocks(response.data)
            })
        })
    toggleConfirmEdit()
    toggleEditForm()
    setNewSymbol()
    setNewShortName()
    setNewMarketPrice()
    setNewMarketChange()
  }

  const assignEditStock = (stock) => {
    setEditStock(stock)
    axios
      .request(`https://api.polygon.io/v3/reference/tickers?ticker=${newSymbol}&active=true&sort=ticker&order=asc&limit=10&apiKey=93iCvd9wrOUYmz69ZzVj6w32X5rPT2bR`)
      .then((response) => {
        setNewShortName(response.data.results[0].name)
      })
      .then((response) => {
        axios
        .request(`https://api.polygon.io/v2/aggs/ticker/${newSymbol}/prev?adjusted=true&apiKey=93iCvd9wrOUYmz69ZzVj6w32X5rPT2bR`)
        .then(function (response) {
          setNewMarketPrice(response.data.results[0].c)
          setNewMarketChange((response.data.results[0].c - response.data.results[0].o) / response.data.results[0].o)
        })
        .catch(function (error) {
          console.error(error);
        })
      })
    toggleConfirmEdit()
  }

  const handleToggleConfirmationForm = () => {
    if (toggleConfirmationForm) {
      setNewSymbol()
      setNewShortName()
      setNewMarketPrice()
      setNewMarketChange()
      setToggleConfirmationForm(false)
    } else {
      setToggleConfirmationForm(true)
    }
  }

  const toggleEditForm = (stock) => {
    if (seeEditForm) {
      setEditStock({_id: null})
      setNewSymbol()
      setNewShortName()
      setNewMarketPrice()
      setNewMarketChange()
      setSeeEditForm(false)
      setSeeConfirmEdit(false)
    } else {
      setEditStock(stock)
      setSeeEditForm(true)
    }
  }

  const toggleConfirmEdit = () => {
    if (seeConfirmEdit) {
      setSeeConfirmEdit(false)
    } else {
      setSeeConfirmEdit(true)
    }
  }

  return (
    <>

    <div className = 'header'>
      <h1>Stock[AID]</h1>
      <h2>The Future of Personal Stock Management</h2>
    </div>

    <div className = 'addNew'>
      {!toggleConfirmationForm ?
        <form onSubmit={handleNewStock}>
          <input id='input' type="text" placeholder='Search for ticker...' onChange={handleInputStock}/>
          <br/>
          <input type='submit' value='Queue Stock'/>
        </form>
      : null}
      {toggleConfirmationForm ?
        <div className='confirmation-form'>
          <br/>
          <h3 id='queuedStock'>Queued Stock</h3>
          <h3>{newSymbol}</h3>
          <h3>{newShortName}</h3>
          <h3>{newMarketPrice}</h3>
          <h3>{newMarketChange}</h3>
          <button onClick={confirmStock}>CONFIRM STOCK</button>
          <button onClick={handleToggleConfirmationForm}>CANCEL</button>
        </div>
      : null}
    </div>

    <div className = 'portfolio'>
      <h2 id='portfolio-header'>My Portfolio</h2>
      <div className='card-container'>
        {stocks.map((stock) => {
          return (
            <div className='card' key={stock._id}>
              <h3>{stock.symbol}</h3>
              <h2>{stock.shortName}</h2>
              <h4>Market Price: {stock.marketPrice}</h4>
              <h4>Market Change: {stock.marketChange}</h4>
              <button onClick={(event) => {toggleEditForm(stock)}}>
                {stock._id === editStock._id ?
                  seeEditForm ? 
                    "Cancel Changes" 
                  : "Edit"
                : "Edit"}
              </button>
              {stock._id === editStock._id ?
                seeEditForm ?
                  <>
                    <input type="text" placeholder="Enter new ticker" onChange={handleInputStock} />
                    {seeConfirmEdit ?
                      <button onClick={handleUpdate}>CONFIRM</button>
                    : <button onClick={(event) => {assignEditStock(stock)}}>Change Stock</button>}
                  </>
                : null
              : null }              
              <button onClick = {(event) => {handleDeleteStock(stock)}}>Remove</button>
            </div>
          )
        })}
      </div>
    </div>

    <div className = 'recommendations'>
      <h2 id='recommendations-header'>Recommended Stocks</h2>
        <div className='card-container'>
        {recommendations ?
          <div className='rec-container'>
            {recommendations.map((recommendation) => {
              return (
                <div className = 'card' key={recommendation._id}>
                  <h3>{recommendation.ticker}</h3>
                  <h2>{recommendation.name}</h2>
                  <h4>Postion: #{recommendation.position}</h4>
                </div>
              )
            })}
          </div>
        : null}
    </div>
    </div>
    </>
  )
}

export default App