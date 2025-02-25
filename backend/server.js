const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

async function connectNetwork() {
    const ccpPath = path.resolve(__dirname, '..', 'network', 'connection.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
    const network = await gateway.getNetwork('mychannel');
    return network.getContract('voting');
}

app.post('/vote', async (req, res) => {
    try {
        const contract = await connectNetwork();
        await contract.submitTransaction('CastVote', req.body.voterID, req.body.candidate);
        res.send('Vote Cast Successfully');
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.get('/results', async (req, res) => {
    try {
        const contract = await connectNetwork();
        const results = await contract.evaluateTransaction('GetResults');
        res.json(JSON.parse(results.toString()));
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
