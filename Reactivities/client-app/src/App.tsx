import * as React from "react";
import "./App.css";
import { Header, List } from "semantic-ui-react";
import axios from "axios";

class App extends React.Component {
  state = {
    values: [],
  };

  componentDidMount() {
    axios
      .get("http://localhost:5000/api/values")
      .then((res) => {
        this.setState({
          values: res.data,
        });
      })
      .catch((err) => {
        console.log("Oh fuck, something went wrong." + err);
      });
  }

  public render() {
    return (
      <div className="App">
        <Header as="h2" icon="users" content="Reactivities" />
        <List>
          {this.state.values.map((value: any) => (
            <List.Item key={value.id}>{value.name}</List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default App;
