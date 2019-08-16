import React, { Component } from 'react';
    import axios from 'axios';

    class ReactUploadImage extends Component {
      constructor() {
        super();
        this.state = {
          description: '',
          question: '',
          answer: '',
        };
      }

      onChange = (e) => {
        switch (e.target.name) {
          case 'question':
            this.setState({ question: e.target.files[0] });
            break;
          default:
            this.setState({ [e.target.name]: e.target.value });
        }
      };

      onChange2 = (e) => {
        switch (e.target.name) {
          case 'answer':
            this.setState({ answer: e.target.files[0] });
            break;
          default:
            this.setState({ [e.target.name]: e.target.value });
        }
      };

      onSubmit = (e) => {
        e.preventDefault();
        const { description, question, answer } = this.state;
        let formData = new FormData();

        formData.append('description', description);
        formData.append('question', question);
        formData.append('answer', answer);

        axios.post('/uploadpic', formData)
          .then((result) => {
            // access results...
          });
      }

      render() {
        const { description, question, answer } = this.state;
        return (
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              name="description"
              value={description}
              onChange={this.onChange}
            />
            <input
              type="file"
              name="question"
              onChange={this.onChange}
            />
             <input
              type="file"
              name="answer"
              onChange={this.onChange2}
            />
            <button type="submit">Submit</button>
          </form>
        );
      }
    }

export default ReactUploadImage