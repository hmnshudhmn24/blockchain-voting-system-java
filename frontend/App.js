import React, { useState, useEffect } from 'react';

function App() {
    const [candidate, setCandidate] = useState('');
    const [voterID, setVoterID] = useState('');
    const [results, setResults] = useState({});

    const vote = async () => {
        await fetch('/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voterID, candidate })
        });
    };

    useEffect(() => {
        const fetchResults = async () => {
            const response = await fetch('/results');
            const data = await response.json();
            setResults(data);
        };
        fetchResults();
    }, []);

    return (
        <div>
            <h2>Blockchain Voting System</h2>
            <input type="text" placeholder="Voter ID" onChange={e => setVoterID(e.target.value)} />
            <input type="text" placeholder="Candidate" onChange={e => setCandidate(e.target.value)} />
            <button onClick={vote}>Vote</button>
            <h3>Results:</h3>
            <ul>{Object.keys(results).map(key => <li key={key}>{key}: {results[key]}</li>)}</ul>
        </div>
    );
}

export default App;
