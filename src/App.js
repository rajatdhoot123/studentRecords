import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Loader from 'react-loader-advanced'

class App extends Component {
  state = {
    students: {},
    search: false,
    sorted: [],
    sortMarksBy: 'desc'
  }

  toggleSort = () => {
    this.setState(prevState => {
      console.log(prevState.sorted)
      if (prevState.sortMarksBy === "asc") {
        return {
          sorted: (!prevState.sorted.length ? Object.keys(prevState.students)  : prevState.sorted).sort((a, b) => prevState.students[a].name.localeCompare(prevState.students[b].name)),
          sortMarksBy: 'desc'
        }
      } else {
        return {
          sorted: (!prevState.sorted.length ? Object.keys(prevState.students) : prevState.sorted).sort((a, b) => prevState.students[b].name.localeCompare(prevState.students[a].name)),
          sortMarksBy: 'asc'
        }
      }
    })
  }

  toggleMarks = () => {
    this.setState(prevState => {
      if (prevState.sortMarksBy === "asc") {
        return {
          sorted: (!prevState.sorted.length ? Object.keys(prevState.students) : prevState.sorted).sort((a, b) => Object.keys(prevState.students[a].marks).reduce((acc, initital) => {
            return acc + prevState.students[a].marks[initital]
          }, 0) - Object.keys(prevState.students[b].marks).reduce((acc, initital) => {
            return acc + prevState.students[b].marks[initital]
          }, 0)),
          sortMarksBy: 'desc'
        }
      } else {
        return {
          sorted: (!prevState.sorted.length ? Object.keys(prevState.students) : prevState.sorted).sort((a, b) => Object.keys(prevState.students[b].marks).reduce((acc, initital) => {
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
    let name = `^${e.target.value}`
    let regex = new RegExp(name, "gi");
    this.setState(prevState => ({
      sorted: Object.keys(prevState.students).filter(student =>
        ("" + prevState.students[student].name).match(regex)
      ),
      search: true
    }));
  };

  handleCard = (id) => {
    this.props.history.push(`/${id}`)
  }

  componentDidMount() {
    axios
      .get(`https://api.myjson.com/bins/1dlper`)
      .then(response => {
        this.setState({ students: response.data });
      });
  }

  render() {
    let { sorted, students, search } = this.state
    if (Object.keys(students).length === 0) {
      return (<Loader show={true} message={'loading'} />)
    }
    else if (this.props.match.path === "/:number") {
      return (
        <div className="d-flex justify-content-center p-4">
          <div className="card" style={{ width: "80%" }}>
            <div className="card-body">
              <h5 className="card-title">Name: {students[this.props.match.params.number].name}</h5>
              <h5 className="card-title">Id: {this.props.match.params.number}</h5>
              <h5 className="card-title">Total Marks: {Object.keys(students[this.props.match.params.number].marks).reduce((acc, initital) => {
                return acc + students[this.props.match.params.number].marks[initital]
              }, 0)}</h5>

              <div className="chart">
                {
                  Object.keys(students[this.props.match.params.number].marks).map(data => (
                    <div key={data} className="d-flex">
                      <p>{data}</p>
                      <div className="progress mx-4 w-75 mt-1">
                        <div className="progress-bar" role="progressbar" style={{ width: `${students[this.props.match.params.number].marks[data]}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax={"" + students[this.props.match.params.number].marks[data]}>{students[this.props.match.params.number].marks[data]}%</div>
                      </div>
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
          <header className="sticky-top row p-3">
            <div className="col-md-8 my-2">
              <input className="form-control" type="search" onChange={this.handleSearch} placeholder="Search" aria-label="Search" />
            </div>
            <div className="col-md-2 my-2">
              <button className="btn btn-primary btn-block" onClick={this.toggleSort}>Sort by Name</button>
            </div>
            <div className="col-md-2 my-2">
              <button className="btn btn-primary btn-block" onClick={this.toggleMarks}>Sort by Marks</button>
            </div>
          </header>
          <div className="container-fluid" >
            <div className='row'>
              {Object.keys(sorted).length === 0 && search ? <div className="col-md-12 col-sm-12 col-xs-12 d-flex justify-content-center">No Result Found</div> :
                ((!sorted.length) ? !search ? Object.keys(students) : sorted : sorted).map(student => (
                  <div key={student} onClick={this.handleCard.bind(this, student)} className="card col-md-4 col-sm-6 col-xs-12" >
                    <div className="card-body">
                      <h5 className="card-title">Name: {students[student].name}</h5>
                      <h5 className="card-title">Id: {student}</h5>
                      <h5 className="card-title">Total Marks: {Object.keys(students[student].marks).reduce((acc, initital) => {
                        return acc + students[student].marks[initital]
                      }, 0)}</h5>
                    </div>
                  </div>)
                )
              }
            </div>
          </div>
        </div>
      );
    }
  }
}

export default App;
