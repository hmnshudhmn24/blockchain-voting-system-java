package main

import (
    "encoding/json"
    "fmt"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
    contractapi.Contract
}

type Vote struct {
    Candidate string `json:"candidate"`
}

func (s *SmartContract) CastVote(ctx contractapi.TransactionContextInterface, voterID string, candidate string) error {
    exists, _ := ctx.GetStub().GetState(voterID)
    if exists != nil {
        return fmt.Errorf("voter has already voted")
    }
    vote := Vote{Candidate: candidate}
    voteJSON, _ := json.Marshal(vote)
    return ctx.GetStub().PutState(voterID, voteJSON)
}

func (s *SmartContract) GetResults(ctx contractapi.TransactionContextInterface) (map[string]int, error) {
    results := make(map[string]int)
    iterator, _ := ctx.GetStub().GetStateByRange("", "")
    for iterator.HasNext() {
        response, _ := iterator.Next()
        var vote Vote
        json.Unmarshal(response.Value, &vote)
        results[vote.Candidate]++
    }
    return results, nil
}

func main() {
    chaincode, _ := contractapi.NewChaincode(new(SmartContract))
    chaincode.Start()
}
