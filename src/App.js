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

  const handleAddStock = (recommendationData) => {
    setNewSymbol(recommendationData.ticker)
  }

  const handleMouseOut = () => {
    setNewSymbol()
    setNewShortName()
    setNewMarketPrice()
    setNewMarketChange()
    setToggleConfirmationForm(false)
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

    <div className = 'jumbotron jumbotron-fluid py-3 my-0'>
      <div className='container text-center'>
        <h1 className='display-3'>Stock[AID]</h1>
        <h2 className='lead'>The Future of Personal Stock Management</h2>
      </div>
    </div>

    <div className = 'container text-center addNew my-1'>
      <div className='row'>
        <div className='col-4 mx-auto'>
        {!toggleConfirmationForm ?
          <form onSubmit={handleNewStock}>
            <div className='form-group'>
            <input className='form-control' id='input' type="text" placeholder='Search for ticker...' onChange={handleInputStock}/>
            <input className='btn btn-outline-primary' type='submit' value='Queue Stock'/>
            </div>
          </form>
        : null}
        {toggleConfirmationForm ?
          <div className='confirmation-form'>
            <br/>
            <h3 id='queued-stock'>Queued Stock</h3>
            <h3 id='queued-details'>{newSymbol}</h3>
            <h3 id='queued-details'>{newShortName}</h3>
            <h3 id='queued-details'>{newMarketPrice}</h3>
            <h3 id='queued-details'>{newMarketChange}</h3>
            <button className='btn btn-success' onClick={confirmStock}>CONFIRM STOCK</button>
            <button className='btn btn-danger' onClick={handleToggleConfirmationForm}>CANCEL</button>
          </div>
        : null}
        </div>
      </div>

    </div>

    <div className='portfolio'>
      <div className = 'jumbotron jumbotron-fluid text-center py-5 my-0'>
        <h2 id='portfolio-header'>My Portfolio</h2>
      </div>

      <div className='card-deck bg-dark'>
        {stocks.map((stock) => {
          return (
              <div className='col-4'>
                <div className='card text-center mx-5 my-3' key={stock._id}>
                  <div className='card-body'>
                    <h3>{stock.symbol}</h3>
                    <h2>{stock.shortName}</h2>
                    <h4>Market Price: {stock.marketPrice}</h4>
                    <h4>Market Change: {stock.marketChange}</h4>
                    <button className='btn btn-outline-warning' onClick={(event) => {toggleEditForm(stock)}}>
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
                            <button className='btn btn-success' onClick={handleUpdate}>CONFIRM</button>
                            : <button className='btn btn-outline-primary' onClick={(event) => {assignEditStock(stock)}}>Change Stock</button>}
                            </>
                            : null
                            : null
                          }
                          <button className='btn btn-outline-danger' onClick = {(event) => {handleDeleteStock(stock)}}>Remove</button>
                  </div>
                </div>
              </div>
          )
        })}
      </div>
    </div>

    <div className = 'trending'>
      <div className = 'jumbotron jumbotron-fluid text-center py-5 my-0'>
        <h2 id='trending-header'>Trending Stocks</h2>
        <p>updated June 6, 2022 @ 12:00pm EST</p>
      </div>

      <div className='card-deck  bg-dark'>
        {recommendations ?
            recommendations.map((recommendation) => {
              return (
                <div className='col-4 m-0 p-3'>
                  <div className ='card text-center w-auto h-100' key={recommendation._id}>
                    <div className='card-body p-0' onMouseOver={(event) => {handleAddStock(recommendation)}} onMouseOut={handleMouseOut}>
                      <h3>{recommendation.ticker}</h3>
                      <h2>{recommendation.name}</h2>
                      <h4>Position: #{recommendation.position}</h4>
                      <button className='btn btn-outline-primary' onMouseDown={handleNewStock} onClick={confirmStock}>Add To Portfolio</button>
                    </div>
                  </div>
                </div>
              )
            })
        : null}
      </div>
    </div>
    </>
  )
}

export default App
