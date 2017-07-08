import React, { Component } from 'react';
import { cwRequest } from '../../helpers/http';
import { uniq } from 'lodash';

import './Markets.css';

import cwMarkets from '../../constants/markets';
import {formatCurrencyPair} from "../../helpers/formatter";

class Markets extends Component {
  constructor() {
    super();

    this.state = {
      exchanges: [],
      pairsByExchange: {},
      exchangesOpen: {},
    };
  }

  componentWillMount() {
    this.getMarkets();
  }

  getMarkets() {
    const marketsUrl = 'https://api.cryptowat.ch/markets';

    cwRequest(marketsUrl).then(markets => {
      const exchanges = uniq(markets.map(m => m.exchange));

      const pairsByExchange = exchanges.reduce((a, exchange) => ({
        ...a,
        [exchange]: cwMarkets.filter(m => m.exchange === exchange).map(m => m.currencyPair),
      }), {});

      this.setState({
        exchanges,
        pairsByExchange,
      });
    });

  }

  // componentWillMount() {
  // const marketsUrl = 'https://api.cryptowat.ch/markets';
  //
  // superagent(marketsUrl).then(markets => {
  //   this.setState({ markets });
  // });
  // }

  switchExchange(exchange) {
    this.setState({
      exchangesOpen: {
        ...this.state.exchangesOpen,
        [exchange]: !this.state.exchangesOpen[exchange],
      }
    })
  }

  render() {
    return (
      <div className="Markets">
        {this.state.exchanges.map((exchange, iE) =>
          <div
            key={iE}
            className="Markets-exchange"
            onClick={() => this.switchExchange(exchange)}
          >
            {this.state.exchangesOpen[exchange] ? '^' : '>'} {exchange}
            {this.state.exchangesOpen[exchange] &&
            <div>
              {this.state.pairsByExchange[exchange].map((currencyPair, iM) =>
                <div
                  onClick={() => this.props.addWatcher({
                    exchange, currencyPair,
                  })}
                  key={iM}
                  className="Markets-currency">
                  + {formatCurrencyPair(currencyPair)}
                </div>
              )}
            </div>
            }
          </div>
        )}
      </div>
    );
  }
}

export default Markets;