import React from 'react';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      repoUrl: "",
      issues24: null,
      issues7: null,
      issues7Plus: null,
      totalIssues: null
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSearch = () => {
    let url = this.state.repoUrl;
    if (url[url.length - 1] === "/") {
      url = url.slice(0, -1);
    }
    let user = url.split("/")[url.split("/").length - 2];
    let repo = url.split("/")[url.split("/").length - 1];
    console.log(user, repo);
    fetch(`https://api.github.com/repos/${user}/${repo}/issues`)
      .then(response => response.json())
      .then(issues => {

        let today = new Date();
        let timeArray = issues.map(issue => {
          let ca = new Date(issue.created_at);
          let timeGap = Math.abs(today.getTime() - ca.getTime());
          return timeGap / (1000 * 60 * 60 * 24)
        });

        let issues24 = timeArray.filter(time => time <= 1).length;
        let issues7 = timeArray.filter(time => time > 1 && time <= 7).length;
        let issues7Plus = timeArray.filter(time => time > 7).length;
        
        this.setState({
          issues7,
          issues24,
          issues7Plus,
          totalIssues: issues.length
        });
      })
      .catch(error => console.error("Error", error));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="search-container">
            <input name="repoUrl" value={this.state.repoUrl} onChange={this.handleChange} type="text" placeholder="URL of repository" />
            <button onClick={this.handleSearch}>Search</button>
          </div>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>&#x3c; 24 hrs</th>
                <th>&#x3c; 7 days</th>
                <th>&#x3e; 7 days</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td># Issues</td>
                <td>{this.state.issues24}</td>
                <td>{this.state.issues7}</td>
                <td>{this.state.issues7Plus}</td>
                <td>{this.state.totalIssues}</td>
              </tr>
            </tbody>
          </table>
        </header>
      </div>
    );
  }
}

export default App;
