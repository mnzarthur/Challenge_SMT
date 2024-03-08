// client.js
const apiUrl = 'http://localhost:3300';

async function sendRequest(endpoint, method, data = null) {
  try {
    const response = await axios({ method, url: `${apiUrl}/${endpoint}`, data });
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

function displayMessage(message) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
}

async function createIssue() {
  const id = document.getElementById('id').value;
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  try {
    const newIssue = { id, title, description };
    const createdIssue = await sendRequest('create', 'post', newIssue);
    displayMessage(`Issue created: ${JSON.stringify(createdIssue)}`);
    fetchAndDisplayIssues();
    resetForm();
  } catch (error) {
    displayMessage('Failed to create issue.');
  }
}

function resetForm() {
  document.getElementById('id').value = '';
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
}

async function fetchAndDisplayIssues(filterId = null) {
  try {
    let issues = await sendRequest('read', 'get');

    if (filterId !== null) {
      issues = issues.filter((issue) => issue.id == filterId);
    }

    console.log('Fetched Issues:', issues);
    displayIssuesTable(issues);
  } catch (error) {
    displayMessage('Failed to fetch issues.');
  }
}

function displayIssuesTable(issues) {
  const tableBody = document.getElementById('issueTableBody');
  tableBody.innerHTML = '';

  issues.forEach((issue) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${issue.id}</td>
      <td>${issue.title}</td>
      <td>${issue.description}</td>
      <td><button onclick="deleteIssue(${issue.id})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

async function deleteIssue(issueId) {
  if (confirm('Are you sure you want to delete this issue?')) {
    try {
      await sendRequest(`delete/${issueId}`, 'delete');
      displayMessage(`Issue deleted: ${issueId}`);
      removeIssueFromTable(issueId); // Remove the deleted issue from the table
    } catch (error) {
      displayMessage('Failed to delete issue.');
    }
  }
}

function removeIssueFromTable(issueId) {
  const tableBody = document.getElementById('issueTableBody');
  const rowToRemove = Array.from(tableBody.children).find((row) => {
    const idCell = row.cells[0];
    return idCell.textContent === issueId.toString();
  });

  if (rowToRemove) {
    tableBody.removeChild(rowToRemove);
  }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayIssues);

async function refreshTable() {
  const filterId = document.getElementById('filterId').value;
  fetchAndDisplayIssues(filterId);
}
