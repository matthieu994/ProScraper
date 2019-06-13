import React, { Component } from "react"
import { Paper, InputBase, IconButton, Icon } from "@material-ui/core"
import Axios from "axios"
import "./App.css"

export default class App extends Component {
    state = {
        isFetching: true,
        message: null
    }

    componentDidMount() {
        Axios.get("/api/welcome")
            .then(res => {
                this.setState({ isFetching: false, message: res.data.message })
            })
            .catch(err => {
                this.setState({ isFetching: false, message: err.response.data.message })
            })
    }

    render() {
      console.log(this.state.message)
        return (
            <>
                <Paper className="input-container">
                    <InputBase id="add-scrape" placeholder="Scrape !" type="text" />
                    <IconButton>
                        <Icon>add</Icon>
                    </IconButton>
                </Paper>
            </>
        )
    }
}
