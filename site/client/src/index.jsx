import React from 'react'
import ReactDOM from 'react-dom'
import { EditorState, ContentState } from 'draft-js'
import { fromJS } from 'immutable'

import api from './api'
import styles from './styles.css'
import CommentBox from './components/CommentBox'
import CommentItem from './components/CommentItem'
import SubmitButton from './components/SubmitButton'
import {
  maybeEmailAddress,
  validateComment
} from './utils'

const CommentList = ({ list }) => (
  <div className={styles.YoYoCommentListContainer} >
    {
      list.map(c => <CommentItem comment={c} />)
    }
  </div>
)

class App extends React.Component {
  constructor () {
    super()

    this.state = {
      email: '',
      username: '',
      code: ''
    }
  }

  componentDidMount () {
  }

  onUserNameChange (evt) {
    const username = evt.target.value
    this.setState({ username }, async () => {
      const valid = await api.isValidUser({ username })
      if (valid) {
        const code = await api.getCode(username)
        console.log(code)
        this.setState({ code })
      }
    })
  }

  onEmailChange (evt) {
    const email = evt.target.value
    this.setState({ email })
  }

  async handleSubmit() {
    const { username } = this.state;
    const resp = await api.submit({ username })
    const code = await resp.json();
    this.setState({
      code,
    })
  }

  render () {
    const { code } = this.state

    return (
      <div>
        <input
          placeholder="v2ex username"
          onChange={ this.onUserNameChange.bind(this)}>
        </input>
        <input placeholder="code" value="">${code}</input>
        <input
          placeholder="email"
          onChange={ this.onEmailChange.bind(this)}>
        </input>
        <button onClick={ this.handleSubmit.bind(this) }> Submit </button>
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
