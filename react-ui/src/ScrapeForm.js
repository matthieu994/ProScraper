import React, { Component } from "react"
import { Paper, InputBase, IconButton, Icon, FormControl } from "@material-ui/core"
import Table from "./Table"
import Axios from "axios"
import "./ScrapeForm.scss"

export default class ScrapeForm extends Component {
    state = {
        addInput: "",
        isFetching: false,
        items: []
    }

    componentDidMount() {
        Axios.get("/api/scrape/items", { name: "name", selector: "test" })
            .then(res => {
                this.setState({ isFetching: false, items: res.data.items })
            })
            .catch(err => {
                this.setState({ isFetching: false })
            })
    }

    addItem() {
        let value = this.state.addInput

        if (!value) return

        // Axios.post("/api/scrape/items", { name: "name", selector: "test" })
        //     .then(res => {
        //         this.setState({ isFetching: false })
        //         console.log(res.data)
        //     })
        //     .catch(err => {
        //         this.setState({ isFetching: false })
        //     })
    }

    render() {
        return (
            <>
                <Paper className="input-container">
                    <InputBase
                        id="add-scrape"
                        placeholder="Add your selector !"
                        type="text"
                        onChange={e => this.setState({ addInput: e.target.value })}
                    />
                    <InputBase
                        id="add-scrape-name"
                        placeholder="Set the scrape name !"
                        type="text"
                        onChange={e => this.setState({ addInput: e.target.value })}
                    />
                    <IconButton onClick={() => this.addItem()}>
                        <Icon>add</Icon>
                    </IconButton>
                </Paper>
                <Table items={this.state.items} />
            </>
        )
    }
}
