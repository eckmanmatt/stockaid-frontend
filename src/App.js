import logo from './logo.svg';
import './App.css';

const App = () => {

  const [stock, setStock] = useState('')
  const [symbol, setSymbol] = useState()
  const [shortName,setShortName] = useState()
  const [marketPrice, setMarketPrice] = useState()
  const [marketChange, setMarketChange] = useState()


  return (
    <>
      <div className = 'header'>
        <h1>Stock[AID]</h1>
        <h2>The Future of Stock Marketing</h2>
      </div>

      <div className = 'addNew'>
        <button>Add Ticker</button>
      </div>

      <div className = 'portfolio'>
        <section className = 'card'>
          <ul>
            <li></li>
          </ul>
        </section>
      </div>

      <div className = 'popular'>
        <section className = 'card'>
          <ul>
            <li></li>
          </ul>
        </section>
      </div>
    </>
  );
}

export default App;
