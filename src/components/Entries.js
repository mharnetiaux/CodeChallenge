import '../styles/index.less';
import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

export default function Entries (props) {
    const [ data, updateData ] = useState([]);

    function getData(){
        fetch(props.endpoint, {
            method: 'GET',
            mode: 'cors',
            cache:'default'
        })
        .then(res => res.json())
        .then((json) => {
            updateData(json.data.history);
        })
        .catch(function(err) {
            return `Fetch Error ${err}`;
        });
    }

    function collectEntries(){
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let store = [];
        data.forEach((item) => {
            const date = new Date(item['timestamp']);
            if(date.toISOString().includes('00:00:00')) {
                store.push({
                    "direction": "n/a",
                    "date": date.toISOString(),
                    "dayOfWeek":  weekday[date.getDay()],
                    "change": "n/a",
                    "price": JSON.parse(item['price']),
                });
            }
        });
        return store;
    }

    function filterResults(){
        const entries = collectEntries();
        let i = 1;
        while(i < entries.length) {
            entries[i].change = entries[i].price - entries[i-1].price;
            if(entries[i].price > entries[i-1].price) {
                entries[i].direction = "Up";
            }else if(entries[i].price < entries[i-1].price) {
                entries[i].direction = "Down";
            }else {
                entries[i].direction = "Same";
            }
            i++;
        }
        return entries;
    }

    // React Life-cycle method for React Hooks.
    // Call API once component has rendered.
    useEffect(() => {
        getData();
    },[props.endpoint]);

    return (
        filterResults().length > 0 ?
        <Table className='bitCoin'>
            <Thead>
                <Tr>
                    <Th>Date</Th>
                    <Th>Price</Th>
                    <Th>Direction</Th>
                    <Th>Change</Th>
                    <Th>Day of Week</Th>
                </Tr>
            </Thead>
            <Tbody>
            {
                filterResults().map(((item,id) => (
                    <Tr key={id}>
                        <Td>{ item.date.slice(0,item.date.length-5) }</Td>
                        <Td>{ item.price }</Td>
                        <Td>{ item.direction }</Td>
                        <Td>{ item.change }</Td>
                        <Td>{ item.dayOfWeek }</Td>
                    </Tr>
                )))
            }
            </Tbody>
        </Table> : <span>Loading ...</span>
    )
}