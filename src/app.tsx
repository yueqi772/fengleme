import { Component, ReactNode } from 'react';
import './app.css';

class App extends Component<{ children: ReactNode }> {
  componentDidMount() {}
  componentDidShow() {}
  componentDidHide() {}
  render() {
    return this.props.children;
  }
}
export default App;
