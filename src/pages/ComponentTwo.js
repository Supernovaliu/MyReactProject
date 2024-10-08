import React, { Component } from 'react';
import axios from 'axios';

class ComponentTwo extends Component{
  componentDidMount (){
    axios.get('http://localhost:3000/api/learning').then(res => {
      console.log(res);
    })
  }
  render() {
    return (
      <div>
        <h3>Component2</h3>
      </div>
    )
  }
}

export default ComponentTwo;