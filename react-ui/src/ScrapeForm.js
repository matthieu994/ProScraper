import React, { Component } from "react"
import { Paper, InputBase, IconButton, Icon, Grid, MenuItem, TextField } from "@material-ui/core"
import Axios from "axios"
import Table from "./Table"
import "./ScrapeForm.scss"

export default class ScrapeForm extends Component {
    state = {
        name: "",
        selector: "",
        isFetching: true,
        items: [],
        selectorType: "native"
    }

    componentDidMount() {
        this.getItems()
    }

    async getItems() {
        return Axios.get("/api/scrape/items")
            .then(res => {
                this.setState({ isFetching: false, items: res.data })
            })
            .catch(err => {
                this.setState({ isFetching: false })
                console.error(err)
            })
    }

    addItem() {
        let { name, selector } = this.state

        if (!name || !selector) return

        if (this.state.selectorType === "id") selector = "#".concat(selector)
        if (this.state.selectorType === "class") selector = ".".concat(selector)

        Axios.post("/api/scrape/items", { name, selector }).then(res => {
            this.setState({ items: this.state.items.concat([res.data]) })
        })
    }

    deleteItem(id) {
        Axios.delete(`/api/scrape/items/${id}`).then(res => {
            let items = this.state.items
            let index = items.findIndex(item => item._id === id)
            if (index >= 0) {
                items.splice(index, 1)
                this.setState({ items })
            }
        })
    }

    render() {
        return (
            <>
                <Grid container direction="column" justify="center" alignItems="center">
                    <Paper className="input-container">
                        <Paper className="input-container">
                            <TextField
                                select
                                value={this.state.selectorType}
                                onChange={e => this.setState({ selectorType: e.target.value })}
                            >
                                {["native", "class", "id"].map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <InputBase
                                id="add-scrape"
                                placeholder="Add your selector !"
                                type="text"
                                onChange={e => this.setState({ selector: e.target.value })}
                            />
                        </Paper>
                        <Paper className="input-container">
                            <InputBase
                                id="add-scrape-name"
                                placeholder="Name"
                                type="text"
                                onChange={e => this.setState({ name: e.target.value })}
                            />
                            <IconButton onClick={() => this.addItem()}>
                                <Icon>add</Icon>
                            </IconButton>
                        </Paper>
                    </Paper>
                </Grid>
                <Table
                    items={this.state.items}
                    deleteItem={id => this.deleteItem(id)}
                    isFetching={this.state.isFetching}
                />
            </>
        )
    }
}
