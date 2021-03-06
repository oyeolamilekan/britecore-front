import React, { Component } from "react";
import Axios from "axios";
import url from "./urls";
import removeWhiteSpaces from "./utils";
// Forms generator
// Not my best, but am open to better solutions

class Forms extends Component {
  constructor(props) {
    super(props);
    this.dict = {};
    this.state = {
      insuranceList: [],
      chosen: false,
      riskList: [],
      riskTitle: "",
      isClicked: false,
      riskData: {}
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  // We first get the list of risk from our api
  componentDidMount() {
    Axios.get(`${url}/api/r_risk/`).then(res =>
      this.setState({ insuranceList: res.data })
    );
  }

  handleDismiss(event) {
    event.preventDefault();
    this.setState({
      isClicked: false
    });
  }

  onClicked(id) {
    this.dict = {}
    Axios.get(`${url}/api/r_risk/${id}`).then(res =>
      this.setState({
        riskList: res.data.datatypes,
        riskTitle: res.data.title,
        riskData: {},
        chosen: true,
        isClicked:false
      })
    );
  }

  onChange(event) {
    event.preventDefault();
    this.dict[event.target.name] = event.target.value;
    this.setState({
      riskData: this.dict
    });
  }
  onSubmit(event) {
    event.preventDefault();
    event.target.reset();
    this.setState({
      isClicked: true,
      riskData: this.dict
    });
    // console.log(this.state.riskData)
  }

  render() {
    const {
      chosen,
      riskList,
      riskTitle,
      isClicked,
      insuranceList,
      riskData
    } = this.state;
    console.log(riskData);
    return (
      <div className="col-md-6 offset-md-3 mt-4">
        <h4 className="text-center mb-3">{riskTitle}</h4>
        {isClicked ? (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <strong>We are closed</strong> Sorry check back later
            <button
              type="button"
              className="close"
              onClick={this.handleDismiss}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ) : (
          ""
        )}
        {chosen
          ? React.createElement(
              "div",
              { className: "generated-form" },
              React.createElement(
                "form",
                { onSubmit: this.onSubmit,  },
                riskList.map((data, key) =>
                  React.createElement(
                    "div",
                    { className: "form-group" },

                    React.createElement("input", {
                      type: `${
                        data.substring(data.indexOf(":") + 2) === "text"
                          ? "text"
                          : data.substring(data.indexOf(":") + 2) === "date"
                          ? "date"
                          : data.substring(data.indexOf(":") + 2) === "number"
                          ? "number"
                          : "text"
                      }`,
                      placeholder: data.substring(0, data.indexOf(":")),
                      className: "form-control",
                      name: removeWhiteSpaces(
                        data.substring(0, data.indexOf(":")).toLowerCase()
                      ),
                      onChange: this.onChange
                    })
                  )
                ),
                React.createElement(
                  "button",
                  { className: "btn btn-success btn-block" },
                  "Submit me"
                )
              )
            )
          : ""}
        <div className="mt-2 textt-center">
          <h2 className="text-center mt-2">Data model</h2>
          {insuranceList.map((data, key) => (
            <li key={key}>
              <a
                className="s"
                onClick={() => this.onClicked(data.id)}
                href="/#"
              >
                {data.title} {data.id} f
              </a>
            </li>
          ))}
          <br />

          {isClicked ? (
            <div className="parent">
              <h2 className="text-center mt-2">Form submitted</h2>
              <div className="parsed-data">
                {Object.entries(riskData).map(([key, value]) => {
                  return (
                    <li key={key}>
                      <b>{key}:</b> {value}
                    </li>
                  );
                })}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default Forms;
