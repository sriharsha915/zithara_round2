import React, {useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
const [customers, setCustomers] = useState([]);
const [search, setSearch] = useState('');
const [sortBy, setSortBy] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
const [recordsPerPage] = useState(20);

useEffect(() => {

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/public');
      console.log('Response from server:', response.data);
      setCustomers (response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };
  fetchData();
}, []);

const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
const currentRecords = customers.slice(indexOfFirstRecord, indexOfLastRecord);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

const filteredCustomers = currentRecords.filter(
  (customer) =>
   customer.customer_name.toLowerCase().includes (search.toLowerCase()) || 
   customer.location.toLowerCase().includes (search.toLowerCase())
);

const sortedCustomers = sortBy
  ? [...filteredCustomers].sort((a, b) =>
    sortBy === 'date'
      ? new Date(a.timestamp_created_at) - new Date(b.timestamp_created_at)
      : new Date(a.timestamp_created_at).getTime() - new Date(b.timestamp_created_at).getTime()
    )
      : filteredCustomers;

  return  (
    <div className="app container">
      <header>
        <h1>Public Data Confidential</h1>
      </header>
      <main>
        <div className="search-sort">
        <input
          type="text"
          placeholder="Search by name or location"
          values={search}
          onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort by</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
          </select>
          </div>
          <table>
            <thead>
              <th>Sno</th>
              <th>Customer Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
            </thead>
            <tbody>
            {sortedCustomers.map((customer) => (

            <tr key={customer.sno}>

            <td>{customer.sno}</td>

            <td>{customer.customer_name}</td>

            <td>{customer.age}</td>

            <td>{customer.phone}</td>

            <td>{customer.location}</td>

            <td>{new Date(customer.timestamp_created_at).toLocaleDateString()}</td>

            <td>{new Date(customer.timestamp_created_at).toLocaleTimeString()}</td>

            </tr>
            ))}
</tbody>
</table>
<div className="pagination">
{Array.from({ length: Math.ceil(customers.length / recordsPerPage) }).map((_, index) => (
            <button
              key = {index}
              className = {currentPage === index + 1 ? 'active' : ''}
              onClick={() => paginate(index + 1)}>
                {index + 1}
            </button>
))}
  </div>
  </main>
  <footer>
    <p> <span>&#169;</span> Zithara</p>
  </footer>
  </div>
  )}


export default App;