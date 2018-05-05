import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Loader from 'react-loader-advanced'

class App extends Component {
  state = {
    students: {},
    searchStudent: [],
    search: false,
    sorted: [],
    sortMarksBy: 'desc'
  }

  toggleSort = () => {
    this.setState(prevState => {
      sorted: Object.keys(prevState.students).sort((a, b) =>  prevState.students[a] - prevState.students[b] )
    })
  }
  

  toggleMarks = () => {
    this.setState(prevState => {
      console.log(prevState)
      if(prevState.sortMarksBy === "asc"){
        return {
          sorted: Object.keys(prevState.students).sort((a, b) => Object.keys(prevState.students[a].marks).reduce((acc, initital) => {
            return acc + prevState.students[a].marks[initital]
          }, 0) - Object.keys(prevState.students[b].marks).reduce((acc, initital) => {
            return acc + prevState.students[b].marks[initital]
          }, 0)),
          sortMarksBy: 'desc'
        }
      } else {
        return {
          sorted: Object.keys(prevState.students).sort((a, b) => Object.keys(prevState.students[b].marks).reduce((acc, initital) => {
            return acc + prevState.students[b].marks[initital]
          }, 0) - Object.keys(prevState.students[a].marks).reduce((acc, initital) => {
            return acc + prevState.students[a].marks[initital]
          }, 0)),
          sortMarksBy: 'asc'
        }
      }
    })
  }

  handleSearch = e => {
    let x = `^${e.target.value}`
    let regex = new RegExp(x, "gi");  
    this.setState(prevState => ({
      searchStudent: Object.keys(prevState.students).filter(student =>
        ("" + prevState.students[student].name).match(regex)
      ),
      search: true
    }));
  };

  handleCard = (id) => {
    this.props.history.push(`/${id}`)
  }

  componentDidMount(){
    axios
      .get(`https://api.myjson.com/bins/1dlper`)
      .then(response => {
        this.setState({ students: response.data });
      });
  }

  render() {
    let { sorted, sortMarksBy } = this.state
    if(Object.keys(this.state.students).length == 0){
      return (<Loader show={true} message={'loading'} />)
    }
    else if (this.props.match.path === "/:number"){
      return (
        <div className="d-flex justify-content-center p-4">
          <div className="card" style={{ width: "80%" }}>
        <div className="card-body">
          <h5 className="card-title">Name: {this.state.students[this.props.match.params.number].name}</h5>
            <h5 className="card-title">Id: {this.props.match.params.number}</h5>
          <h5 className="card-title">Total Marks: {Object.keys(this.state.students[this.props.match.params.number].marks).reduce((acc, initital) => {
            return acc + this.state.students[this.props.match.params.number].marks[initital]
          }, 0)}</h5>

          <div className="chart">
          {
                Object.keys(this.state.students[this.props.match.params.number].marks).map(data => (
                  <div key={data}>
                    <span>{data}
                  <div className="progress my-4">
                      <div className="progress-bar" role="progressbar" style={{ width: `${this.state.students[this.props.match.params.number].marks[data]}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax={"" + this.state.students[this.props.match.params.number].marks[data]}>{this.state.students[this.props.match.params.number].marks[data]}%</div>
                      </div></span>
                  </div>
                ))
          }
          </div>
        </div>
            </div>
      </div>)
    }
    else {
    return (
      <div className="App">
        <header className="sticky-top d-flex p-4">
            <input className="form-control mx-2" type="search" onChange={this.handleSearch.bind(this)} placeholder="Search" aria-label="Search" />
          <button className="btn btn-primary mx-2" onClick={this.toggleSort.bind(this)}>Sort</button>
          <button className="btn btn-primary mx-2" onClick={this.toggleMarks}>{`Marks Order `+sortMarksBy}</button>
        </header>
        <div className='row'>
          {Object.keys(this.state.searchStudent).length == 0 && this.state.search ? <div className="col-md-12 col-sm-12 col-xs-12 d-flex justify-content-center">No Result Found</div> :
            ((!sorted.length) ? !this.state.search ? Object.keys(this.state.students) : this.state.searchStudent : sorted).map(student => (
              <div key={student} onClick={this.handleCard.bind(this, student)} className="card col-md-4 col-sm-6 col-xs-12" style={{width: "18rem"}}>
                <div className="card-body">
                  <h5 className="card-title">Name: {this.state.students[student].name}</h5>
                  <h5 className="card-title">Id: {student}</h5>
                  <h5 className="card-title">Total Marks: {Object.keys(this.state.students[student].marks).reduce((acc,initital) => {
                  return acc + this.state.students[student].marks[initital]
                  },0)}</h5>
                </div>
          </div>)
          )
          }
        </div>
      </div>
    );
  }
  }
}

export default App;
