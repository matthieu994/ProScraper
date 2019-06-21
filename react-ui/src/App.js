import React, { Component } from "react"
import { Grid } from "@material-ui/core"
import ScrapeForm from "./ScrapeForm"
import "./App.scss"

export default class App extends Component {
    render() {
        return (
            <Grid container spacing={2} direction="column" justify="center" alignItems="center">
                <ScrapeForm />
            </Grid>
        )
    }
}
