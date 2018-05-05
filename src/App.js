import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import Loader from 'react-loader-advanced'


class App extends Component {
  state = {
    students: {}
  }

  componentDidMount(){
    axios
      .get(`https://api.myjson.com/bins/1dlper`)
      .then(response => {
        this.setState({ students: response.data });
      });
  }

  render() {
    if(Object.keys(this.state.students).length == 0){
      return (<Loader show={true} message={'loading'} />)
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className='row'>
          {Object.keys(this.state.students).map(student => (
            <div key={student} className="card col-md-4 col-sm-6 col-xs-12" style={{width: "18rem"}}>
                <div className="card-body">
                  <h5 className="card-title">Name: {this.state.students[student].name}</h5>
                  <h5 className="card-title">Id: {student}</h5>
                  <h5 className="card-title">Total Marks: {Object.keys(this.state.students[student].marks).reduce((acc,initital) => {
                  return acc + this.state.students[student].marks[initital]
                  },0)}</h5>
                </div>
          </div>)
          )}
        </div>
      </div>
    );
  }
}

export default App;
