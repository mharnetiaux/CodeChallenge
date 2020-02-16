import React from 'react';
import { render } from 'react-dom';
import Entries from "./components/Entries";
const url = 'https://api.coinranking.com/v1/public/coin/1/history/30d';

render(
<Entries endpoint={ url }/>, document.getElementById('app'));
