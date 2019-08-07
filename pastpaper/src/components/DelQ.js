import React, { Component } from 'react';
import './DelQ.css'

class DelQ extends Component {
  constructor(props){
    super(props);
    this.state = {
  
    }
  }
  
  render() {
    const data= (        
            <div> </div>  
    )

    return (
      <div className="main_container">
        <h1 className="title"> DELETE A QUESTION </h1>
        <main>
          <table>
            <thead>
              <tr>
                <th> Subject</th>
                <th> Year</th>
                <th> Zone</th>
                <th> Paper</th>
                <th> Topic</th>
                <th> Subtopic</th>
                <th> Difficulty</th>
                <th> Description</th>
                <th> Question</th>
                <th> Answer</th>

                <th> </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Chemistry</td>
                <td>1997</td>
                <td>3</td>
                <td>1</td>
                <td>Organic</td>
                <td>Alkanines</td>
                <td>11</td>
                <td></td>
                <td><a href = "https://google.com">googledrive.com/asdafs</a></td>
                <td>B</td>
                
                <td className='select'>
                  <a className='button' href='#'>
                    Delete
                  </a>
                </td>
              </tr>

              <tr>
                <td>Physics</td>
                <td>2016</td>
                <td>3</td>
                <td>1</td>
                <td>Nuclear</td>
                <td>Decay</td>
                <td>10</td>
                <td></td>
                <td><a href = "https://google.com">googledrive.com/asaflkni</a></td>
                <td>C</td>
                
                <td className='select'>
                  <a className='button' href='#'>
                    Delete
                  </a>
                </td>
              </tr>
            </tbody>

          </table>
        </main>

      </div>
    );
  }
}
export default DelQ;