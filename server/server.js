// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3300;

app.use(cors());
app.use(bodyParser.json());

let issues = [];

app.post('/create', (req, res) => {
  const newIssue = req.body;
  issues.push(newIssue);
  console.log('Created Issue:', newIssue);
  res.json(newIssue);
});

app.get('/read', (req, res) => {
  res.json(issues);
});

app.put('/update', (req, res) => {
  const updatedIssue = req.body;
  console.log('Updated Issue:', updatedIssue);
  res.json(updatedIssue);
});

// Update delete endpoint to expect the issue ID as a parameter
app.delete('/delete/:id', (req, res) => {
  const issueId = req.params.id;
  const deletedIssueIndex = issues.findIndex((issue) => issue.id == issueId);

  if (deletedIssueIndex !== -1) {
    const deletedIssue = issues.splice(deletedIssueIndex, 1)[0];
    console.log('Deleted Issue:', deletedIssue);
    res.json(deletedIssue);
  } else {
    res.status(404).json({ error: 'Issue not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
